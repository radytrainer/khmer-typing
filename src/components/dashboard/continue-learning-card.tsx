import Link from "next/link"
import { PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContinueLearningCard() {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-white/40 bg-gradient-to-br from-violet-600 to-fuchsia-600 p-6 text-white shadow-lg sm:flex-row sm:items-center">
      <div>
        <h3 className="text-lg font-bold">Continue learning</h3>
        <p className="mt-1 text-sm text-white/85">
          Jump back into Falling Letters and keep your streak going.
        </p>
      </div>
      <Button asChild size="lg" className="mt-4 rounded-xl bg-white font-bold text-violet-700 hover:bg-white/90 sm:mt-0">
        <Link href="/games/falling-letters">
          <PlayCircle className="mr-1 size-5" /> Play now
        </Link>
      </Button>
    </div>
  )
}
