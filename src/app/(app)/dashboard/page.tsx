import { redirect } from "next/navigation"
import { Gauge, Target, Trophy, Gamepad2 } from "lucide-react"
import { requireProfile } from "@/features/auth/guards"
import { getStudentDashboardData } from "@/features/profile/queries"
import { StatCard } from "@/components/dashboard/stat-card"
import { XpBar } from "@/components/dashboard/xp-bar"
import { DailyChallengeCard } from "@/components/dashboard/daily-challenge-card"
import { ContinueLearningCard } from "@/components/dashboard/continue-learning-card"
import { AchievementBadge } from "@/components/dashboard/achievement-badge"

export default async function DashboardPage() {
  const profile = await requireProfile()

  if (profile.role === "teacher") redirect("/teacher")
  if (profile.role === "admin") redirect("/admin")

  const data = await getStudentDashboardData(profile.id)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Welcome back, {profile.username}! 👋</h1>
        <p className="text-muted-foreground">Here&apos;s where your typing journey stands today.</p>
      </div>

      <ContinueLearningCard />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Gauge} label="Best speed (KPM)" value={data.bestKpm.toFixed(0)} gradient="from-sky-400 to-blue-600" />
        <StatCard icon={Target} label="Avg. accuracy" value={`${data.avgAccuracy.toFixed(0)}%`} gradient="from-emerald-400 to-teal-600" />
        <StatCard icon={Gamepad2} label="Games played" value={data.gamesPlayed} gradient="from-violet-400 to-purple-600" />
        <StatCard icon={Trophy} label="Achievements" value={data.recentAchievements.length} gradient="from-amber-400 to-orange-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <XpBar xp={profile.xp} level={profile.level} />

          <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/50">
            <h3 className="font-bold">Recent achievements</h3>
            {data.recentAchievements.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No achievements yet — play a game to unlock your first badge!
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-4">
                {data.recentAchievements.map((a) => (
                  <AchievementBadge key={a.code} icon={a.icon} name={a.name} rarity={a.rarity} />
                ))}
              </div>
            )}
          </div>
        </div>

        <DailyChallengeCard goal={data.dailyChallenge.goal} progress={data.dailyChallenge.progress} />
      </div>
    </div>
  )
}
