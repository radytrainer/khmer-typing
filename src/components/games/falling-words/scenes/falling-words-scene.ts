import Phaser from "phaser"
import type { Difficulty } from "@prisma/client"
import { getWordsByCategory, type KhmerWord, type WordCategory } from "@/data/khmer"
import { DIFFICULTY_SETTINGS, type FallingWordsResult } from "@/features/games/falling-words/types"

interface FallingWordSprite {
  container: Phaser.GameObjects.Container
  /** Full word rendered as ONE shaped run — Khmer consonant/coeng/vowel clusters only shape
   * correctly (subscripts, wrapping vowel signs, etc.) when the whole string is laid out
   * together; splitting it into one Text per codepoint (the previous approach) rendered every
   * combining mark in isolation and produced broken glyphs. */
  baseText: Phaser.GameObjects.Text
  /** Identical text/position, colored for "typed" progress and cropped from the left edge to
   * reveal only what's been typed so far — this is what lets per-keystroke progress show without
   * ever re-shaping a partial substring. */
  typedText: Phaser.GameObjects.Text
  /** Per-codepoint breakdown (not grapheme clusters) — matches one physical keystroke each, same
   * granularity Falling Letters uses (a coeng sign or vowel sign is its own keystroke). Used only
   * for input matching/scoring, never for rendering. */
  chars: string[]
  meta: KhmerWord
  typedIndex: number
  speed: number
  scoreGained: number
}

const KHMER_FONT = '"Noto Sans Khmer", sans-serif'
const TYPED_COLOR = "#34d399"
const LEVEL_UP_EVERY_WORDS = 5

export class FallingWordsScene extends Phaser.Scene {
  private difficulty: Difficulty = "easy"
  private category: WordCategory = "animals"
  private wordPool: KhmerWord[] = []
  private activeWords: FallingWordSprite[] = []
  private hearts = 3
  private score = 0
  private combo = 0
  private maxCombo = 0
  private correctCount = 0
  private wrongCount = 0
  private wordsCompleted = 0
  private startTime = 0
  private spawnTimer?: Phaser.Time.TimerEvent
  private spawnDelay = 2000
  private fallSpeed = 45
  private isOver = false
  private particleTextureKey = "kt-particle"
  /** Hidden, reused Text used only to measure substring pixel widths (for the reveal-crop), so we
   * don't have to create/destroy a throwaway Text object on every keystroke. */
  private measurer!: Phaser.GameObjects.Text

  constructor() {
    super("falling-words")
  }

  init(data: { difficulty: Difficulty; category: WordCategory }) {
    this.difficulty = data.difficulty
    this.category = data.category
    const settings = DIFFICULTY_SETTINGS[this.difficulty]
    this.hearts = settings.startingHearts
    this.spawnDelay = settings.initialSpawnMs
    this.fallSpeed = settings.initialFallSpeed
    this.wordPool = getWordsByCategory(this.category)
    this.activeWords = []
    this.score = 0
    this.combo = 0
    this.maxCombo = 0
    this.correctCount = 0
    this.wrongCount = 0
    this.wordsCompleted = 0
    this.isOver = false
  }

  create() {
    this.startTime = this.time.now
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0)")
    this.generateParticleTexture()
    this.measurer = this.add.text(0, 0, "", { fontFamily: KHMER_FONT, fontSize: "30px" }).setVisible(false)

    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay,
      loop: true,
      callback: () => this.spawnWord(),
    })

    this.input.keyboard?.on("keydown", this.handleKeyDown, this)
    // Lets the on-screen keyboard (tap-to-type — essential on mobile, where there's no physical
    // Khmer keyboard) feed the same hit-detection logic as a real keydown.
    this.game.events.on("virtual-key", this.processChar, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off("keydown", this.handleKeyDown, this)
      this.game.events.off("virtual-key", this.processChar, this)
    })

    this.emitState()
  }

  private generateParticleTexture() {
    if (this.textures.exists(this.particleTextureKey)) return
    const g = this.add.graphics()
    g.fillStyle(0xffd166, 1)
    g.fillCircle(4, 4, 4)
    g.generateTexture(this.particleTextureKey, 8, 8)
    g.destroy()
  }

  private buildWordSprite(meta: KhmerWord): FallingWordSprite {
    const chars = Array.from(meta.word)
    const container = this.add.container(0, -20)

    const baseStyle = {
      fontFamily: KHMER_FONT,
      fontSize: "30px",
      color: "#ffffff",
      stroke: "#1e293b",
      strokeThickness: 5,
    }
    const baseText = this.add.text(0, 0, meta.word, baseStyle).setOrigin(0.5, 0.5)
    const typedText = this.add
      .text(0, 0, meta.word, { ...baseStyle, color: TYPED_COLOR })
      .setOrigin(0.5, 0.5)
    typedText.setCrop(0, 0, 0, typedText.height) // nothing "typed" yet

    container.add(baseText)
    container.add(typedText)

    return { container, baseText, typedText, chars, meta, typedIndex: 0, speed: this.fallSpeed, scoreGained: 0 }
  }

  /** Pixel width of `text` rendered in the same font, without adding a throwaway Text object per call. */
  private measureWidth(text: string): number {
    this.measurer.setText(text)
    return this.measurer.width
  }

  /** Reveals the "typed" (green) overlay up to the current progress, left-to-right. */
  private updateWordProgress(word: FallingWordSprite) {
    const typedPortion = word.chars.slice(0, word.typedIndex).join("")
    const revealWidth = typedPortion ? this.measureWidth(typedPortion) : 0
    word.typedText.setCrop(0, 0, revealWidth, word.typedText.height)
  }

  private spawnWord() {
    if (this.isOver || this.wordPool.length === 0) return
    const meta = Phaser.Utils.Array.GetRandom(this.wordPool)
    const sprite = this.buildWordSprite(meta)

    const halfWidth = sprite.baseText.width / 2
    const minX = halfWidth + 10
    const maxX = Math.max(minX, this.scale.width - halfWidth - 10)
    sprite.container.setPosition(Phaser.Math.Between(minX, maxX), -20)

    this.activeWords.push(sprite)
    this.emitState()
  }

  update(_time: number, delta: number) {
    if (this.isOver) return
    const dt = delta / 1000

    for (const word of [...this.activeWords]) {
      word.container.y += word.speed * dt
      if (word.container.y > this.scale.height + 20) {
        this.missWord(word)
      }
    }
  }

  private missWord(word: FallingWordSprite) {
    this.removeWord(word)
    this.combo = 0
    this.hearts -= 1
    this.cameras.main.shake(150, 0.008)

    if (this.hearts <= 0) {
      this.endGame()
    } else {
      this.emitState()
    }
  }

  private removeWord(word: FallingWordSprite) {
    word.container.destroy()
    this.activeWords = this.activeWords.filter((w) => w !== word)
  }

  /** Only the word closest to the ground accepts keystrokes — matches the single-target highlight the on-screen keyboard shows. */
  private targetWord(): FallingWordSprite | null {
    return this.activeWords.reduce<FallingWordSprite | null>((acc, w) => {
      if (!acc || w.container.y > acc.container.y) return w
      return acc
    }, null)
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.processChar(event.key)
  }

  private processChar(char: string) {
    if (this.isOver) return
    const target = this.targetWord()
    if (!target) return

    if (char === target.chars[target.typedIndex]) {
      this.hitChar(target)
    } else if (char.length === 1) {
      this.combo = 0
      this.wrongCount += 1
      this.flashWrong(target)
      this.emitState()
    }
  }

  private hitChar(word: FallingWordSprite) {
    word.typedIndex += 1
    this.updateWordProgress(word)

    this.combo += 1
    this.maxCombo = Math.max(this.maxCombo, this.combo)
    this.correctCount += 1

    const comboMultiplier = 1 + Math.min(this.combo, 20) * 0.05
    const gained = Math.round(10 * comboMultiplier)
    this.score += gained
    word.scoreGained += gained

    if (word.typedIndex >= word.chars.length) {
      this.completeWord(word)
    } else {
      this.emitState()
    }
  }

  private completeWord(word: FallingWordSprite) {
    const bonus = word.chars.length * 5
    this.score += bonus
    this.wordsCompleted += 1

    this.spawnExplosion(word.container.x, word.container.y)
    this.spawnFloatingScore(word.container.x, word.container.y, word.scoreGained + bonus)
    this.removeWord(word)
    this.maybeSpeedUp()
    this.emitState()
  }

  private flashWrong(word: FallingWordSprite) {
    const homeX = word.container.x
    this.tweens.add({
      targets: word.container,
      x: homeX + 6,
      yoyo: true,
      repeat: 3,
      duration: 40,
      onComplete: () => word.container.setX(homeX),
    })
  }

  private maybeSpeedUp() {
    if (this.wordsCompleted % LEVEL_UP_EVERY_WORDS !== 0) return
    this.fallSpeed += 6
    this.spawnDelay = Math.max(900, this.spawnDelay - 120)
    this.spawnTimer?.remove()
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay,
      loop: true,
      callback: () => this.spawnWord(),
    })
  }

  private spawnExplosion(x: number, y: number) {
    const emitter = this.add.particles(x, y, this.particleTextureKey, {
      speed: { min: 80, max: 220 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.2, end: 0 },
      lifespan: 400,
      quantity: 14,
      emitting: false,
    })
    emitter.explode(14, x, y)
    this.time.delayedCall(450, () => emitter.destroy())
  }

  private spawnFloatingScore(x: number, y: number, amount: number) {
    const label = this.add
      .text(x, y, `+${amount}`, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "20px",
        color: TYPED_COLOR,
        fontStyle: "bold",
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: label,
      y: y - 50,
      alpha: 0,
      duration: 600,
      ease: "Cubic.easeOut",
      onComplete: () => label.destroy(),
    })
  }

  private endGame() {
    this.isOver = true
    this.spawnTimer?.remove()
    for (const word of [...this.activeWords]) this.removeWord(word)

    const durationSeconds = Math.max(1, Math.round((this.time.now - this.startTime) / 1000))
    const result: FallingWordsResult = {
      score: this.score,
      correctCount: this.correctCount,
      wrongCount: this.wrongCount,
      maxCombo: this.maxCombo,
      durationSeconds,
      difficulty: this.difficulty,
    }
    this.game.events.emit("game-over", result)
  }

  private emitState() {
    const target = this.targetWord()

    this.game.events.emit("state-update", {
      score: this.score,
      hearts: this.hearts,
      combo: this.combo,
      targetChar: target ? (target.chars[target.typedIndex] ?? null) : null,
      romanization: target?.meta.romanization ?? null,
      englishMeaning: target?.meta.englishMeaning ?? null,
    })
  }
}
