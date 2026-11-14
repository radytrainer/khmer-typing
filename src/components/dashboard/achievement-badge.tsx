import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"

const RARITY_STYLES: Record<string, string> = {
  common: "from-slate-400 to-slate-500",
  rare: "from-sky-400 to-blue-600",
  epic: "from-violet-500 to-fuchsia-600",
  legendary: "from-amber-400 to-orange-600",
}

export function AchievementBadge({
  icon,
  name,
  rarity,
  locked = false,
}: {
  icon: string
  name: string
  rarity: string
  locked?: boolean
}) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[icon] ?? Icons.Award

  return (
    <div className="flex flex-col items-center gap-2 text-center" title={name}>
      <div
        className={cn(
          "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md",
          locked ? "from-muted to-muted grayscale opacity-50" : RARITY_STYLES[rarity] ?? RARITY_STYLES.common,
        )}
      >
        <Icon className="size-6 text-white" />
      </div>
      <span className="line-clamp-2 max-w-20 text-xs font-semibold text-muted-foreground">{name}</span>
    </div>
  )
}
