import Link from "next/link"

const FOOTER_LINKS = {
  Product: [
    { href: "#games", label: "Games" },
    { href: "#features", label: "Features" },
    { href: "#leaderboard", label: "Leaderboard" },
  ],
  Account: [
    { href: "/login", label: "Log in" },
    { href: "/register", label: "Create account" },
  ],
  Legal: [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/40 bg-white/60 px-4 py-12 dark:border-white/10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-extrabold">
              <span className="font-khmer bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                អក្សរខ្មែរ
              </span>{" "}
              Typing
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A playful platform helping Cambodian students master Khmer typing, one game at a
              time.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-bold">{section}</h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/40 pt-6 text-center text-sm text-muted-foreground dark:border-white/10">
          © {new Date().getFullYear()} Khmer Typing. Built for Cambodian learners everywhere.
        </div>
      </div>
    </footer>
  )
}
