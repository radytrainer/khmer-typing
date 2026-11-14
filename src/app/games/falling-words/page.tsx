import type { Metadata } from "next"
import { FallingWordsLoader } from "@/components/games/falling-words/falling-words-loader"
import { getCurrentProfile } from "@/features/auth/guards"

export const metadata: Metadata = {
  title: "Falling Words — Khmer Typing",
}

export default async function FallingWordsPage() {
  const profile = await getCurrentProfile()
  return <FallingWordsLoader isAuthenticated={profile !== null} />
}
