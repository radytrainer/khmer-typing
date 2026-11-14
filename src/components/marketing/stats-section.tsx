import { ALL_KHMER_LETTERS } from "@/data/khmer"
import { KHMER_WORDS } from "@/data/khmer/words"
import { ACHIEVEMENTS } from "@/data/achievements"
import { GAMES } from "@/data/games"

// Real counts from the platform's own content, not marketing vanity metrics — there are no
// users yet to report on, so this section only claims what's verifiably true today.
const STATS = [
  { label: "Game modes in the roadmap", value: GAMES.length },
  { label: "Achievements to unlock", value: ACHIEVEMENTS.length },
  { label: "Khmer letters & symbols covered", value: ALL_KHMER_LETTERS.length },
  { label: "Starter dictionary words", value: KHMER_WORDS.length },
]

export function StatsSection() {
  return (
    <section className="border-y border-white/40 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-16 dark:border-white/10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center text-white lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <div className="text-4xl font-extrabold sm:text-5xl">{stat.value}</div>
            <div className="mt-2 text-sm font-medium text-white/85">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
