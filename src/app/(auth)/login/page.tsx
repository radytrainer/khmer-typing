import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Log in — Khmer Typing",
}

export default function LoginPage() {
  return <LoginForm />
}
