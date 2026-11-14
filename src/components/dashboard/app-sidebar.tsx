"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Role } from "@prisma/client"
import {
  LayoutDashboard,
  Gamepad2,
  BookOpen,
  Trophy,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  student: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/learn", label: "Learning Mode", icon: BookOpen },
    { href: "/leaderboard", label: "Leaderboard", icon: Crown },
    { href: "/achievements", label: "Achievements", icon: Trophy },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
  ],
  teacher: [
    { href: "/teacher", label: "Overview", icon: LayoutDashboard },
    { href: "/teacher/classes", label: "My Classes", icon: Users },
    { href: "/teacher/reports", label: "Reports", icon: BarChart3 },
  ],
  admin: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/games", label: "Games", icon: Gamepad2 },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ],
}

export function AppSidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const items = NAV_BY_ROLE[role]

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/40 bg-white/60 px-4 py-6 backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/50 md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2 text-lg font-extrabold">
        <span className="font-khmer bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
          អក្សរខ្មែរ
        </span>
        <span>Typing</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-md"
                  : "text-muted-foreground hover:bg-violet-50 hover:text-foreground dark:hover:bg-violet-950/30",
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {role === "student" && (
        <div className="mt-auto rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 p-4 text-white shadow-lg">
          <Sparkles className="size-5" />
          <p className="mt-2 text-sm font-bold">Daily streak keeps XP flowing!</p>
        </div>
      )}
    </aside>
  )
}
