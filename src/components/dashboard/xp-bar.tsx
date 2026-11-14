import { Progress } from "@/components/ui/progress"
import { levelProgress } from "@/features/profile/queries"

export function XpBar({ xp, level }: { xp: number; level: number }) {
  const { xpIntoLevel, xpForNextLevel, percent } = levelProgress(xp, level)

  return (
    <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">Level {level}</span>
        <span className="text-xs text-muted-foreground">
          {xpIntoLevel} / {xpForNextLevel} XP
        </span>
      </div>
      <Progress value={percent} className="mt-3 h-3" />
    </div>
  )
}
