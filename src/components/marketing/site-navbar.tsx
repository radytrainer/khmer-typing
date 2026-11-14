import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getCurrentProfile } from "@/features/auth/guards"

const NAV_LINKS = [
  { href: "#games", label: "Games" },
  { href: "#features", label: "Features" },
  { href: "#leaderboard", label: "Leaderboard" },
]

export async function SiteNavbar() {
  const profile = await getCurrentProfile()

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text font-khmer text-transparent">
            អក្សរខ្មែរ
          </span>
          <span className="text-foreground">Typing</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {profile ? (
            <Button asChild className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 font-bold hover:opacity-90">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="font-semibold">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 font-bold hover:opacity-90">
                <Link href="/games">Play for free</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-base font-semibold">
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                {profile ? (
                  <Button asChild className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 font-bold">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button asChild className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 font-bold">
                      <Link href="/games">Play for free</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
