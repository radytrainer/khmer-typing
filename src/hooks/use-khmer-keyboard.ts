"use client"

import { useEffect, useState } from "react"

export interface KhmerKeyPress {
  /** The character the browser reports for this keydown (whatever the OS's active IME produced). */
  char: string
  code: string
  shiftKey: boolean
}

interface UseKhmerKeyboardOptions {
  /** Called on every keydown for a printable character — games use this to check correctness. */
  onKeyPress?: (press: KhmerKeyPress) => void
  /** Set to false to stop listening (e.g. while a modal is open). */
  enabled?: boolean
}

/**
 * Tracks live keyboard state for the on-screen Khmer keyboard: which physical key is currently
 * held down, and whether Shift/CapsLock are active. Does NOT attempt to translate physical keys
 * to Khmer characters itself — it trusts `event.key`, which is whatever the OS's active Khmer
 * keyboard layout already produced. That's what makes this work for any user's real IME, not
 * just the one layout documented in data/khmer/keyboard-layout.ts (which exists purely to draw
 * the on-screen reference keyboard).
 */
export function useKhmerKeyboard({ onKeyPress, enabled = true }: UseKhmerKeyboardOptions = {}) {
  const [activeCode, setActiveCode] = useState<string | null>(null)
  const [shiftHeld, setShiftHeld] = useState(false)
  const [capsLock, setCapsLock] = useState(false)

  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Shift") setShiftHeld(true)
      setActiveCode(e.code)
      if (typeof e.getModifierState === "function") {
        setCapsLock(e.getModifierState("CapsLock"))
      }

      // Ignore modifier/navigation keys — only forward printable characters to the game.
      if (e.key.length === 1 || e.key === " ") {
        onKeyPress?.({ char: e.key, code: e.code, shiftKey: e.shiftKey })
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "Shift") setShiftHeld(false)
      setActiveCode((current) => (current === e.code ? null : current))
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [enabled, onKeyPress])

  const shiftActive = shiftHeld !== capsLock // XOR: CapsLock toggles the shift layer, holding Shift temporarily flips it back

  return { activeCode, shiftActive, capsLock }
}
