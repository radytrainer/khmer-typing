"use client"

import { motion } from "framer-motion"
import {
  Gamepad2,
  Trophy,
  Flame,
  Keyboard,
  Users,
  BarChart3,
  Sparkles,
  ShoppingBag,
} from "lucide-react"

const FEATURES = [
  {
    icon: Gamepad2,
    title: "10 Game Modes",
    description: "From falling letters to space shooters — every genre teaches real typing skill.",
    color: "from-sky-400 to-blue-600",
  },
  {
    icon: Keyboard,
    title: "Interactive Khmer Keyboard",
    description: "See exactly which key to press with a live on-screen keyboard, mobile and desktop.",
    color: "from-emerald-400 to-teal-600",
  },
  {
    icon: Trophy,
    title: "100 Achievements",
    description: "Unlock badges for speed, accuracy, combos, streaks, and full mastery of every game.",
    color: "from-amber-400 to-orange-600",
  },
  {
    icon: Flame,
    title: "XP, Coins & Streaks",
    description: "Level up, earn coins, and keep your daily streak alive with fun reward loops.",
    color: "from-rose-400 to-pink-600",
  },
  {
    icon: BarChart3,
    title: "Deep Statistics",
    description: "Track KPM, accuracy, weak letters, and progress with heatmaps and charts.",
    color: "from-violet-400 to-purple-600",
  },
  {
    icon: Users,
    title: "Teacher & Admin Tools",
    description: "Classrooms, assignments, student reports, and platform-wide analytics.",
    color: "from-cyan-400 to-sky-600",
  },
  {
    icon: ShoppingBag,
    title: "Shop & Customization",
    description: "Spend coins on themes, car skins, avatar frames, and keyboard styles.",
    color: "from-fuchsia-400 to-purple-600",
  },
  {
    icon: Sparkles,
    title: "Learning Mode",
    description: "Structured lessons from the alphabet to full paragraphs and stories.",
    color: "from-lime-400 to-green-600",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Everything you need to master Khmer typing</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A complete learning system disguised as a really fun game.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-md backdrop-blur-lg transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/50"
          >
            <div className={`inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
              <feature.icon className="size-6 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
