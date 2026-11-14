import type { Metadata } from "next"
import { FallingLettersLoader } from "@/components/games/falling-letters/falling-letters-loader"
import { getCurrentProfile } from "@/features/auth/guards"

export const metadata: Metadata = {
  title: "Falling Letters — Khmer Typing",
}

export default async function FallingLettersPage() {
  const profile = await getCurrentProfile()
  return <FallingLettersLoader isAuthenticated={profile !== null} />
}
