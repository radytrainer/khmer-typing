import { Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function DailyChallengeCard({ goal, progress }: { goal: number; progress: number }) {
  const percent = Math.min(100, Math.round((progress / goal) * 100))
  const complete = progress >= goal

  return (
    <div className="rounded-3xl border border-white/40 bg-gradient-to-br from-emerald-400 to-teal-600 p-5 text-white shadow-lg">
      <div className="flex items-center gap-2">
        <Target className="size-5" />
        <span className="font-bold">Daily Challenge</span>
      </div>
      <p className="mt-2 text-sm text-white/90">
        Type {goal} correct letters today
      </p>
      <Progress value={percent} className="mt-3 h-2.5 bg-white/25 [&>div]:bg-white" />
      <p className="mt-2 text-xs font-semibold text-white/90">
        {complete ? "Complete! 🎉" : `${progress} / ${goal} letters`}
      </p>
    </div>
  )
}
