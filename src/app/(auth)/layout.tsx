import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-violet-100 via-sky-50 to-fuchsia-100 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-violet-300/40 blur-3xl dark:bg-violet-800/20" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-800/20" />

      <Link
        href="/"
        className="absolute top-6 left-6 text-xl font-extrabold text-violet-700 dark:text-violet-300"
      >
        <span className="font-khmer">អក្សរខ្មែរ</span> <span className="text-foreground">Typing</span>
      </Link>

      {children}
    </div>
  )
}
