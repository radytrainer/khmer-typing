import { NextResponse } from "next/server"
import { z } from "zod"
import { getGameLeaderboard } from "@/features/leaderboard/queries"

const querySchema = z.object({
  game: z.string().min(1).default("falling-letters"),
  period: z.enum(["daily", "weekly", "monthly", "all_time"]).default("all_time"),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const parsed = querySchema.safeParse({
    game: searchParams.get("game") ?? undefined,
    period: searchParams.get("period") ?? undefined,
  })

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 })
  }

  const rows = await getGameLeaderboard(parsed.data.game, parsed.data.period, 20)
  return NextResponse.json({ rows })
}
