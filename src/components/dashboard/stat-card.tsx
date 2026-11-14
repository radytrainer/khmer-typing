import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  gradient: string
}

export function StatCard({ icon: Icon, label, value, gradient }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/50">
      <div className={`inline-flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-md`}>
        <Icon className="size-5 text-white" />
      </div>
      <div className="mt-3 text-2xl font-extrabold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
