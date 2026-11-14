import { ShieldCheck, Database, Settings2 } from "lucide-react"
import { requireRole } from "@/features/auth/guards"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboardPage() {
  const profile = await requireRole(["admin"])

  const [userCount, gameCount, achievementCount, sessionCount] = await Promise.all([
    prisma.profile.count(),
    prisma.game.count(),
    prisma.achievement.count(),
    prisma.gameSession.count(),
  ])

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        <p className="text-muted-foreground">Signed in as {profile.username} (admin).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Users", value: userCount },
          { label: "Games", value: gameCount },
          { label: "Achievements", value: achievementCount },
          { label: "Sessions played", value: sessionCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/40 bg-white/70 p-5 text-center shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/50"
          >
            <div className="text-3xl font-extrabold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-dashed border-violet-300 bg-violet-50/60 p-8 text-center dark:border-violet-800 dark:bg-violet-950/20">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600">
          <ShieldCheck className="size-7 text-white" />
        </div>
        <h2 className="mt-4 text-lg font-bold">Full content management is coming next</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          The counts above are live queries against your real database. User/game/dictionary
          management screens, moderation tools, and site settings build on top of this same
          Prisma layer — see the README roadmap.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-2xl bg-white/70 p-3 text-sm font-semibold dark:bg-slate-900/50">
            <Database className="size-4 text-violet-600" /> Manage games & dictionaries
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/70 p-3 text-sm font-semibold dark:bg-slate-900/50">
            <Settings2 className="size-4 text-violet-600" /> Platform-wide settings
          </div>
        </div>
      </div>
    </div>
  )
}
