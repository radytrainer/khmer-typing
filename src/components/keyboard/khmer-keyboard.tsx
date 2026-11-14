"use client"

import { useState } from "react"
import { ArrowBigUp } from "lucide-react"
import { KEYBOARD_ROWS, COENG_SIGN } from "@/data/khmer/keyboard-layout"
import { cn } from "@/lib/utils"
import { KeyboardKey } from "./keyboard-key"

interface KhmerKeyboardProps {
  activeCode?: string | null
  shiftActive?: boolean
  /** The character the current game wants the player to type next — highlighted in green. */
  targetChar?: string | null
  /** Lets mobile/no-keyboard users tap a tile to "type" it. */
  onKeyClick?: (char: string) => void
  className?: string
}

// Real keyboards stagger each row instead of stacking keys in a grid — this is what makes it
// read as "a keyboard" rather than "a grid of buttons".
const ROW_STAGGER = ["ml-0", "ml-5 sm:ml-6", "ml-7 sm:ml-8", "ml-0"]

export function KhmerKeyboard({ activeCode, shiftActive = false, targetChar, onKeyClick, className }: KhmerKeyboardProps) {
  // Touch devices have no physical Shift key, so without a tappable one, every shift-layer
  // character (roughly half the consonants on this layout) would be unreachable on mobile.
  const [tapShiftActive, setTapShiftActive] = useState(false)
  const effectiveShiftActive = shiftActive || tapShiftActive

  return (
    <div
      className={cn(
        "relative rounded-b-3xl bg-gradient-to-b from-[#2a2440] to-[#15121f] px-2 pt-4 pb-3 sm:px-4 sm:pt-5 sm:pb-4",
        className,
      )}
    >
      {/* Edge fade hints that the row scrolls horizontally on narrow screens. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#2a2440] to-transparent sm:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#15121f] to-transparent sm:hidden" />

      {/*
        No `justify-center` here on purpose: centering a flex container's content when that
        content overflows makes the browser clip the "before" overflow instead of letting you
        scroll to it (scrollLeft can't go negative), so part of the keyboard — potentially
        including Shift — becomes permanently unreachable on narrow screens. `mx-auto` on the
        inner block does the same centering when everything fits, but degrades to a normal
        left-aligned, fully-scrollable row when it doesn't.
      */}
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-fit flex-col gap-1.5 sm:gap-2">
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} className={cn("flex gap-1.5 sm:gap-2", ROW_STAGGER[i])}>
              {i === KEYBOARD_ROWS.length - 1 && (
                <button
                  type="button"
                  onClick={() => setTapShiftActive((v) => !v)}
                  aria-pressed={tapShiftActive}
                  className={cn(
                    "flex shrink-0 items-center justify-center gap-1 rounded-lg border-b-[3px] text-[11px] font-bold transition-all duration-100 active:translate-y-[2px] active:border-b sm:text-xs",
                    "h-10 w-14 sm:h-11 sm:w-16 md:h-12 md:w-[4.75rem]",
                    tapShiftActive
                      ? "translate-y-[2px] border-b border-violet-800 bg-violet-500 text-white shadow-inner"
                      : "border-slate-400 bg-gradient-to-b from-white to-slate-100 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:from-violet-50 hover:to-violet-100",
                  )}
                >
                  <ArrowBigUp className="size-4" />
                  <span className="hidden sm:inline">Shift</span>
                </button>
              )}
              {row.map((k) => {
                const mainChar = effectiveShiftActive ? (k.shift ?? k.base ?? "") : (k.base ?? "")
                const cornerChar = effectiveShiftActive ? k.base : k.shift
                // Compare against the currently *displayed* layer, not base-or-shift — a tap
                // always sends mainChar, so highlighting a key whose other layer matches the
                // target would let a tap send the wrong character.
                const isTarget = targetChar != null && mainChar === targetChar

                return (
                  <KeyboardKey
                    key={k.code}
                    mainChar={mainChar}
                    cornerChar={cornerChar}
                    active={activeCode === k.code}
                    isTarget={isTarget}
                    onPress={() => mainChar && onKeyClick?.(mainChar)}
                  />
                )
              })}
            </div>
          ))}
          {/*
            The physical spacebar on this layout doesn't type a space — it's remapped to the
            coeng sign that stacks a subscript consonant (ក្ + រ = ក្រ), which is how virtually
            every multi-consonant Khmer word is built. Without a tile for it, anyone without a
            physical Khmer keyboard (i.e. every touch/mobile player) could never complete such
            a word by tapping.
          */}
          <div className="flex justify-center">
            <KeyboardKey
              mainChar={COENG_SIGN}
              active={activeCode === "Space"}
              isTarget={targetChar === COENG_SIGN}
              onPress={() => onKeyClick?.(COENG_SIGN)}
              spacebar
            />
          </div>
        </div>
      </div>
    </div>
  )
}
