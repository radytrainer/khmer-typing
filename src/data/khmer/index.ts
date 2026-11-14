import { KHMER_CONSONANTS, type KhmerConsonant } from "./consonants"
import { KHMER_INDEPENDENT_VOWELS, KHMER_DEPENDENT_VOWELS, type KhmerVowel } from "./vowels"
import { KHMER_NUMBERS, KHMER_SYMBOLS, type KhmerToken } from "./numbers-symbols"

export * from "./consonants"
export * from "./vowels"
export * from "./numbers-symbols"
export * from "./words"

export type LetterCategory = "consonant" | "independent_vowel" | "dependent_vowel" | "number" | "symbol"

export interface KhmerLetter {
  char: string
  romanization: string
  category: LetterCategory
}

function tag<T extends { char: string; romanization: string }>(
  items: T[],
  category: LetterCategory,
): KhmerLetter[] {
  return items.map(({ char, romanization }) => ({ char, romanization, category }))
}

/** Flat list of every letter/token used by the Falling Letters game and Learning Mode alphabet drills. */
export const ALL_KHMER_LETTERS: KhmerLetter[] = [
  ...tag<KhmerConsonant>(KHMER_CONSONANTS, "consonant"),
  ...tag<KhmerVowel>(KHMER_INDEPENDENT_VOWELS, "independent_vowel"),
  ...tag<KhmerVowel>(KHMER_DEPENDENT_VOWELS, "dependent_vowel"),
  ...tag<KhmerToken>(KHMER_NUMBERS, "number"),
  ...tag<KhmerToken>(KHMER_SYMBOLS, "symbol"),
]

export const LETTERS_BY_CATEGORY: Record<LetterCategory, KhmerLetter[]> = {
  consonant: tag<KhmerConsonant>(KHMER_CONSONANTS, "consonant"),
  independent_vowel: tag<KhmerVowel>(KHMER_INDEPENDENT_VOWELS, "independent_vowel"),
  dependent_vowel: tag<KhmerVowel>(KHMER_DEPENDENT_VOWELS, "dependent_vowel"),
  number: tag<KhmerToken>(KHMER_NUMBERS, "number"),
  symbol: tag<KhmerToken>(KHMER_SYMBOLS, "symbol"),
}
