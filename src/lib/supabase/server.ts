import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Server-side Supabase client for Server Components, Server Actions, and Route Handlers.
 * Used for Auth only — see the note in lib/supabase/client.ts. Reads/writes the auth cookie via
 * Next.js's cookies() store. The `setAll` call can throw when invoked from a Server Component
 * (which can't set cookies) — safe to ignore there because middleware.ts already refreshes the
 * session on every request.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component — middleware.ts handles session refresh instead.
          }
        },
      },
    },
  )
}
