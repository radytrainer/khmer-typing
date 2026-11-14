/**
 * Idempotent seed script for reference data (games, letters, words, achievements).
 * All content is authored once in src/data/*.ts and pushed into Postgres here, so there is a
 * single source of truth shared by the seed, the Games hub UI, and (for achievements) the
 * client-side badge components.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient, LetterCategory, WordCategory, Difficulty, AchievementRarity } from "@prisma/client"
import { GAMES } from "../src/data/games"
import { ALL_KHMER_LETTERS, type LetterCategory as DataLetterCategory } from "../src/data/khmer"
import { KHMER_WORDS } from "../src/data/khmer/words"
import { ACHIEVEMENTS } from "../src/data/achievements"

const prisma = new PrismaClient()

/** Heuristic difficulty per letter category — consonants/numbers are taught first, symbols last. */
const DIFFICULTY_BY_CATEGORY: Record<DataLetterCategory, Difficulty> = {
  consonant: Difficulty.easy,
  number: Difficulty.easy,
  independent_vowel: Difficulty.medium,
  dependent_vowel: Difficulty.medium,
  symbol: Difficulty.hard,
}

async function seedGames() {
  for (const game of GAMES) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      create: {
        slug: game.slug,
        name: game.name,
        description: game.description,
        icon: game.icon,
        isActive: game.status === "available",
        sortOrder: game.sortOrder,
      },
      update: {
        name: game.name,
        description: game.description,
        icon: game.icon,
        isActive: game.status === "available",
        sortOrder: game.sortOrder,
      },
    })
  }
  console.log(`Seeded ${GAMES.length} games.`)
}

async function seedLetters() {
  const categoryCounters: Record<string, number> = {}
  for (const letter of ALL_KHMER_LETTERS) {
    const sortOrder = (categoryCounters[letter.category] ??= 0)
    categoryCounters[letter.category] += 1

    await prisma.letter.upsert({
      where: { char_category: { char: letter.char, category: letter.category as LetterCategory } },
      create: {
        char: letter.char,
        romanization: letter.romanization,
        category: letter.category as LetterCategory,
        difficulty: DIFFICULTY_BY_CATEGORY[letter.category],
        sortOrder,
      },
      update: {
        romanization: letter.romanization,
        difficulty: DIFFICULTY_BY_CATEGORY[letter.category],
        sortOrder,
      },
    })
  }
  console.log(`Seeded ${ALL_KHMER_LETTERS.length} letters.`)
}

async function seedWords() {
  for (const w of KHMER_WORDS) {
    await prisma.word.upsert({
      where: { word_category: { word: w.word, category: w.category as WordCategory } },
      create: {
        word: w.word,
        romanization: w.romanization,
        englishMeaning: w.englishMeaning,
        category: w.category as WordCategory,
        difficulty: w.difficulty as Difficulty,
      },
      update: {
        romanization: w.romanization,
        englishMeaning: w.englishMeaning,
        difficulty: w.difficulty as Difficulty,
      },
    })
  }
  console.log(`Seeded ${KHMER_WORDS.length} words.`)
}

async function seedAchievements() {
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { code: a.code },
      create: {
        code: a.code,
        name: a.name,
        description: a.description,
        icon: a.icon,
        rarity: a.rarity as AchievementRarity,
        criteriaType: a.criteriaType,
        criteriaValue: a.criteriaValue,
        meta: a.meta,
        xpReward: a.xpReward,
        coinReward: a.coinReward,
      },
      update: {
        name: a.name,
        description: a.description,
        icon: a.icon,
        rarity: a.rarity as AchievementRarity,
        criteriaType: a.criteriaType,
        criteriaValue: a.criteriaValue,
        meta: a.meta,
        xpReward: a.xpReward,
        coinReward: a.coinReward,
      },
    })
  }
  console.log(`Seeded ${ACHIEVEMENTS.length} achievements.`)
}

async function main() {
  await seedGames()
  await seedLetters()
  await seedWords()
  await seedAchievements()
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
