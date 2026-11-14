import { z } from "zod"

export const submitScoreSchema = z.object({
  gameSlug: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  score: z.number().int().min(0).max(1_000_000),
  correctCount: z.number().int().min(0).max(100_000),
  wrongCount: z.number().int().min(0).max(100_000),
  maxCombo: z.number().int().min(0).max(100_000),
  durationSeconds: z.number().int().min(1).max(3600),
  kpm: z.number().min(0).max(1000),
  accuracy: z.number().min(0).max(100),
})

export type SubmitScoreInput = z.infer<typeof submitScoreSchema>
