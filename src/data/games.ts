export type GameStatus = "available" | "coming_soon"

export interface GameDefinition {
  slug: string
  name: string
  description: string
  /** lucide-react icon name. */
  icon: string
  /** Tailwind gradient classes used for the game's card/theme accent. */
  gradient: string
  status: GameStatus
  sortOrder: number
}

/**
 * Catalog of all 10 planned game modes. Single source of truth, seeded into the `games` table
 * and rendered by the Games hub. Only "falling-letters" and "falling-words" are fully implemented
 * so far — the rest ship as "coming_soon" placeholders so the route/nav structure exists without
 * pretending the game logic is done (see README roadmap).
 */
export const GAMES: GameDefinition[] = [
  {
    slug: "falling-letters",
    name: "Falling Letters",
    description: "Khmer letters fall from the sky — type the matching key before they land.",
    icon: "CloudRain",
    gradient: "from-sky-400 to-blue-600",
    status: "available",
    sortOrder: 1,
  },
  {
    slug: "falling-words",
    name: "Falling Words",
    description: "Whole Khmer words fall, drawn from categorized dictionaries.",
    icon: "Type",
    gradient: "from-emerald-400 to-teal-600",
    status: "available",
    sortOrder: 2,
  },
  {
    slug: "zombie-typing",
    name: "Zombie Typing",
    description: "Cute zombies shuffle toward school — type fast to stop them.",
    icon: "Skull",
    gradient: "from-lime-500 to-green-700",
    status: "coming_soon",
    sortOrder: 3,
  },
  {
    slug: "racer",
    name: "Racer",
    description: "Type accurately to accelerate your car past the competition.",
    icon: "Car",
    gradient: "from-red-400 to-orange-600",
    status: "coming_soon",
    sortOrder: 4,
  },
  {
    slug: "balloon-pop",
    name: "Balloon Pop",
    description: "Pop balloons by typing the Khmer letter printed on each one.",
    icon: "CircleDot",
    gradient: "from-pink-400 to-fuchsia-600",
    status: "coming_soon",
    sortOrder: 5,
  },
  {
    slug: "fish-catch",
    name: "Fish Catch",
    description: "Type to catch fish swimming across the screen before they escape.",
    icon: "Fish",
    gradient: "from-cyan-400 to-blue-600",
    status: "coming_soon",
    sortOrder: 6,
  },
  {
    slug: "space-shooter",
    name: "Space Shooter",
    description: "Type to fire lasers at incoming aliens and survive boss fights.",
    icon: "Rocket",
    gradient: "from-violet-500 to-indigo-700",
    status: "coming_soon",
    sortOrder: 7,
  },
  {
    slug: "castle-defense",
    name: "Castle Defense",
    description: "Type to launch arrows and defend your castle from waves of enemies.",
    icon: "Castle",
    gradient: "from-amber-400 to-orange-700",
    status: "coming_soon",
    sortOrder: 8,
  },
  {
    slug: "memory-typing",
    name: "Memory Typing",
    description: "Memorize letters, words, and sentences, then type them from memory.",
    icon: "Brain",
    gradient: "from-purple-400 to-violet-700",
    status: "coming_soon",
    sortOrder: 9,
  },
  {
    slug: "typing-marathon",
    name: "Typing Marathon",
    description: "60s, 120s, 300s, or Infinite Mode — how far can you type?",
    icon: "Timer",
    gradient: "from-slate-500 to-slate-800",
    status: "coming_soon",
    sortOrder: 10,
  },
]
