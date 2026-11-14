import type { LucideIcon } from "lucide-react"

interface ComingSoonProps {
  icon: LucideIcon
  title: string
  description: string
}

export function ComingSoon({ icon: Icon, title, description }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-violet-300 bg-violet-50/60 p-10 text-center dark:border-violet-800 dark:bg-violet-950/20">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600">
        <Icon className="size-7 text-white" />
      </div>
      <h1 className="mt-4 text-lg font-bold">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
