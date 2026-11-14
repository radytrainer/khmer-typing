/**
 * Physical key → Khmer character mapping for the "Khmer Traditional" layout — the Windows
 * built-in Khmer keyboard driver (KBDKHMR.DLL, locale 0x0453 / km-KH). Every codepoint below was
 * parsed programmatically (not hand-copied) from the `U+XXXX` directives in the open-source
 * Keyman project's plain-text keyboard source, so it's a byte-exact transcription rather than a
 * visual read of a keyboard diagram:
 * https://github.com/keymanapp/keyboards/blob/master/release/k/khmer_traditional/source/khmer_traditional.kmn
 *
 * `code` is the physical key using the KeyboardEvent.code naming convention, so the on-screen
 * keyboard can highlight the correct tile from a real keydown event regardless of which
 * character the OS's active Khmer IME actually produced.
 *
 * altGr/shiftAltGr cover the rarer lunar-calendar digits and legacy symbols on this layout;
 * the on-screen keyboard only needs base/shift for everyday typing practice.
 */
export interface KeyDef {
  code: string
  base?: string
  shift?: string
  altGr?: string
  shiftAltGr?: string
}

/** Produced by [K_SPACE] on this layout: the COENG sign used to stack a subscript consonant. */
export const COENG_SIGN = "្"

/** Human-readable labels for keys whose actual character is zero-width/invisible. */
export const INVISIBLE_KEY_LABELS: Record<string, string> = {
  "‌": "ZWNJ",
  "‍": "ZWJ",
  "​": "ZWSP",
}

export const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { code: "Backquote", base: "‌", shift: "‍", altGr: "៙", shiftAltGr: "᧠" },
    { code: "Digit1", base: "១", shift: "!", altGr: "1", shiftAltGr: "᧡" },
    { code: "Digit2", base: "២", shift: "ៗ", altGr: "2", shiftAltGr: "᧢" },
    { code: "Digit3", base: "៣", shift: "៊", altGr: "3", shiftAltGr: "᧣" },
    { code: "Digit4", base: "៤", shift: "៛", altGr: "4", shiftAltGr: "᧤" },
    { code: "Digit5", base: "៥", shift: "័", altGr: "5", shiftAltGr: "᧥" },
    { code: "Digit6", base: "៦", shift: "៌", altGr: "6", shiftAltGr: "᧦" },
    { code: "Digit7", base: "៧", shift: "៍", altGr: "7", shiftAltGr: "᧧" },
    { code: "Digit8", base: "៨", shift: "៏", altGr: "8", shiftAltGr: "᧨" },
    { code: "Digit9", base: "៩", shift: "៎", altGr: "9", shiftAltGr: "᧩" },
    { code: "Digit0", base: "០", shift: "៑", altGr: "0", shiftAltGr: "᧪" },
    { code: "Minus", base: "-", shift: "_", altGr: "{", shiftAltGr: "᧫" },
    { code: "Equal", base: "=", shift: "+", altGr: "}", shiftAltGr: "᧬" },
  ],
  [
    { code: "KeyQ", base: "ឆ", shift: "ឈ", altGr: "*", shiftAltGr: "᧭" },
    { code: "KeyW", base: "ឹ", shift: "ឺ", altGr: undefined, shiftAltGr: "᧮" },
    { code: "KeyE", base: "េ", shift: "ែ", altGr: "ឯ", shiftAltGr: "᧯" },
    { code: "KeyR", base: "រ", shift: "ឬ", altGr: "ឫ", shiftAltGr: "៰" },
    { code: "KeyT", base: "ត", shift: "ទ", altGr: "ឦ", shiftAltGr: "៱" },
    { code: "KeyY", base: "យ", shift: "ួ", altGr: "ឲ", shiftAltGr: "៲" },
    { code: "KeyU", base: "ុ", shift: "ូ", altGr: "ឧ", shiftAltGr: "៳" },
    { code: "KeyI", base: "ិ", shift: "ី", altGr: "ឥ", shiftAltGr: "៴" },
    { code: "KeyO", base: "ោ", shift: "ៅ", altGr: "ឱ", shiftAltGr: "៵" },
    { code: "KeyP", base: "ផ", shift: "ភ", altGr: "ឳ", shiftAltGr: "៶" },
    { code: "BracketLeft", base: "ើ", shift: "ោះ", altGr: "[", shiftAltGr: "៷" },
    { code: "BracketRight", base: "ឿ", shift: "ៀ", altGr: "]", shiftAltGr: "៸" },
    { code: "Backslash", base: "\\", shift: "/", altGr: "៚", shiftAltGr: "៹" },
  ],
  [
    { code: "KeyA", base: "ា", shift: "ៃ", altGr: "ឩ", shiftAltGr: "᧰" },
    { code: "KeyS", base: "ស", shift: "ាំ", altGr: "ឪ", shiftAltGr: "᧱" },
    { code: "KeyD", base: "ដ", shift: "ឌ", altGr: undefined, shiftAltGr: "᧲" },
    { code: "KeyF", base: "ថ", shift: "ធ", altGr: undefined, shiftAltGr: "᧳" },
    { code: "KeyG", base: "ង", shift: "ុះ", altGr: undefined, shiftAltGr: "᧴" },
    { code: "KeyH", base: "ហ", shift: "ះ", altGr: undefined, shiftAltGr: "᧵" },
    { code: "KeyJ", base: "ញ", shift: "ុំ", altGr: "ឮ", shiftAltGr: "᧶" },
    { code: "KeyK", base: "ក", shift: "គ", altGr: "ឭ", shiftAltGr: "᧷" },
    { code: "KeyL", base: "ល", shift: "ឡ", altGr: "ឰ", shiftAltGr: "᧸" },
    { code: "Semicolon", base: "ៈ", shift: "៖", altGr: ";", shiftAltGr: "᧹" },
    { code: "Quote", base: "់", shift: "៉", altGr: "៝", shiftAltGr: "᧺" },
  ],
  [
    { code: "KeyZ", base: "ឋ", shift: "ឍ", altGr: "#", shiftAltGr: "᧻" },
    { code: "KeyX", base: "ខ", shift: "ឃ", altGr: "@", shiftAltGr: "᧼" },
    { code: "KeyC", base: "ច", shift: "ជ", altGr: "&", shiftAltGr: "᧽" },
    { code: "KeyV", base: "វ", shift: "េះ", altGr: "$", shiftAltGr: "᧾" },
    { code: "KeyB", base: "ប", shift: "ព", altGr: "%", shiftAltGr: "᧿" },
    { code: "KeyN", base: "ន", shift: "ណ", altGr: "(", shiftAltGr: undefined },
    { code: "KeyM", base: "ម", shift: "ំ", altGr: ")", shiftAltGr: undefined },
    { code: "Comma", base: "អ", shift: ",", altGr: "‹", shiftAltGr: undefined },
    { code: "Period", base: "។", shift: ".", altGr: "›", shiftAltGr: "ឝ" },
    { code: "Slash", base: "​", shift: "?", altGr: "៕", shiftAltGr: "ឞ" },
  ],
]

/** Fast lookup from a typed character back to the physical key that (in its base or shift form) produces it. */
export const CHAR_TO_KEY: Map<string, { code: string; layer: "base" | "shift" | "altGr" | "shiftAltGr" }> = new Map()
for (const row of KEYBOARD_ROWS) {
  for (const k of row) {
    if (k.base && !CHAR_TO_KEY.has(k.base)) CHAR_TO_KEY.set(k.base, { code: k.code, layer: "base" })
    if (k.shift && !CHAR_TO_KEY.has(k.shift)) CHAR_TO_KEY.set(k.shift, { code: k.code, layer: "shift" })
    if (k.altGr && !CHAR_TO_KEY.has(k.altGr)) CHAR_TO_KEY.set(k.altGr, { code: k.code, layer: "altGr" })
    if (k.shiftAltGr && !CHAR_TO_KEY.has(k.shiftAltGr)) CHAR_TO_KEY.set(k.shiftAltGr, { code: k.code, layer: "shiftAltGr" })
  }
}
CHAR_TO_KEY.set(COENG_SIGN, { code: "Space", layer: "base" })
