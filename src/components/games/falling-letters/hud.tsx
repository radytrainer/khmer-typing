"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Flame, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { HeartsDisplay } from "@/components/games/shared/hearts-display"

interface HudProps {
  score: number
  hearts: number
  maxHearts: number
  combo: number
  className?: string
}

export function FallingLettersHud({ score, hearts, maxHearts, combo, className }: HudProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-t-3xl bg-gradient-to-b from-black/50 to-black/20 px-3 py-2.5 text-white backdrop-blur-md sm:px-5 sm:py-3",
        className,
      )}
    >
      <HeartsDisplay hearts={hearts} max={maxHearts} />

      <motion.div
        key={score}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="flex items-center gap-1.5 rounded-full bg-white/10 py-1 pr-3 pl-1.5 sm:gap-2 sm:pr-4"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-amber-400 sm:size-7">
          <Trophy className="size-3.5 text-amber-950 sm:size-4" />
        </span>
        <span className="text-base font-extrabold tabular-nums sm:text-lg">{score.toLocaleString()}</span>
      </motion.div>

      <div className="flex w-16 justify-end sm:w-20">
        <AnimatePresence>
          {combo > 1 && (
            <motion.div
              key="combo"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex items-center gap-1 rounded-full bg-orange-500/90 px-2.5 py-1 text-sm font-extrabold sm:text-base"
            >
              <Flame className="size-3.5 sm:size-4" />
              {combo}x
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
