import { cn } from "@/lib/utils"
import { INVISIBLE_KEY_LABELS } from "@/data/khmer/keyboard-layout"

interface KeyboardKeyProps {
  mainChar: string
  cornerChar?: string
  active: boolean
  isTarget: boolean
  onPress?: () => void
  /** Widens the key (used for Shift) instead of the standard square size. */
  wide?: boolean
  /** Full-row-width spacebar style (used for the coeng/subscript key). */
  spacebar?: boolean
}

function displayChar(char: string) {
  return INVISIBLE_KEY_LABELS[char] ?? char
}

// Keycaps stay light in both light and dark app themes, on purpose — a physical keyboard
// doesn't re-skin itself for dark mode, and light keys are what read as "a keyboard" against
// the dark deck. Depth comes from a bright top inset (glossy keycap highlight) plus a solid
// bottom border (the shadow edge), not from color alone.
export function KeyboardKey({ mainChar, cornerChar, active, isTarget, onPress, wide, spacebar }: KeyboardKeyProps) {
  const label = displayChar(mainChar)
  // A handful of keys (ZWNJ/ZWJ/ZWSP) show a text abbreviation instead of a single Khmer glyph
  // because their actual character is invisible — those need a much smaller face to fit the
  // same key footprint without spilling past its rounded corners.
  const isTextLabel = label.length > 1

  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(
        "font-khmer relative flex shrink-0 select-none flex-col items-center justify-center overflow-hidden rounded-lg border-b-[3px] font-bold transition-all duration-100 active:translate-y-[2px] active:border-b",
        spacebar
          ? "h-10 w-40 sm:h-11 sm:w-56 md:h-12 md:w-72"
          : cn("size-10 sm:size-11 md:size-12", wide && "w-16 sm:w-[4.75rem] md:w-20"),
        active
          ? "translate-y-[2px] border-b border-violet-800 bg-violet-500 text-white shadow-inner"
          : isTarget
            ? "animate-pulse border-emerald-600 bg-emerald-400 text-emerald-950 shadow-[0_0_0_4px_rgba(52,211,153,0.35),0_0_18px_rgba(52,211,153,0.55)]"
            : cn(
                "border-slate-400 bg-gradient-to-b from-white to-slate-100 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:from-violet-50 hover:to-violet-100",
                // Invisible-character keys (ZWNJ/ZWJ/ZWSP) are never a real typing target — mute
                // them so the letters students actually need to learn keep visual priority.
                isTextLabel && "border-slate-300 from-slate-50 to-slate-100 text-slate-400 opacity-70",
              ),
      )}
    >
      {cornerChar && (
        <span
          className={cn(
            "absolute top-0.5 right-1 max-w-[40%] truncate text-[8px] leading-none font-semibold sm:text-[9px]",
            active || isTarget ? "text-white/75" : "text-slate-400",
          )}
        >
          {displayChar(cornerChar)}
        </span>
      )}
      <span
        className={cn(
          "px-0.5 leading-none",
          isTextLabel ? "text-[9px] tracking-tight sm:text-[10px]" : "text-[15px] sm:text-base md:text-lg",
        )}
      >
        {label}
      </span>
    </button>
  )
}
