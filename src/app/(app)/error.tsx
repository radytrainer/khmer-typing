"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-dashed border-destructive/40 bg-destructive/5 p-10 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600">
        <AlertTriangle className="size-7 text-white" />
      </div>
      <h1 className="text-lg font-bold">Something went wrong loading this page</h1>
      <p className="text-sm text-muted-foreground">
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
