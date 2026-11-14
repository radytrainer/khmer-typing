import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { submitScoreSchema } from "@/features/scoring/schemas"
import { recordGameSession } from "@/features/scoring/record-session"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = submitScoreSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
  }

  try {
    const result = await recordGameSession({ userId: user.id, ...parsed.data })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Could not save score" }, { status: 500 })
  }
}
