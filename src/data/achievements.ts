export type AchievementRarity = "common" | "rare" | "epic" | "legendary"

export type AchievementCriteriaType =
  | "correct_letters_total"
  | "combo_max"
  | "accuracy_single_game"
  | "kpm_max"
  | "streak_days"
  | "games_played_total"
  | "game_mode_played_count"
  | "game_mode_hard_cleared"
  | "level_reached"
  | "coins_earned_total"
  | "achievements_unlocked_count"
  | "letter_category_mastered"
  | "marathon_duration_completed"
  | "shop_items_purchased"
  | "special"

export interface AchievementDefinition {
  /** Stable, unique slug — used as the DB primary key so re-seeding is idempotent. */
  code: string
  name: string
  description: string
  /** lucide-react icon name, resolved to a component by the badge renderer. */
  icon: string
  rarity: AchievementRarity
  criteriaType: AchievementCriteriaType
  criteriaValue: number
  /** Extra qualifier for criteria that need one, e.g. a game slug or letter category. */
  meta?: string
  xpReward: number
  coinReward: number
}

function rarityFor(index: number, total: number): AchievementRarity {
  const pct = index / total
  if (pct < 0.5) return "common"
  if (pct < 0.8) return "rare"
  if (pct < 0.95) return "epic"
  return "legendary"
}

function tierRewards(rarity: AchievementRarity) {
  switch (rarity) {
    case "common":
      return { xp: 20, coins: 10 }
    case "rare":
      return { xp: 50, coins: 30 }
    case "epic":
      return { xp: 120, coins: 75 }
    case "legendary":
      return { xp: 300, coins: 200 }
  }
}

function buildTier(
  values: number[],
  opts: {
    codePrefix: string
    criteriaType: AchievementCriteriaType
    icon: string
    nameFor: (value: number) => string
    descriptionFor: (value: number) => string
    meta?: string
  },
): AchievementDefinition[] {
  return values.map((value, i) => {
    const rarity = rarityFor(i, values.length)
    const { xp, coins } = tierRewards(rarity)
    return {
      code: `${opts.codePrefix}_${value}`,
      name: opts.nameFor(value),
      description: opts.descriptionFor(value),
      icon: opts.icon,
      rarity,
      criteriaType: opts.criteriaType,
      criteriaValue: value,
      meta: opts.meta,
      xpReward: xp,
      coinReward: coins,
    }
  })
}

const GAME_SLUGS = [
  "falling-letters",
  "falling-words",
  "zombie-typing",
  "racer",
  "balloon-pop",
  "fish-catch",
  "space-shooter",
  "castle-defense",
  "memory-typing",
  "typing-marathon",
]

const LETTER_CATEGORIES = ["consonant", "independent_vowel", "dependent_vowel", "number", "symbol"]

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // 1-9: Correct letters typed (lifetime)
  ...buildTier([10, 50, 100, 250, 500, 1000, 2500, 5000, 10000], {
    codePrefix: "correct_letters",
    criteriaType: "correct_letters_total",
    icon: "Keyboard",
    nameFor: (v) => (v === 10 ? "First Steps" : v >= 10000 ? "Khmer Master" : `${v.toLocaleString()} Correct Letters`),
    descriptionFor: (v) => `Type ${v.toLocaleString()} correct Khmer letters across all games.`,
  }),

  // 10-18: Combo streaks
  ...buildTier([5, 10, 20, 30, 50, 75, 100, 150, 200], {
    codePrefix: "combo",
    criteriaType: "combo_max",
    icon: "Flame",
    nameFor: (v) => (v >= 200 ? "Combo Legend" : `${v}x Combo`),
    descriptionFor: (v) => `Reach a ${v}x combo without a mistake in a single game.`,
  }),

  // 19-24: Accuracy
  ...buildTier([70, 80, 90, 95, 98, 100], {
    codePrefix: "accuracy",
    criteriaType: "accuracy_single_game",
    icon: "Target",
    nameFor: (v) => (v >= 100 ? "Perfect Accuracy" : `Sharp Shooter ${v}%`),
    descriptionFor: (v) =>
      v >= 100
        ? "Finish a game with 100% accuracy and no mistakes."
        : `Finish a game with at least ${v}% accuracy.`,
  }),

  // 25-32: Typing speed (KPM - key presses per minute)
  ...buildTier([20, 30, 40, 50, 60, 80, 100, 120], {
    codePrefix: "kpm",
    criteriaType: "kpm_max",
    icon: "Zap",
    nameFor: (v) => (v >= 120 ? "Typing Legend" : v >= 80 ? "Fast Fingers" : `${v} KPM`),
    descriptionFor: (v) => `Reach a typing speed of ${v} keys per minute in one game.`,
  }),

  // 33-39: Login/play streaks
  ...buildTier([3, 7, 14, 30, 60, 100, 365], {
    codePrefix: "streak",
    criteriaType: "streak_days",
    icon: "CalendarCheck",
    nameFor: (v) => (v >= 365 ? "Year-Long Champion" : `${v}-Day Streak`),
    descriptionFor: (v) => `Play at least one game every day for ${v} days in a row.`,
  }),

  // 40-45: Total games played
  ...buildTier([1, 10, 50, 100, 500, 1000], {
    codePrefix: "games_played",
    criteriaType: "games_played_total",
    icon: "Gamepad2",
    nameFor: (v) => (v === 1 ? "First Game" : v >= 1000 ? "Arcade Veteran" : `${v} Games Played`),
    descriptionFor: (v) => `Complete ${v} game sessions across any game mode.`,
  }),

  // 46-55: Play each game mode 25 times ("collector")
  ...GAME_SLUGS.map((slug, i) => {
    const rarity = rarityFor(i, GAME_SLUGS.length)
    const { xp, coins } = tierRewards(rarity)
    const label = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    return {
      code: `mode_collector_${slug}`,
      name: `${label} Enthusiast`,
      description: `Play ${label} 25 times.`,
      icon: "Repeat",
      rarity,
      criteriaType: "game_mode_played_count" as const,
      criteriaValue: 25,
      meta: slug,
      xpReward: xp,
      coinReward: coins,
    }
  }),

  // 56-65: Clear each game mode on Hard difficulty
  ...GAME_SLUGS.map((slug, i) => {
    const rarity = rarityFor(i, GAME_SLUGS.length)
    const { xp, coins } = tierRewards(rarity)
    const label = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    return {
      code: `mode_hard_${slug}`,
      name: `${label} Champion`,
      description: `Clear ${label} on Hard difficulty.`,
      icon: "Trophy",
      rarity,
      criteriaType: "game_mode_hard_cleared" as const,
      criteriaValue: 1,
      meta: slug,
      xpReward: xp,
      coinReward: coins,
    }
  }),

  // 66-72: Player level reached
  ...buildTier([5, 10, 20, 30, 50, 75, 100], {
    codePrefix: "level",
    criteriaType: "level_reached",
    icon: "Star",
    nameFor: (v) => (v >= 100 ? "Grand Master" : `Level ${v}`),
    descriptionFor: (v) => `Reach player level ${v}.`,
  }),

  // 73-76: Coins earned (lifetime)
  ...buildTier([100, 1000, 10000, 50000], {
    codePrefix: "coins",
    criteriaType: "coins_earned_total",
    icon: "Coins",
    nameFor: (v) => (v >= 50000 ? "Coin Tycoon" : `${v.toLocaleString()} Coins Earned`),
    descriptionFor: (v) => `Earn ${v.toLocaleString()} coins in total.`,
  }),

  // 77-80: Meta achievement-collector
  ...buildTier([10, 25, 50, 75], {
    codePrefix: "collector",
    criteriaType: "achievements_unlocked_count",
    icon: "Award",
    nameFor: (v) => (v >= 75 ? "Champion Collector" : `Collector ${v}`),
    descriptionFor: (v) => `Unlock ${v} achievements.`,
  }),

  // 81-85: Master each letter category
  ...LETTER_CATEGORIES.map((cat, i) => {
    const rarity = rarityFor(i, LETTER_CATEGORIES.length)
    const { xp, coins } = tierRewards(rarity)
    const label: Record<string, string> = {
      consonant: "Consonants",
      independent_vowel: "Independent Vowels",
      dependent_vowel: "Dependent Vowels",
      number: "Numbers",
      symbol: "Symbols",
    }
    return {
      code: `mastery_${cat}`,
      name: `${label[cat]} Mastered`,
      description: `Achieve 95%+ accuracy across all ${label[cat].toLowerCase()} in Learning Mode.`,
      icon: "GraduationCap",
      rarity,
      criteriaType: "letter_category_mastered" as const,
      criteriaValue: 95,
      meta: cat,
      xpReward: xp,
      coinReward: coins,
    }
  }),

  // 86-89: Marathon durations completed
  ...[60, 120, 300, -1].map((seconds, i) => {
    const rarity = rarityFor(i, 4)
    const { xp, coins } = tierRewards(rarity)
    return {
      code: `marathon_${seconds === -1 ? "infinite" : seconds}`,
      name: seconds === -1 ? "Infinite Endurance" : `${seconds / 60}-Minute Marathon`,
      description:
        seconds === -1
          ? "Survive an Infinite Mode Typing Marathon session."
          : `Complete a ${seconds / 60}-minute Typing Marathon.`,
      icon: "Timer",
      rarity,
      criteriaType: "marathon_duration_completed" as const,
      criteriaValue: seconds,
      xpReward: xp,
      coinReward: coins,
    }
  }),

  // 90-91: Shop
  ...buildTier([1, 10], {
    codePrefix: "shop",
    criteriaType: "shop_items_purchased",
    icon: "ShoppingBag",
    nameFor: (v) => (v === 1 ? "First Purchase" : "Big Spender"),
    descriptionFor: (v) => `Buy ${v} item${v > 1 ? "s" : ""} from the Shop.`,
  }),

  // 92-100: Special / fun achievements (flag-based, evaluated by app logic rather than a numeric threshold)
  {
    code: "special_night_owl",
    name: "Night Owl",
    description: "Play a game between 10 PM and 4 AM.",
    icon: "Moon",
    rarity: "rare",
    criteriaType: "special",
    criteriaValue: 1,
    meta: "night_owl",
    xpReward: 50,
    coinReward: 30,
  },
  {
    code: "special_early_bird",
    name: "Early Bird",
    description: "Play a game between 5 AM and 7 AM.",
    icon: "Sunrise",
    rarity: "rare",
    criteriaType: "special",
    criteriaValue: 1,
    meta: "early_bird",
    xpReward: 50,
    coinReward: 30,
  },
  {
    code: "special_weekend_warrior",
    name: "Weekend Warrior",
    description: "Play on both Saturday and Sunday in the same week.",
    icon: "PartyPopper",
    rarity: "common",
    criteriaType: "special",
    criteriaValue: 1,
    meta: "weekend_warrior",
    xpReward: 20,
    coinReward: 10,
  },
  {
    code: "special_comeback",
    name: "Welcome Back",
    description: "Return to play after a break of 7 or more days.",
    icon: "Undo2",
    rarity: "common",
    criteriaType: "special",
    criteriaValue: 7,
    meta: "comeback",
    xpReward: 20,
    coinReward: 10,
  },
  {
    code: "special_flawless_marathon",
    name: "Flawless Marathon",
    description: "Complete a 120-second Typing Marathon with zero mistakes.",
    icon: "ShieldCheck",
    rarity: "epic",
    criteriaType: "special",
    criteriaValue: 1,
    meta: "flawless_marathon",
    xpReward: 120,
    coinReward: 75,
  },
  {
    code: "special_first_letter",
    name: "First Letter",
    description: "Type your very first correct Khmer letter. Welcome to your typing journey!",
    icon: "Sparkles",
    rarity: "common",
    criteriaType: "correct_letters_total",
    criteriaValue: 1,
    xpReward: 10,
    coinReward: 5,
  },
  {
    code: "special_boss_slayer",
    name: "Boss Slayer",
    description: "Defeat a Boss Zombie or Boss wave in any game mode.",
    icon: "Skull",
    rarity: "epic",
    criteriaType: "special",
    criteriaValue: 1,
    meta: "boss_defeated",
    xpReward: 120,
    coinReward: 75,
  },
  {
    code: "special_all_rounder",
    name: "All-Rounder",
    description: "Play every one of the 10 game modes at least once.",
    icon: "LayoutGrid",
    rarity: "epic",
    criteriaType: "special",
    criteriaValue: 10,
    meta: "all_modes_played",
    xpReward: 150,
    coinReward: 100,
  },
  {
    code: "special_typing_legend",
    name: "Typing Legend",
    description: "The ultimate honor: reach Level 100 AND unlock every other achievement.",
    icon: "Crown",
    rarity: "legendary",
    criteriaType: "special",
    criteriaValue: 1,
    meta: "typing_legend",
    xpReward: 1000,
    coinReward: 1000,
  },
]

if (process.env.NODE_ENV !== "production") {
  const codes = new Set(ACHIEVEMENTS.map((a) => a.code))
  if (codes.size !== ACHIEVEMENTS.length) {
    throw new Error("Duplicate achievement code detected in ACHIEVEMENTS — codes must be unique.")
  }
}
