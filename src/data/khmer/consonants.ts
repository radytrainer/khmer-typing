/** The 33 Khmer consonants (អក្សរស្រៈ). Each carries an inherent vowel of either the "A" series or "O" series. */
export type ConsonantSeries = "a" | "o"

export interface KhmerConsonant {
  char: string
  romanization: string
  series: ConsonantSeries
  /** Row/column position on the standard NiDA Khmer keyboard layout, used to render the on-screen keyboard. */
  keyboardRow: number
}

export const KHMER_CONSONANTS: KhmerConsonant[] = [
  { char: "ក", romanization: "ka", series: "a", keyboardRow: 3 },
  { char: "ខ", romanization: "kha", series: "a", keyboardRow: 3 },
  { char: "គ", romanization: "ko", series: "o", keyboardRow: 3 },
  { char: "ឃ", romanization: "kho", series: "o", keyboardRow: 3 },
  { char: "ង", romanization: "ngo", series: "o", keyboardRow: 3 },
  { char: "ច", romanization: "cha", series: "a", keyboardRow: 3 },
  { char: "ឆ", romanization: "chha", series: "a", keyboardRow: 3 },
  { char: "ជ", romanization: "cho", series: "o", keyboardRow: 3 },
  { char: "ឈ", romanization: "chho", series: "o", keyboardRow: 3 },
  { char: "ញ", romanization: "nyo", series: "o", keyboardRow: 3 },
  { char: "ដ", romanization: "da", series: "a", keyboardRow: 3 },
  { char: "ឋ", romanization: "ttha", series: "a", keyboardRow: 3 },
  { char: "ឌ", romanization: "do", series: "o", keyboardRow: 3 },
  { char: "ឍ", romanization: "ttho", series: "o", keyboardRow: 3 },
  { char: "ណ", romanization: "na", series: "a", keyboardRow: 3 },
  { char: "ត", romanization: "ta", series: "a", keyboardRow: 2 },
  { char: "ថ", romanization: "tha", series: "a", keyboardRow: 2 },
  { char: "ទ", romanization: "to", series: "o", keyboardRow: 2 },
  { char: "ធ", romanization: "tho", series: "o", keyboardRow: 2 },
  { char: "ន", romanization: "no", series: "o", keyboardRow: 2 },
  { char: "ប", romanization: "ba", series: "a", keyboardRow: 2 },
  { char: "ផ", romanization: "pha", series: "a", keyboardRow: 2 },
  { char: "ព", romanization: "po", series: "o", keyboardRow: 2 },
  { char: "ភ", romanization: "pho", series: "o", keyboardRow: 2 },
  { char: "ម", romanization: "mo", series: "o", keyboardRow: 2 },
  { char: "យ", romanization: "yo", series: "o", keyboardRow: 2 },
  { char: "រ", romanization: "ro", series: "o", keyboardRow: 2 },
  { char: "ល", romanization: "lo", series: "o", keyboardRow: 2 },
  { char: "វ", romanization: "vo", series: "o", keyboardRow: 2 },
  { char: "ស", romanization: "sa", series: "a", keyboardRow: 2 },
  { char: "ហ", romanization: "ha", series: "a", keyboardRow: 2 },
  { char: "ឡ", romanization: "la", series: "a", keyboardRow: 2 },
  { char: "អ", romanization: "a", series: "a", keyboardRow: 2 },
]
