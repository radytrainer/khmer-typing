"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import type { Profile } from "@prisma/client"
import { Coins, Flame, LogIn, LogOut, Moon, Sun } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOutAction } from "@/features/auth/actions"

/**
 * Topbar for the public /games area, which (unlike the rest of the (app) shell) works for both
 * signed-in players and anonymous guests — anyone can play, only saving progress needs an
 * account.
 */
export function GamesTopbar({ profile }: { profile: Profile | null }) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/40 bg-white/60 px-4 backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/50 sm:px-6">
      <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
        <span className="font-khmer bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
          អក្សរខ្មែរ
        </span>
        <span>Typing</span>
      </Link>

      <div className="flex items-center gap-3">
        {profile ? (
          <>
            <div className="hidden items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 sm:flex">
              <Flame className="size-4" />
              {profile.currentStreak}
            </div>
            <div className="hidden items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 sm:flex">
              <Coins className="size-4" />
              {profile.coins.toLocaleString()}
            </div>
          </>
        ) : (
          <span className="hidden text-sm font-semibold text-muted-foreground sm:inline">
            Playing as guest — log in to save your scores
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </Button>

        {profile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full">
                <Avatar>
                  <AvatarFallback className="bg-violet-100 font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{profile.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <form action={signOutAction}>
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full">
                    <LogOut className="size-4" /> Sign out
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 font-bold hover:opacity-90"
          >
            <Link href="/login">
              <LogIn className="mr-1 size-4" /> Log in
            </Link>
          </Button>
        )}
      </div>
    </header>
  )
}
