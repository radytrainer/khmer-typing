import { Users, BarChart3, ClipboardList } from "lucide-react"
import { requireRole } from "@/features/auth/guards"

export default async function TeacherDashboardPage() {
  const profile = await requireRole(["teacher", "admin"])

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Teacher Portal</h1>
        <p className="text-muted-foreground">Welcome, {profile.username}.</p>
      </div>

      <div className="rounded-3xl border border-dashed border-violet-300 bg-violet-50/60 p-8 text-center dark:border-violet-800 dark:bg-violet-950/20">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600">
          <Users className="size-7 text-white" />
        </div>
        <h2 className="mt-4 text-lg font-bold">Classroom management is coming next</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          This is a protected, role-gated route — only teacher and admin accounts can reach it.
          Class rosters, join codes, and student progress reports build on the
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5">classes</code> /
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5">class_students</code> tables and the
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5">class_leaderboard()</code> function
          already in the database — see the README roadmap.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-2xl bg-white/70 p-3 text-sm font-semibold dark:bg-slate-900/50">
            <ClipboardList className="size-4 text-violet-600" /> Manage classes & assignments
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/70 p-3 text-sm font-semibold dark:bg-slate-900/50">
            <BarChart3 className="size-4 text-violet-600" /> Student reports & weak-letter analysis
          </div>
        </div>
      </div>
    </div>
  )
}
