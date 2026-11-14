"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const FallingLettersGame = dynamic(
  () => import("./falling-letters-game").then((m) => m.FallingLettersGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-violet-600" />
      </div>
    ),
  },
)

export function FallingLettersLoader({ isAuthenticated }: { isAuthenticated: boolean }) {
  return <FallingLettersGame isAuthenticated={isAuthenticated} />
}
