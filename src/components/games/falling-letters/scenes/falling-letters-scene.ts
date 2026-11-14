import Phaser from "phaser"
import type { Difficulty } from "@prisma/client"
import { ALL_KHMER_LETTERS } from "@/data/khmer"
import { DIFFICULTY_CATEGORIES, DIFFICULTY_SETTINGS, type FallingLettersResult } from "@/features/games/falling-letters/types"

interface FallingLetterSprite {
  text: Phaser.GameObjects.Text
  char: string
  speed: number
}

const KHMER_FONT = '"Noto Sans Khmer", sans-serif'
const LEVEL_UP_EVERY_HITS = 10

export class FallingLettersScene extends Phaser.Scene {
  private difficulty: Difficulty = "easy"
  private letterPool: string[] = []
  private activeLetters: FallingLetterSprite[] = []
  private hearts = 3
  private score = 0
  private combo = 0
  private maxCombo = 0
  private correctCount = 0
  private wrongCount = 0
  private startTime = 0
  private spawnTimer?: Phaser.Time.TimerEvent
  private spawnDelay = 1200
  private fallSpeed = 70
  private isOver = false
  private particleTextureKey = "kt-particle"

  constructor() {
    super("falling-letters")
  }

  init(data: { difficulty: Difficulty }) {
    this.difficulty = data.difficulty
    const settings = DIFFICULTY_SETTINGS[this.difficulty]
    this.hearts = settings.startingHearts
    this.spawnDelay = settings.initialSpawnMs
    this.fallSpeed = settings.initialFallSpeed
    this.letterPool = ALL_KHMER_LETTERS.filter((l) =>
      DIFFICULTY_CATEGORIES[this.difficulty].includes(l.category),
    ).map((l) => l.char)
    this.activeLetters = []
    this.score = 0
    this.combo = 0
    this.maxCombo = 0
    this.correctCount = 0
    this.wrongCount = 0
    this.isOver = false
  }

  create() {
    this.startTime = this.time.now
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0)")
    this.generateParticleTexture()

    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay,
      loop: true,
      callback: () => this.spawnLetter(),
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

  private spawnLetter() {
    if (this.isOver || this.letterPool.length === 0) return
    const char = Phaser.Utils.Array.GetRandom(this.letterPool)
    const x = Phaser.Math.Between(30, this.scale.width - 30)
    const text = this.add
      .text(x, -20, char, {
        fontFamily: KHMER_FONT,
        fontSize: "34px",
        color: "#ffffff",
        stroke: "#1e293b",
        strokeThickness: 5,
      })
      .setOrigin(0.5)

    this.activeLetters.push({ text, char, speed: this.fallSpeed })
    this.emitState()
  }

  update(_time: number, delta: number) {
    if (this.isOver) return
    const dt = delta / 1000

    for (const letter of [...this.activeLetters]) {
      letter.text.y += letter.speed * dt
      if (letter.text.y > this.scale.height + 20) {
        this.missLetter(letter)
      }
    }
  }

  private missLetter(letter: FallingLetterSprite) {
    this.removeLetter(letter)
    this.combo = 0
    this.hearts -= 1
    this.cameras.main.shake(150, 0.008)

    if (this.hearts <= 0) {
      this.endGame()
    } else {
      this.emitState()
    }
  }

  private removeLetter(letter: FallingLetterSprite) {
    letter.text.destroy()
    this.activeLetters = this.activeLetters.filter((l) => l !== letter)
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.processChar(event.key)
  }

  private processChar(char: string) {
    if (this.isOver) return
    const match = this.activeLetters.find((l) => l.char === char)

    if (match) {
      this.hitLetter(match)
    } else if (char.length === 1) {
      this.combo = 0
      this.wrongCount += 1
      this.emitState()
    }
  }

  private hitLetter(letter: FallingLetterSprite) {
    this.combo += 1
    this.maxCombo = Math.max(this.maxCombo, this.combo)
    this.correctCount += 1

    const comboMultiplier = 1 + Math.min(this.combo, 20) * 0.05
    const gained = Math.round(10 * comboMultiplier)
    this.score += gained

    this.spawnExplosion(letter.text.x, letter.text.y)
    this.spawnFloatingScore(letter.text.x, letter.text.y, gained)
    this.removeLetter(letter)
    this.maybeSpeedUp()
    this.emitState()
  }

  private maybeSpeedUp() {
    if (this.correctCount % LEVEL_UP_EVERY_HITS !== 0) return
    this.fallSpeed += 8
    this.spawnDelay = Math.max(400, this.spawnDelay - 60)
    this.spawnTimer?.remove()
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay,
      loop: true,
      callback: () => this.spawnLetter(),
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
        color: "#34d399",
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
    for (const letter of [...this.activeLetters]) this.removeLetter(letter)

    const durationSeconds = Math.max(1, Math.round((this.time.now - this.startTime) / 1000))
    const result: FallingLettersResult = {
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
    const soonest = this.activeLetters.reduce<FallingLetterSprite | null>((acc, l) => {
      if (!acc || l.text.y > acc.text.y) return l
      return acc
    }, null)

    this.game.events.emit("state-update", {
      score: this.score,
      hearts: this.hearts,
      combo: this.combo,
      targetChar: soonest?.char ?? null,
    })
  }
}
