"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { TESTIMONIALS } from "@/data/testimonials"

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Loved by students and teachers</h2>
        <p className="mt-2 text-xs text-muted-foreground italic">
          Placeholder copy — replace with real quotes once the platform has pilot users.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/50"
          >
            <Quote className="size-6 text-violet-400" />
            <p className="mt-3 text-sm text-foreground/90 italic">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-4">
              <div className="text-sm font-bold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
