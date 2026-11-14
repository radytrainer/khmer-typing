import type { Difficulty } from "@prisma/client"

/** Shared scoring math used by every game mode, kept in one place so XP/coin economy stays consistent. */

export const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  easy: 1,
  medium: 1.5,
  hard: 2,
}

export function calculateAccuracy(correct: number, wrong: number): number {
  const total = correct + wrong
  if (total === 0) return 0
  return Math.round((correct / total) * 1000) / 10 // one decimal place
}

/** Keys-per-minute: correct keystrokes normalized to a 60-second rate. */
export function calculateKpm(correct: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0
  return Math.round((correct / durationSeconds) * 60 * 10) / 10
}

export function calculateXpEarned(correct: number, difficulty: Difficulty): number {
  return Math.round(correct * 2 * DIFFICULTY_MULTIPLIER[difficulty])
}

export function calculateCoinsEarned(correct: number, maxCombo: number, difficulty: Difficulty): number {
  const comboBonus = Math.floor(maxCombo / 10) * 5
  return Math.round(correct * DIFFICULTY_MULTIPLIER[difficulty]) + comboBonus
}
