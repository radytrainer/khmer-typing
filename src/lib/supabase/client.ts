"use client"

import { createBrowserClient } from "@supabase/ssr"

/**
 * Browser-side Supabase client — safe to call from Client Components.
 * Used for Auth only (sign in/up/out, OAuth, session reads); all application data goes through
 * Prisma (see src/lib/prisma.ts), so there's no generated `Database` type to keep in sync here.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
