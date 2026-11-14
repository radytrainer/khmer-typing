"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const FallingWordsGame = dynamic(
  () => import("./falling-words-game").then((m) => m.FallingWordsGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    ),
  },
)

export function FallingWordsLoader({ isAuthenticated }: { isAuthenticated: boolean }) {
  return <FallingWordsGame isAuthenticated={isAuthenticated} />
}
