import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeartsDisplay({ hearts, max }: { hearts: number; max: number }) {
  return (
    <div className="flex gap-1 sm:gap-1.5">
      {Array.from({ length: max }).map((_, i) => (
        <Heart
          key={i}
          className={cn(
            "size-5 drop-shadow sm:size-6",
            i < hearts ? "fill-rose-500 text-rose-500" : "fill-white/10 text-white/25",
          )}
        />
      ))}
    </div>
  )
}
