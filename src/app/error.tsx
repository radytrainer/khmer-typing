"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-10 text-center dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600">
        <AlertTriangle className="size-7 text-white" />
      </div>
      <h1 className="text-lg font-bold">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        This usually means the server couldn&apos;t reach the database. If you&apos;re the
        developer, check the server logs — the digest below points at the exact error.
      </p>
      {error.digest && (
        <code className="rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground">
          Digest: {error.digest}
        </code>
      )}
      <Button onClick={() => reset()} className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 font-bold">
        <RotateCw className="mr-1 size-4" /> Try again
      </Button>
    </div>
  )
}
