import type { Difficulty } from "@prisma/client"
import type { WordCategory } from "@/data/khmer"

/**
 * Unlike Falling Letters (where difficulty picks *which characters* appear), Falling Words fixes
 * the word pool by category and uses difficulty purely for pacing — typing a whole word takes
 * longer than a single keystroke, so speeds/spawn rates are tuned slower across the board.
 */
export const DIFFICULTY_SETTINGS: Record<Difficulty, { initialSpawnMs: number; initialFallSpeed: number; startingHearts: number }> = {
  easy: { initialSpawnMs: 2600, initialFallSpeed: 40, startingHearts: 4 },
  medium: { initialSpawnMs: 2000, initialFallSpeed: 55, startingHearts: 3 },
  hard: { initialSpawnMs: 1600, initialFallSpeed: 70, startingHearts: 3 },
}

export interface CategoryOption {
  value: WordCategory
  label: string
  /** lucide-react icon name. */
  icon: string
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: "animals", label: "Animals", icon: "PawPrint" },
  { value: "food", label: "Food", icon: "UtensilsCrossed" },
  { value: "school", label: "School", icon: "GraduationCap" },
  { value: "family", label: "Family", icon: "Users" },
  { value: "colors", label: "Colors", icon: "Palette" },
  { value: "daily_life", label: "Daily Life", icon: "Home" },
  { value: "technology", label: "Technology", icon: "Cpu" },
  { value: "nature", label: "Nature", icon: "Trees" },
]

export interface FallingWordsResult {
  score: number
  /** Correct keystrokes across all words (partial + completed), kept per-key like Falling Letters so KPM stays meaningful. */
  correctCount: number
  wrongCount: number
  maxCombo: number
  durationSeconds: number
  difficulty: Difficulty
}

/** Events the Phaser scene emits; the React wrapper listens to these to drive the HUD. */
export interface FallingWordsSceneEvents {
  "state-update": {
    score: number
    hearts: number
    combo: number
    targetChar: string | null
    romanization: string | null
    englishMeaning: string | null
  }
  "game-over": FallingWordsResult
}
