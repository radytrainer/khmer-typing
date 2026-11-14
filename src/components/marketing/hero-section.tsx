"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const PREVIEW_LETTERS = [
  { char: "ក", left: "12%", delay: 0, duration: 6 },
  { char: "ខ", left: "30%", delay: 1.2, duration: 7 },
  { char: "គ", left: "50%", delay: 0.4, duration: 5.5 },
  { char: "ង", left: "68%", delay: 2, duration: 6.5 },
  { char: "ច", left: "84%", delay: 0.8, duration: 7.5 },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-100 via-sky-50 to-white px-4 pt-20 pb-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-32 left-1/4 size-96 rounded-full bg-fuchsia-300/30 blur-3xl dark:bg-fuchsia-800/20" />
      <div className="pointer-events-none absolute top-40 right-10 size-72 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-800/20" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            🎮 10 Games · 100 Achievements · No sign-up required to play
          </span>

          <h1 className="mt-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Learn to type{" "}
            <span className="font-khmer bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
              ភាសាខ្មែរ
            </span>{" "}
            like a game, not a chore.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Falling letters, zombie invasions, racing cars, and more — every game teaches real
            Khmer typing skills while you chase XP, coins, and leaderboard glory.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 text-base font-bold shadow-lg shadow-violet-500/30 hover:opacity-90"
            >
              <Link href="/games">
                Start playing free <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-2xl px-8 text-base font-bold">
              <a href="#games">
                <Play className="mr-1 size-4" /> See the games
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative h-80 overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-b from-sky-400 to-blue-600 shadow-2xl sm:h-96"
        >
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/20 px-4 py-2 text-xs font-bold text-white">
            <span>Falling Letters</span>
            <span>❤️❤️❤️ · Score 1,240</span>
          </div>

          {PREVIEW_LETTERS.map((l) => (
            <motion.span
              key={l.char + l.left}
              className="font-khmer absolute top-8 text-4xl font-bold text-white drop-shadow-lg"
              style={{ left: l.left }}
              animate={{ y: [0, 300] }}
              transition={{ duration: l.duration, delay: l.delay, repeat: Infinity, ease: "linear" }}
            >
              {l.char}
            </motion.span>
          ))}

          <div className="absolute right-4 bottom-4 left-4 rounded-xl bg-white/90 p-3 text-center font-khmer text-2xl font-bold text-blue-700 shadow-lg">
            ក
          </div>
        </motion.div>
      </div>
    </section>
  )
}
