import { Crown, Medal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getGameLeaderboard, type LeaderboardRow } from "@/features/leaderboard/queries"

const RANK_STYLES: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-300 to-yellow-500 text-white",
  2: "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
  3: "bg-gradient-to-br from-orange-300 to-orange-500 text-white",
}

// Shown only if the database has no game_sessions yet (fresh install before real play data
// exists), so the landing page still demonstrates the leaderboard's look and feel.
const SAMPLE_ROWS: LeaderboardRow[] = [
  { rank: 1, user_id: "sample-1", username: "sokha_types", avatar_url: null, best_score: 2840, played_at: new Date() },
  { rank: 2, user_id: "sample-2", username: "dara_speed", avatar_url: null, best_score: 2510, played_at: new Date() },
  { rank: 3, user_id: "sample-3", username: "chenda_k", avatar_url: null, best_score: 2290, played_at: new Date() },
  { rank: 4, user_id: "sample-4", username: "vibol_fast", avatar_url: null, best_score: 1980, played_at: new Date() },
  { rank: 5, user_id: "sample-5", username: "srey_pov", avatar_url: null, best_score: 1755, played_at: new Date() },
]

export async function LeaderboardPreviewSection() {
  let rows: LeaderboardRow[] = []
  let isSample = false

  try {
    rows = await getGameLeaderboard("falling-letters", "all_time", 5)
    if (rows.length === 0) {
      rows = SAMPLE_ROWS
      isSample = true
    }
  } catch {
    rows = SAMPLE_ROWS
    isSample = true
  }

  return (
    <section id="leaderboard" className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Climb the leaderboard</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Daily, weekly, monthly, and all-time rankings — for your class, your school, and the globe.
        </p>
      </div>

      <div className="mt-12 rounded-3xl border border-white/40 bg-white/70 p-4 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/60 sm:p-6">
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="text-sm font-bold text-muted-foreground">Falling Letters · All-Time</span>
          {isSample && <span className="text-xs text-muted-foreground italic">sample data</span>}
        </div>
        <ul className="space-y-2">
          {rows.map((row) => {
            const rank = row.rank
            return (
              <li
                key={row.user_id}
                className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30"
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                    RANK_STYLES[rank] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {rank <= 3 ? <Crown className="size-4" /> : rank}
                </span>
                <Avatar className="size-9">
                  <AvatarFallback className="bg-violet-100 font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                    {row.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 font-semibold">{row.username}</span>
                <span className="flex items-center gap-1 font-extrabold text-violet-600 dark:text-violet-400">
                  <Medal className="size-4" />
                  {row.best_score.toLocaleString()}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
