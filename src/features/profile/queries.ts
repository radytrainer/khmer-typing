import { prisma } from "@/lib/prisma"

/** XP required to reach a given level. Simple increasing curve: level*100 XP per level. */
export function xpForLevel(level: number): number {
  return level * 100
}

export function levelProgress(xp: number, level: number) {
  const currentLevelFloor = xpForLevel(level - 1)
  const nextLevelCeiling = xpForLevel(level)
  const span = nextLevelCeiling - currentLevelFloor
  const progressed = xp - currentLevelFloor
  return {
    xpIntoLevel: Math.max(0, progressed),
    xpForNextLevel: span,
    percent: Math.min(100, Math.max(0, Math.round((progressed / span) * 100))),
  }
}

export interface StudentDashboardData {
  bestKpm: number
  avgAccuracy: number
  gamesPlayed: number
  recentAchievements: {
    code: string
    name: string
    icon: string
    rarity: string
    unlockedAt: Date
  }[]
  dailyChallenge: {
    goal: number
    progress: number
  }
}

const DAILY_CHALLENGE_GOAL_LETTERS = 50

export async function getStudentDashboardData(userId: string): Promise<StudentDashboardData> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [aggregate, recentAchievements, todayProgress] = await Promise.all([
    prisma.gameSession.aggregate({
      where: { userId },
      _max: { kpm: true },
      _avg: { accuracy: true },
      _count: { id: true },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: "desc" },
      take: 5,
      include: { achievement: true },
    }),
    prisma.dailyProgress.findUnique({
      where: { userId_date: { userId, date: today } },
    }),
  ])

  return {
    bestKpm: Number(aggregate._max.kpm ?? 0),
    avgAccuracy: Number(aggregate._avg.accuracy ?? 0),
    gamesPlayed: aggregate._count.id,
    recentAchievements: recentAchievements.map((ua) => ({
      code: ua.achievement.code,
      name: ua.achievement.name,
      icon: ua.achievement.icon,
      rarity: ua.achievement.rarity,
      unlockedAt: ua.unlockedAt,
    })),
    dailyChallenge: {
      goal: DAILY_CHALLENGE_GOAL_LETTERS,
      progress: Math.min(DAILY_CHALLENGE_GOAL_LETTERS, todayProgress?.correctLetters ?? 0),
    },
  }
}
