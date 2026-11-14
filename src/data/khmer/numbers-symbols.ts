export interface KhmerToken {
  char: string
  romanization: string
}

/** Khmer numerals ០-៩ (0-9). */
export const KHMER_NUMBERS: KhmerToken[] = [
  { char: "០", romanization: "0" },
  { char: "១", romanization: "1" },
  { char: "២", romanization: "2" },
  { char: "៣", romanization: "3" },
  { char: "៤", romanization: "4" },
  { char: "៥", romanization: "5" },
  { char: "៦", romanization: "6" },
  { char: "៧", romanization: "7" },
  { char: "៨", romanization: "8" },
  { char: "៩", romanization: "9" },
]

/** Common Khmer punctuation and diacritic symbols. */
export const KHMER_SYMBOLS: KhmerToken[] = [
  { char: "។", romanization: "khan (period)" },
  { char: "ៗ", romanization: "lek too (repeat)" },
  { char: "៕", romanization: "bariyoosan" },
  { char: "៖", romanization: "colon" },
  { char: "ៈ", romanization: "ashda" },
  { char: "់", romanization: "bantoc" },
  { char: "័", romanization: "kakabat" },
  { char: "៌", romanization: "robat" },
  { char: "៍", romanization: "toandakhiat" },
  { char: "្", romanization: "coeng (subscript)" },
  { char: "៊", romanization: "treisap" },
  { char: "៉", romanization: "muusikatoan" },
]
