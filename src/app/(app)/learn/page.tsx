import { BookOpen } from "lucide-react"
import { requireProfile } from "@/features/auth/guards"
import { ComingSoon } from "@/components/dashboard/coming-soon"

export default async function LearnPage() {
  await requireProfile()

  return (
    <ComingSoon
      icon={BookOpen}
      title="Learning Mode is coming next"
      description="Structured lessons from alphabet drills through dependent vowels, numbers, words, sentences, and full stories — building on the same letter/word dictionaries that already power Falling Letters."
    />
  )
}
