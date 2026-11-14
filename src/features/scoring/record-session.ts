import type { Difficulty } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { calculateXpEarned, calculateCoinsEarned } from "./formulas"
import { checkAndUnlockAchievements } from "@/features/achievements/check"

export interface RecordSessionInput {
  userId: string
  gameSlug: string
  difficulty: Difficulty
  score: number
  correctCount: number
  wrongCount: number
  maxCombo: number
  durationSeconds: number
  kpm: number
  accuracy: number
}

export interface RecordSessionResult {
  xpEarned: number
  coinsEarned: number
  newLevel: number
  newAchievements: { code: string; name: string; icon: string; rarity: string }[]
}

function levelForXp(xp: number): number {
  return Math.floor(xp / 100) + 1
}

function startOfDay(d: Date): Date {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function nextStreak(lastPlayedAt: Date | null, currentStreak: number, today: Date): number {
  if (!lastPlayedAt) return 1
  const daysDiff = Math.round((today.getTime() - startOfDay(lastPlayedAt).getTime()) / 86_400_000)
  if (daysDiff === 0) return currentStreak || 1
  if (daysDiff === 1) return currentStreak + 1
  return 1
}

export async function recordGameSession(input: RecordSessionInput): Promise<RecordSessionResult> {
  const game = await prisma.game.findUniqueOrThrow({ where: { slug: input.gameSlug } })

  const xpEarned = calculateXpEarned(input.correctCount, input.difficulty)
  const coinsEarned = calculateCoinsEarned(input.correctCount, input.maxCombo, input.difficulty)

  await prisma.gameSession.create({
    data: {
      userId: input.userId,
      gameId: game.id,
      difficulty: input.difficulty,
      score: input.score,
      kpm: input.kpm,
      accuracy: input.accuracy,
      correctCount: input.correctCount,
      wrongCount: input.wrongCount,
      maxCombo: input.maxCombo,
      durationSeconds: input.durationSeconds,
      xpEarned,
      coinsEarned,
    },
  })

  const profile = await prisma.profile.findUniqueOrThrow({ where: { id: input.userId } })
  const today = startOfDay(new Date())
  const newXp = profile.xp + xpEarned
  const newStreak = nextStreak(profile.lastPlayedAt, profile.currentStreak, today)

  const updatedProfile = await prisma.profile.update({
    where: { id: input.userId },
    data: {
      xp: newXp,
      coins: { increment: coinsEarned },
      level: levelForXp(newXp),
      currentStreak: newStreak,
      longestStreak: Math.max(profile.longestStreak, newStreak),
      lastPlayedAt: new Date(),
    },
  })

  await prisma.dailyProgress.upsert({
    where: { userId_date: { userId: input.userId, date: today } },
    create: {
      userId: input.userId,
      date: today,
      xpEarned,
      gamesPlayed: 1,
      minutesPlayed: Math.round(input.durationSeconds / 60),
      correctLetters: input.correctCount,
      wrongLetters: input.wrongCount,
    },
    update: {
      xpEarned: { increment: xpEarned },
      gamesPlayed: { increment: 1 },
      minutesPlayed: { increment: Math.round(input.durationSeconds / 60) },
      correctLetters: { increment: input.correctCount },
      wrongLetters: { increment: input.wrongCount },
    },
  })

  const newAchievements = await checkAndUnlockAchievements(input.userId, {
    sessionAccuracy: input.accuracy,
    gameSlug: input.gameSlug,
  })

  return { xpEarned, coinsEarned, newLevel: updatedProfile.level, newAchievements }
}
