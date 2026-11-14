"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { AuthError } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "./schemas"

export interface AuthActionState {
  error?: string
  message?: string
}

/**
 * Maps a Supabase AuthError to user-facing copy. Only errors we can attribute to something the
 * user actually did wrong get a specific message — everything else (misconfigured project,
 * network failure, rate limiting, an unrecognized error code) gets a generic "try again" message
 * instead of confidently blaming the user's password when the real cause might be our own setup.
 */
function describeAuthError(error: AuthError, action: string): string {
  switch (error.code) {
    case "invalid_credentials":
      return "Incorrect email or password."
    case "email_not_confirmed":
      return "Please confirm your email address before logging in — check your inbox."
    case "user_already_exists":
    case "email_exists":
      return "An account with this email already exists."
    case "email_address_invalid":
      return "Please enter a valid email address."
    case "weak_password":
      return "Choose a stronger password."
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many attempts — please wait a moment and try again."
    default:
      console.error(`Auth error while trying to ${action}:`, error)
      return `Something went wrong trying to ${action}. Please try again in a moment.`
  }
}

export async function loginAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const raw: LoginInput = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: describeAuthError(error, "sign in") }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function registerAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const raw: RegisterInput = {
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    role: (formData.get("role") as "student" | "teacher") ?? "student",
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.username,
        role: parsed.data.role,
      },
    },
  })

  if (error) {
    return { error: describeAuthError(error, "create your account") }
  }

  // If the Supabase project requires email confirmation, signUp succeeds but returns no
  // session — there's no one to redirect yet, so ask the student/teacher to check their inbox.
  if (!data.session) {
    return { message: "Account created! Check your email to confirm before logging in." }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
