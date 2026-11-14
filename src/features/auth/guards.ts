import { redirect } from "next/navigation"
import type { Role } from "@prisma/client"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/**
 * Resolves the signed-in user's profile using Prisma (server-only — this connection is a trusted
 * Postgres role and bypasses RLS by design, so every function here MUST scope queries to the
 * authenticated user's id itself; never let a caller pass an arbitrary id into these helpers).
 */
export async function getCurrentProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return prisma.profile.findUnique({ where: { id: user.id } })
}

export async function requireProfile() {
  const profile = await getCurrentProfile()
  if (!profile) {
    redirect("/login")
  }
  return profile
}

export async function requireRole(allowedRoles: Role[]) {
  const profile = await requireProfile()
  if (!allowedRoles.includes(profile.role)) {
    redirect("/dashboard")
  }
  return profile
}
