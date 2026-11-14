"use client"

import { useTheme } from "next-themes"
import { Coins, Flame, LogOut, Moon, Sun } from "lucide-react"
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

interface AppTopbarProps {
  username: string
  coins: number
  currentStreak: number
  showCurrency: boolean
}

export function AppTopbar({ username, coins, currentStreak, showCurrency }: AppTopbarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/40 bg-white/60 px-4 backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/50 sm:px-6">
      <div />

      <div className="flex items-center gap-3">
        {showCurrency && (
          <>
            <div className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
              <Flame className="size-4" />
              {currentStreak}
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <Coins className="size-4" />
              {coins.toLocaleString()}
            </div>
          </>
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full">
              <Avatar>
                <AvatarFallback className="bg-violet-100 font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action={signOutAction}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full">
                  <LogOut className="size-4" /> Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
