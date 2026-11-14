import { prisma } from "@/lib/prisma"

export interface UnlockedAchievement {
  code: string
  name: string
  icon: string
  rarity: string
}

interface SessionContext {
  sessionAccuracy: number
  gameSlug: string
}

/**
 * Evaluates every achievement the user hasn't unlocked yet against their up-to-date lifetime
 * stats, and persists any newly-earned ones (awarding their XP/coin reward in the same pass).
 *
 * Only criteria types backed by something this build actually tracks are evaluated — the rest
 * (marathon durations, shop purchases, letter-category mastery, streak/time-of-day "special"
 * flags, and every other game mode's play-count/hard-clear achievements) fall through to
 * `false` until those features exist, rather than guessing. See README roadmap.
 */
export async function checkAndUnlockAchievements(
  userId: string,
  context: SessionContext,
): Promise<UnlockedAchievement[]> {
  const [profile, aggregate, gameModeCount, alreadyUnlocked, allAchievements] = await Promise.all([
    prisma.profile.findUniqueOrThrow({ where: { id: userId } }),
    prisma.gameSession.aggregate({
      where: { userId },
      _sum: { correctCount: true },
      _max: { maxCombo: true, kpm: true },
      _count: { id: true },
    }),
    prisma.gameSession.count({
      where: { userId, game: { slug: context.gameSlug } },
    }),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementCode: true } }),
    prisma.achievement.findMany(),
  ])

  const unlockedCodes = new Set(alreadyUnlocked.map((u) => u.achievementCode))
  const candidates = allAchievements.filter((a) => !unlockedCodes.has(a.code))

  const totalCorrect = aggregate._sum.correctCount ?? 0
  const maxComboEver = aggregate._max.maxCombo ?? 0
  const maxKpmEver = Number(aggregate._max.kpm ?? 0)
  const totalGames = aggregate._count.id

  function qualifies(a: (typeof candidates)[number]): boolean {
    switch (a.criteriaType) {
      case "correct_letters_total":
        return totalCorrect >= a.criteriaValue
      case "combo_max":
        return maxComboEver >= a.criteriaValue
      case "accuracy_single_game":
        return context.sessionAccuracy >= a.criteriaValue
      case "kpm_max":
        return maxKpmEver >= a.criteriaValue
      case "games_played_total":
        return totalGames >= a.criteriaValue
      case "level_reached":
        return profile.level >= a.criteriaValue
      // Approximation: there's no separate coin ledger yet (Shop isn't built), so current
      // balance stands in for lifetime coins earned. Revisit once coins can be spent.
      case "coins_earned_total":
        return profile.coins >= a.criteriaValue
      case "achievements_unlocked_count":
        return unlockedCodes.size >= a.criteriaValue
      case "game_mode_played_count":
        return a.meta === context.gameSlug && gameModeCount >= a.criteriaValue
      default:
        return false
    }
  }

  const newlyUnlocked = candidates.filter(qualifies)
  if (newlyUnlocked.length === 0) return []

  const totalXpReward = newlyUnlocked.reduce((sum, a) => sum + a.xpReward, 0)
  const totalCoinReward = newlyUnlocked.reduce((sum, a) => sum + a.coinReward, 0)

  await prisma.$transaction([
    prisma.userAchievement.createMany({
      data: newlyUnlocked.map((a) => ({ userId, achievementCode: a.code })),
      skipDuplicates: true,
    }),
    prisma.profile.update({
      where: { id: userId },
      data: { xp: { increment: totalXpReward }, coins: { increment: totalCoinReward } },
    }),
  ])

  return newlyUnlocked.map((a) => ({ code: a.code, name: a.name, icon: a.icon, rarity: a.rarity }))
}
