import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username must be at most 20 characters.")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    // Admin accounts are provisioned separately (see supabase/README) — self-registration is
    // limited to the two roles a student or teacher would plausibly sign themselves up for.
    role: z.enum(["student", "teacher"], { message: "Select a role." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>
