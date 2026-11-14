"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.89c2.28-2.1 3.53-5.19 3.53-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.89-3c-1.08.73-2.46 1.16-4.04 1.16-3.1 0-5.73-2.09-6.67-4.9H1.32v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.33 14.35a7.2 7.2 0 0 1 0-4.7V6.56H1.32a12 12 0 0 0 0 10.88l4.01-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.32 6.56l4.01 3.09C6.27 6.84 8.9 4.75 12 4.75Z"
      />
    </svg>
  )
}

export function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setIsLoading(false)
    }
    // On success, Supabase redirects the browser to Google — no further action needed here.
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full rounded-xl"
      size="lg"
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <GoogleIcon />}
      Continue with Google
    </Button>
  )
}
