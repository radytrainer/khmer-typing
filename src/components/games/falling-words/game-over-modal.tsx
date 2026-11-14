import Link from "next/link"
import { Loader2, Repeat, Home, Zap, Target, Flame, LogIn } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AchievementBadge } from "@/components/dashboard/achievement-badge"

export interface GameOverStats {
  score: number
  correctCount: number
  wrongCount: number
  maxCombo: number
  kpm: number
  accuracy: number
  xpEarned: number
  coinsEarned: number
}

interface GameOverModalProps {
  open: boolean
  stats: GameOverStats | null
  isSaving: boolean
  isGuest: boolean
  newAchievements: { code: string; name: string; icon: string; rarity: string }[]
  onPlayAgain: () => void
  onExit: () => void
}

export function GameOverModal({
  open,
  stats,
  isSaving,
  isGuest,
  newAchievements,
  onPlayAgain,
  onExit,
}: GameOverModalProps) {
  if (!stats) return null

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Game Over!</DialogTitle>
          <DialogDescription className="text-center">
            Score: <span className="font-bold text-foreground">{stats.score.toLocaleString()}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-muted p-3 text-center">
            <Zap className="mx-auto size-5 text-amber-500" />
            <div className="mt-1 text-lg font-bold">{stats.kpm}</div>
            <div className="text-xs text-muted-foreground">KPM</div>
          </div>
          <div className="rounded-2xl bg-muted p-3 text-center">
            <Target className="mx-auto size-5 text-emerald-500" />
            <div className="mt-1 text-lg font-bold">{stats.accuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="rounded-2xl bg-muted p-3 text-center">
            <Flame className="mx-auto size-5 text-orange-500" />
            <div className="mt-1 text-lg font-bold">{stats.maxCombo}x</div>
            <div className="text-xs text-muted-foreground">Best combo</div>
          </div>
          <div className="rounded-2xl bg-muted p-3 text-center">
            <div className="mx-auto text-lg">✅ {stats.correctCount} / ❌ {stats.wrongCount}</div>
            <div className="text-xs text-muted-foreground">Correct / Wrong</div>
          </div>
        </div>

        {isGuest ? (
          <div className="rounded-2xl bg-violet-50 p-3 text-center dark:bg-violet-950/30">
            <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
              Playing as guest — this score wasn&apos;t saved.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Log in to earn XP, coins, and show up on the leaderboard.
            </p>
            <Button
              asChild
              size="sm"
              className="mt-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 font-bold hover:opacity-90"
            >
              <Link href="/register">
                <LogIn className="mr-1 size-4" /> Create a free account
              </Link>
            </Button>
          </div>
        ) : isSaving ? (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Saving your progress…
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 py-2 text-sm font-semibold">
            <span className="text-amber-600">+{stats.xpEarned} XP</span>
            <span className="text-orange-600">+{stats.coinsEarned} coins</span>
          </div>
        )}

        {newAchievements.length > 0 && (
          <div className="rounded-2xl bg-violet-50 p-3 dark:bg-violet-950/30">
            <p className="mb-2 text-center text-xs font-bold text-violet-700 dark:text-violet-300">
              Achievement unlocked!
            </p>
            <div className="flex justify-center gap-3">
              {newAchievements.map((a) => (
                <AchievementBadge key={a.code} icon={a.icon} name={a.name} rarity={a.rarity} />
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={onExit}>
            <Home className="mr-1 size-4" /> Games
          </Button>
          <Button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-500 font-bold hover:opacity-90"
          >
            <Repeat className="mr-1 size-4" /> Play again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
