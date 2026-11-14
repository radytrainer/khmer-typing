import { getCurrentProfile } from "@/features/auth/guards"
import { GamesTopbar } from "@/components/games/shared/games-topbar"

/**
 * Unlike the (app) shell, this layout never redirects — anyone can play a game. Only saving a
 * score, earning XP/coins, and unlocking achievements requires being logged in (enforced by
 * /api/scores checking auth itself, and the games not even attempting to submit when signed out).
 */
export default async function GamesLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-violet-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <GamesTopbar profile={profile} />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
