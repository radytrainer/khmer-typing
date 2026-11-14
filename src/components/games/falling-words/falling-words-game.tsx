"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Phaser from "phaser"
import * as Icons from "lucide-react"
import type { Difficulty } from "@prisma/client"
import type { WordCategory } from "@/data/khmer"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { KhmerKeyboard } from "@/components/keyboard/khmer-keyboard"
import { useKhmerKeyboard } from "@/hooks/use-khmer-keyboard"
import { FallingWordsHud } from "./hud"
import { GameOverModal, type GameOverStats } from "./game-over-modal"
import { FallingWordsScene } from "./scenes/falling-words-scene"
import { DIFFICULTY_SETTINGS, CATEGORY_OPTIONS, type FallingWordsResult } from "@/features/games/falling-words/types"
import { calculateAccuracy, calculateKpm } from "@/features/scoring/formulas"

type Phase = "select" | "countdown" | "playing" | "game-over"

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; description: string; color: string }[] = [
  { value: "easy", label: "Easy", description: "Slow fall speed, 4 hearts", color: "from-emerald-400 to-teal-600" },
  { value: "medium", label: "Medium", description: "Faster pace, 3 hearts", color: "from-amber-400 to-orange-600" },
  { value: "hard", label: "Hard", description: "Fast & unforgiving, 3 hearts", color: "from-rose-400 to-red-600" },
]

export function FallingWordsGame({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [phase, setPhase] = useState<Phase>("select")
  const [category, setCategory] = useState<WordCategory | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [countdown, setCountdown] = useState(3)
  const [hud, setHud] = useState({
    score: 0,
    hearts: 0,
    combo: 0,
    targetChar: null as string | null,
    romanization: null as string | null,
    englishMeaning: null as string | null,
  })
  const [gameOverStats, setGameOverStats] = useState<GameOverStats | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newAchievements, setNewAchievements] = useState<{ code: string; name: string; icon: string; rarity: string }[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  // Canvas text doesn't repaint when a webfont finishes loading mid-render (unlike DOM text), so
  // Phaser can draw a fallback-font frame before "Noto Sans Khmer" is ready. Kick the load off as
  // early as possible (well before the countdown finishes) and the game-creation effect below
  // awaits it too, so falling words never render in the wrong font.
  const fontsReadyRef = useRef<Promise<unknown> | null>(null)
  if (typeof document !== "undefined" && !fontsReadyRef.current) {
    fontsReadyRef.current = document.fonts.load('bold 30px "Noto Sans Khmer"')
  }

  const { activeCode, shiftActive } = useKhmerKeyboard({ enabled: phase === "playing" })

  const submitScore = useCallback(async (result: FallingWordsResult) => {
    const kpm = calculateKpm(result.correctCount, result.durationSeconds)
    const accuracy = calculateAccuracy(result.correctCount, result.wrongCount)

    setGameOverStats({
      score: result.score,
      correctCount: result.correctCount,
      wrongCount: result.wrongCount,
      maxCombo: result.maxCombo,
      kpm,
      accuracy,
      xpEarned: 0,
      coinsEarned: 0,
    })
    setPhase("game-over")

    // Guests can play freely, but there's no account to attach a score to — skip the save
    // entirely rather than firing a request that /api/scores would just reject with 401.
    if (!isAuthenticated) return

    setIsSaving(true)

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameSlug: "falling-words",
          difficulty: result.difficulty,
          score: result.score,
          correctCount: result.correctCount,
          wrongCount: result.wrongCount,
          maxCombo: result.maxCombo,
          durationSeconds: result.durationSeconds,
          kpm,
          accuracy,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setGameOverStats((prev) => (prev ? { ...prev, xpEarned: data.xpEarned, coinsEarned: data.coinsEarned } : prev))
        setNewAchievements(data.newAchievements ?? [])
      }
    } catch {
      // Best-effort save — the player still sees their in-session stats even if the network call fails.
    } finally {
      setIsSaving(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (phase !== "playing" || !containerRef.current || !category) return

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      transparent: true,
      width: 800,
      height: 500,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: FallingWordsScene,
    })
    gameRef.current = game
    game.scene.start("falling-words", { difficulty, category })

    const onState = (state: typeof hud) => setHud(state)
    const onGameOver = (result: FallingWordsResult) => submitScore(result)
    game.events.on("state-update", onState)
    game.events.on("game-over", onGameOver)

    return () => {
      game.events.off("state-update", onState)
      game.events.off("game-over", onGameOver)
      game.destroy(true)
      gameRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, difficulty, category])

  useEffect(() => {
    if (phase !== "countdown") return
    if (countdown === 0) {
      let cancelled = false
      void Promise.resolve(fontsReadyRef.current).then(() => {
        if (!cancelled) setPhase("playing")
      })
      return () => {
        cancelled = true
      }
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 700)
    return () => clearTimeout(t)
  }, [phase, countdown])

  function startGame() {
    if (!category) return
    setCountdown(3)
    setPhase("countdown")
    setGameOverStats(null)
    setNewAchievements([])
  }

  if (phase === "select" || phase === "game-over") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {phase === "select" && (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold">Falling Words</h1>
              <p className="text-muted-foreground">Pick a category and difficulty to begin.</p>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-bold text-muted-foreground">Category</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CATEGORY_OPTIONS.map((opt) => {
                  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[opt.icon] ?? Icons.BookOpen
                  const selected = category === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setCategory(opt.value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-colors",
                        selected
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                          : "border-transparent bg-muted hover:bg-muted/70",
                      )}
                    >
                      <Icon className={cn("size-6", selected ? "text-emerald-600" : "text-muted-foreground")} />
                      <span className="text-xs font-semibold sm:text-sm">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-bold text-muted-foreground">Difficulty</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDifficulty(opt.value)}
                    className={cn(
                      "rounded-2xl bg-gradient-to-br p-4 text-left text-white shadow transition-transform hover:-translate-y-0.5",
                      opt.color,
                      difficulty === opt.value && "ring-4 ring-white/60",
                    )}
                  >
                    <div className="font-bold">{opt.label}</div>
                    <p className="mt-0.5 text-xs text-white/85">{opt.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              disabled={!category}
              onClick={startGame}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-6 text-base font-bold hover:opacity-90"
            >
              Start Game
            </Button>
          </>
        )}

        <GameOverModal
          open={phase === "game-over"}
          stats={gameOverStats}
          isSaving={isSaving}
          isGuest={!isAuthenticated}
          newAchievements={newAchievements}
          onPlayAgain={startGame}
          onExit={() => setPhase("select")}
        />
      </div>
    )
  }

  return (
    // See Falling Letters for why this is fixed-to-viewport rather than living in normal page flow.
    <div className="fixed inset-x-0 top-16 bottom-0 flex flex-col overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-50 p-3 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 sm:p-4">
      <div className="mx-auto flex w-full max-w-3xl shrink-0 items-center justify-between pb-2 sm:pb-3">
        <h1 className="text-lg font-bold sm:text-xl">Falling Words</h1>
        <Button variant="ghost" size="sm" onClick={() => setPhase("select")}>
          <X className="mr-1 size-4" /> Quit
        </Button>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
        {phase === "countdown" ? (
          <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-emerald-400 to-teal-600">
            <motion.span
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-extrabold text-white sm:text-8xl"
            >
              {countdown === 0 ? "Go!" : countdown}
            </motion.span>
          </div>
        ) : (
          <>
            <FallingWordsHud
              className="shrink-0"
              score={hud.score}
              hearts={hud.hearts}
              maxHearts={DIFFICULTY_SETTINGS[difficulty].startingHearts}
              combo={hud.combo}
              romanization={hud.romanization}
              englishMeaning={hud.englishMeaning}
            />
            <div className="flex min-h-0 flex-1 items-center justify-center bg-gradient-to-b from-emerald-400 to-teal-600">
              <div className="relative h-full max-w-full aspect-[8/5]">
                <div ref={containerRef} className="absolute inset-0" />
                {/* Ground/danger-zone cue: words that reach here cost a heart. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/25 to-transparent" />
              </div>
            </div>
          </>
        )}

        <KhmerKeyboard
          className="shrink-0"
          activeCode={activeCode}
          shiftActive={shiftActive}
          targetChar={hud.targetChar}
          onKeyClick={(char) => gameRef.current?.events.emit("virtual-key", char)}
        />
      </div>
    </div>
  )
}
