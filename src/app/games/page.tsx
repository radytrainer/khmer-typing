import Link from "next/link"
import * as Icons from "lucide-react"
import { GAMES } from "@/data/games"
import { getCurrentProfile } from "@/features/auth/guards"

export default async function GamesHubPage() {
  const profile = await getCurrentProfile()

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Games</h1>
        <p className="text-muted-foreground">Free to play for everyone — pick a game and start typing.</p>
        {!profile && (
          <p className="mt-3 rounded-2xl bg-violet-100 px-4 py-2.5 text-sm font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
            Playing as guest — your scores won&apos;t be saved.{" "}
            <Link href="/register" className="underline underline-offset-2">
              Create a free account
            </Link>{" "}
            to earn XP, coins, and climb the leaderboard.
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[game.icon] ?? Icons.Gamepad2
          const content = (
            <div
              className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${game.gradient} p-5 text-white shadow-lg transition-transform ${
                game.status === "available" ? "hover:-translate-y-1" : "opacity-70"
              }`}
            >
              <div>
                <Icon className="size-9 drop-shadow" />
                <h3 className="mt-4 text-lg font-bold">{game.name}</h3>
                <p className="mt-1 text-sm text-white/85">{game.description}</p>
              </div>
              <span className="mt-4 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                {game.status === "available" ? "Play now" : "Coming soon"}
              </span>
            </div>
          )

          return game.status === "available" ? (
            <Link key={game.slug} href={`/games/${game.slug}`}>
              {content}
            </Link>
          ) : (
            <div key={game.slug} className="cursor-not-allowed">
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
