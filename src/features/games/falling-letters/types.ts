import type { Difficulty } from "@prisma/client"
import type { LetterCategory } from "@/data/khmer"

export const DIFFICULTY_CATEGORIES: Record<Difficulty, LetterCategory[]> = {
  easy: ["consonant", "number"],
  medium: ["consonant", "number", "independent_vowel", "dependent_vowel"],
  hard: ["consonant", "number", "independent_vowel", "dependent_vowel", "symbol"],
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, { initialSpawnMs: number; initialFallSpeed: number; startingHearts: number }> = {
  easy: { initialSpawnMs: 1600, initialFallSpeed: 55, startingHearts: 4 },
  medium: { initialSpawnMs: 1200, initialFallSpeed: 75, startingHearts: 3 },
  hard: { initialSpawnMs: 900, initialFallSpeed: 100, startingHearts: 3 },
}

export interface FallingLettersResult {
  score: number
  correctCount: number
  wrongCount: number
  maxCombo: number
  durationSeconds: number
  difficulty: Difficulty
}

/** Events the Phaser scene emits; the React wrapper listens to these to drive the HUD. */
export interface FallingLettersSceneEvents {
  "state-update": { score: number; hearts: number; combo: number; targetChar: string | null }
  "game-over": FallingLettersResult
}
