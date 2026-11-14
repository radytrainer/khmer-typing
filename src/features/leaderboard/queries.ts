import { prisma } from "@/lib/prisma"

export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "all_time"

export interface LeaderboardRow {
  rank: number
  user_id: string
  username: string
  avatar_url: string | null
  best_score: number
  played_at: Date
}

/** Calls the `leaderboard()` Postgres function defined in supabase/migrations/0004. */
export async function getGameLeaderboard(
  gameSlug: string,
  period: LeaderboardPeriod = "all_time",
  limit = 10,
): Promise<LeaderboardRow[]> {
  return prisma.$queryRaw<LeaderboardRow[]>`
    select * from public.leaderboard(${gameSlug}, ${period}, ${limit})
  `
}
