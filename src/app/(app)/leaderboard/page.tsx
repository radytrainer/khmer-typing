"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Crown, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { LeaderboardPeriod, LeaderboardRow } from "@/features/leaderboard/queries"

const PERIODS: { value: LeaderboardPeriod; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "all_time", label: "All-Time" },
]

const RANK_STYLES: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-300 to-yellow-500 text-white",
  2: "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
  3: "bg-gradient-to-br from-orange-300 to-orange-500 text-white",
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>("all_time")

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", "falling-letters", period],
    queryFn: async () => {
      const res = await fetch(`/api/leaderboard?game=falling-letters&period=${period}`)
      if (!res.ok) throw new Error("Failed to load leaderboard")
      const json: { rows: LeaderboardRow[] } = await res.json()
      return json.rows
    },
  })

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold">Leaderboard</h1>
        <p className="text-muted-foreground">Falling Letters — top scores</p>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as LeaderboardPeriod)}>
        <TabsList className="mx-auto mb-6 grid w-full max-w-md grid-cols-4">
          {PERIODS.map((p) => (
            <TabsTrigger key={p.value} value={p.value}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-3xl border border-white/40 bg-white/70 p-4 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/50 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-violet-600" />
          </div>
        ) : !data || data.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No scores yet for this period — be the first!
          </p>
        ) : (
          <ul className="space-y-2">
            {data.map((row) => (
              <li
                key={row.user_id}
                className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30"
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                    RANK_STYLES[row.rank] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {row.rank <= 3 ? <Crown className="size-4" /> : row.rank}
                </span>
                <Avatar className="size-9">
                  <AvatarFallback className="bg-violet-100 font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                    {row.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 font-semibold">{row.username}</span>
                <span className="font-extrabold text-violet-600 dark:text-violet-400">
                  {row.best_score.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
