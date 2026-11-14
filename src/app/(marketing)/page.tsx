import { HeroSection } from "@/components/marketing/hero-section"
import { FeaturesSection } from "@/components/marketing/features-section"
import { GamePreviewSection } from "@/components/marketing/game-preview-section"
import { LeaderboardPreviewSection } from "@/components/marketing/leaderboard-preview-section"
import { StatsSection } from "@/components/marketing/stats-section"
import { TestimonialsSection } from "@/components/marketing/testimonials-section"

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <GamePreviewSection />
      <FeaturesSection />
      <LeaderboardPreviewSection />
      <TestimonialsSection />
    </>
  )
}
