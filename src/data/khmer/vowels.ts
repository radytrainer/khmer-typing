/** Independent vowels (ស្រៈពេញតួ) — stand alone, do not attach to a consonant. */
export interface KhmerVowel {
  char: string
  romanization: string
}

export const KHMER_INDEPENDENT_VOWELS: KhmerVowel[] = [
  { char: "ឥ", romanization: "e" },
  { char: "ឦ", romanization: "ei" },
  { char: "ឧ", romanization: "o" },
  { char: "ឩ", romanization: "ou" },
  { char: "ឪ", romanization: "ao" },
  { char: "ឫ", romanization: "rue" },
  { char: "ឬ", romanization: "rue" },
  { char: "ឭ", romanization: "lue" },
  { char: "ឮ", romanization: "lue" },
  { char: "ឯ", romanization: "ae" },
  { char: "ឰ", romanization: "ai" },
  { char: "ឱ", romanization: "ao" },
  { char: "ឳ", romanization: "au" },
]

/** Dependent vowels (ស្រៈនិស្ស័យ) — attach to a base consonant to form a syllable. */
export const KHMER_DEPENDENT_VOWELS: KhmerVowel[] = [
  { char: "ា", romanization: "aa" },
  { char: "ិ", romanization: "i" },
  { char: "ី", romanization: "ii" },
  { char: "ឹ", romanization: "ue" },
  { char: "ឺ", romanization: "uue" },
  { char: "ុ", romanization: "u" },
  { char: "ូ", romanization: "uu" },
  { char: "ួ", romanization: "uo" },
  { char: "ើ", romanization: "aeu" },
  { char: "ឿ", romanization: "uea" },
  { char: "ៀ", romanization: "ie" },
  { char: "េ", romanization: "e" },
  { char: "ែ", romanization: "ae" },
  { char: "ៃ", romanization: "ai" },
  { char: "ោ", romanization: "ao" },
  { char: "ៅ", romanization: "au" },
  { char: "ុំ", romanization: "om" },
  { char: "ំ", romanization: "am" },
  { char: "ាំ", romanization: "aam" },
  { char: "ះ", romanization: "ah" },
  { char: "ុះ", romanization: "uh" },
]
