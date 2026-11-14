"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Phaser from "phaser"
import type { Difficulty } from "@prisma/client"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KhmerKeyboard } from "@/components/keyboard/khmer-keyboard"
import { useKhmerKeyboard } from "@/hooks/use-khmer-keyboard"
import { FallingLettersHud } from "./hud"
import { GameOverModal, type GameOverStats } from "./game-over-modal"
import { FallingLettersScene } from "./scenes/falling-letters-scene"
import { DIFFICULTY_SETTINGS, type FallingLettersResult } from "@/features/games/falling-letters/types"
import { calculateAccuracy, calculateKpm } from "@/features/scoring/formulas"

type Phase = "select-difficulty" | "countdown" | "playing" | "game-over"

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; description: string; color: string }[] = [
  { value: "easy", label: "Easy", description: "Consonants & numbers, slow fall speed", color: "from-emerald-400 to-teal-600" },
  { value: "medium", label: "Medium", description: "Adds vowels, faster pace", color: "from-amber-400 to-orange-600" },
  { value: "hard", label: "Hard", description: "Everything, including symbols", color: "from-rose-400 to-red-600" },
]

export function FallingLettersGame({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [phase, setPhase] = useState<Phase>("select-difficulty")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [countdown, setCountdown] = useState(3)
  const [hud, setHud] = useState({ score: 0, hearts: 0, combo: 0, targetChar: null as string | null })
  const [gameOverStats, setGameOverStats] = useState<GameOverStats | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newAchievements, setNewAchievements] = useState<{ code: string; name: string; icon: string; rarity: string }[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  // Canvas text doesn't repaint when a webfont finishes loading mid-render (unlike DOM text), so
  // Phaser can draw a fallback-font frame before "Noto Sans Khmer" is ready. Kick the load off as
  // early as possible (well before the countdown finishes) and the game-creation effect below
  // awaits it too, so falling letters never render in the wrong font.
  const fontsReadyRef = useRef<Promise<unknown> | null>(null)
  if (typeof document !== "undefined" && !fontsReadyRef.current) {
    fontsReadyRef.current = document.fonts.load('bold 34px "Noto Sans Khmer"')
  }

  const { activeCode, shiftActive } = useKhmerKeyboard({ enabled: phase === "playing" })

  const submitScore = useCallback(async (result: FallingLettersResult) => {
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
          gameSlug: "falling-letters",
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
    if (phase !== "playing" || !containerRef.current) return

    // By the time we reach "playing", the countdown effect below has already awaited
    // fontsReadyRef, so this can safely stay synchronous (Phaser + React StrictMode's
    // mount-cleanup-mount replay only behaves predictably when this effect body has no
    // in-flight async gap between creating the game and returning its cleanup).
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
      scene: FallingLettersScene,
    })
    gameRef.current = game
    game.scene.start("falling-letters", { difficulty })

    const onState = (state: typeof hud) => setHud(state)
    const onGameOver = (result: FallingLettersResult) => submitScore(result)
    game.events.on("state-update", onState)
    game.events.on("game-over", onGameOver)

    return () => {
      game.events.off("state-update", onState)
      game.events.off("game-over", onGameOver)
      game.destroy(true)
      gameRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, difficulty])

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

  function startGame(d: Difficulty) {
    setDifficulty(d)
    setCountdown(3)
    setPhase("countdown")
    setGameOverStats(null)
    setNewAchievements([])
  }

  if (phase === "select-difficulty" || phase === "game-over") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {phase === "select-difficulty" && (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold">Falling Letters</h1>
              <p className="text-muted-foreground">Choose a difficulty to begin.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => startGame(opt.value)}
                  className={`rounded-3xl bg-gradient-to-br ${opt.color} p-5 text-left text-white shadow-lg transition-transform hover:-translate-y-1`}
                >
                  <div className="text-lg font-bold">{opt.label}</div>
                  <p className="mt-1 text-sm text-white/85">{opt.description}</p>
                </button>
              ))}
            </div>
          </>
        )}

        <GameOverModal
          open={phase === "game-over"}
          stats={gameOverStats}
          isSaving={isSaving}
          isGuest={!isAuthenticated}
          newAchievements={newAchievements}
          onPlayAgain={() => startGame(difficulty)}
          onExit={() => setPhase("select-difficulty")}
        />
      </div>
    )
  }

  return (
    // Fixed to the viewport below the 64px (h-16) topbar, rather than living in normal page
    // flow, so the whole card — title, HUD, canvas, keyboard — is guaranteed to fit in exactly
    // one screen with zero scrolling, on any device. The canvas itself uses the CSS "contain"
    // trick (h-full + aspect-ratio + max-w-full) so it fills whatever space is left after the
    // HUD and keyboard take their natural height, shrinking by width OR height, whichever is
    // tighter — that's what keeps it in the 8:5 ratio Phaser expects without letterboxing gaps.
    <div className="fixed inset-x-0 top-16 bottom-0 flex flex-col overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-50 p-3 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 sm:p-4">
      <div className="mx-auto flex w-full max-w-3xl shrink-0 items-center justify-between pb-2 sm:pb-3">
        <h1 className="text-lg font-bold sm:text-xl">Falling Letters</h1>
        <Button variant="ghost" size="sm" onClick={() => setPhase("select-difficulty")}>
          <X className="mr-1 size-4" /> Quit
        </Button>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
        {phase === "countdown" ? (
          <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-sky-400 to-blue-600">
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
            <FallingLettersHud
              className="shrink-0"
              score={hud.score}
              hearts={hud.hearts}
              maxHearts={DIFFICULTY_SETTINGS[difficulty].startingHearts}
              combo={hud.combo}
            />
            <div className="flex min-h-0 flex-1 items-center justify-center bg-gradient-to-b from-sky-400 to-blue-600">
              <div className="relative h-full max-w-full aspect-[8/5]">
                <div ref={containerRef} className="absolute inset-0" />
                {/* Ground/danger-zone cue: letters that reach here cost a heart. */}
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
