"use client"

import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { GAMES } from "@/data/games"
import { Badge } from "@/components/ui/badge"

export function GamePreviewSection() {
  return (
    <section id="games" className="bg-gradient-to-b from-white to-violet-50 px-4 py-24 dark:from-slate-950 dark:to-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">10 games. One goal: type Khmer fluently.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Falling Letters is ready to play today — the rest of the arcade is coming online next.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {GAMES.map((game, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[game.icon] ?? Icons.Gamepad2
            return (
              <motion.div
                key={game.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${game.gradient} p-5 text-white shadow-lg ${
                  game.status === "coming_soon" ? "opacity-80" : ""
                }`}
              >
                <Icon className="size-9 drop-shadow" />
                <h3 className="mt-4 text-lg font-bold">{game.name}</h3>
                <p className="mt-1 text-sm text-white/85">{game.description}</p>
                <Badge
                  variant="secondary"
                  className="mt-4 border-none bg-white/20 text-white backdrop-blur-sm"
                >
                  {game.status === "available" ? "Play now" : "Coming soon"}
                </Badge>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
