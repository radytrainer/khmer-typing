import { requireProfile } from "@/features/auth/guards"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { AppTopbar } from "@/components/dashboard/app-topbar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <AppSidebar role={profile.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          username={profile.username}
          coins={profile.coins}
          currentStreak={profile.currentStreak}
          showCurrency={profile.role === "student"}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
