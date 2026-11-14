"use client"

import { startTransition, useActionState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

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
import { loginAction, type AuthActionState } from "@/features/auth/actions"
import { loginSchema, type LoginInput } from "@/features/auth/schemas"
import { GoogleAuthButton } from "./google-auth-button"

const initialState: AuthActionState = {}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: LoginInput) {
    const formData = new FormData()
    formData.append("email", values.email)
    formData.append("password", values.password)
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
          Welcome back!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log in to keep your typing streak alive.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                    <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {state.error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-base font-bold hover:opacity-90"
              size="lg"
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Log in
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
          New here?{" "}
          <a href="/register" className="font-semibold text-violet-600 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </motion.div>
  )
}
