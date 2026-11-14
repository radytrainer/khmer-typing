import { requireProfile } from "@/features/auth/guards"
import { prisma } from "@/lib/prisma"
import { AchievementBadge } from "@/components/dashboard/achievement-badge"

const RARITY_ORDER = ["legendary", "epic", "rare", "common"]
const RARITY_LABEL: Record<string, string> = {
  legendary: "Legendary",
  epic: "Epic",
  rare: "Rare",
  common: "Common",
}

export default async function AchievementsPage() {
  const profile = await requireProfile()

  const [allAchievements, unlocked] = await Promise.all([
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId: profile.id }, select: { achievementCode: true } }),
  ])

  const unlockedCodes = new Set(unlocked.map((u) => u.achievementCode))

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold">Achievements</h1>
        <p className="text-muted-foreground">
          {unlockedCodes.size} / {allAchievements.length} unlocked
        </p>
      </div>

      {RARITY_ORDER.map((rarity) => {
        const items = allAchievements.filter((a) => a.rarity === rarity)
        if (items.length === 0) return null

        return (
          <div key={rarity}>
            <h2 className="mb-4 text-lg font-bold">{RARITY_LABEL[rarity]}</h2>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
              {items.map((a) => (
                <AchievementBadge
                  key={a.code}
                  icon={a.icon}
                  name={a.name}
                  rarity={a.rarity}
                  locked={!unlockedCodes.has(a.code)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
