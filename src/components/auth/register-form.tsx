"use client"

import { startTransition, useActionState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, GraduationCap, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { registerAction, type AuthActionState } from "@/features/auth/actions"
import { registerSchema, type RegisterInput } from "@/features/auth/schemas"
import { GoogleAuthButton } from "./google-auth-button"

const initialState: AuthActionState = {}

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "", role: "student" },
  })

  function onSubmit(values: RegisterInput) {
    const formData = new FormData()
    formData.append("username", values.username)
    formData.append("email", values.email)
    formData.append("password", values.password)
    formData.append("confirmPassword", values.confirmPassword)
    formData.append("role", values.role)
    // useActionState's dispatch must run inside a transition when called imperatively (rather
    // than via a <form action={...}> prop) — otherwise isPending never flips true/false correctly.
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:bg-slate-900/60">
        <h1 className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-3xl font-extrabold text-transparent">
          Start your journey
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a free account and level up your Khmer typing.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am a</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { value: "student", label: "Student", icon: GraduationCap },
                        { value: "teacher", label: "Teacher", icon: User },
                      ] as const
                    ).map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-colors",
                          field.value === value
                            ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/40"
                            : "border-border text-muted-foreground hover:border-violet-300",
                        )}
                      >
                        <Icon className="size-5" />
                        <span className="text-sm font-semibold">{label}</span>
                      </button>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="khmer_champion" autoComplete="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {state.error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
            )}
            {state.message && (
              <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
                {state.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-base font-bold hover:opacity-90"
              size="lg"
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create account
            </Button>
          </form>
        </Form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <GoogleAuthButton />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-violet-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </motion.div>
  )
}
