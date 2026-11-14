import { ShoppingBag } from "lucide-react"
import { requireProfile } from "@/features/auth/guards"
import { ComingSoon } from "@/components/dashboard/coming-soon"

export default async function ShopPage() {
  const profile = await requireProfile()

  return (
    <ComingSoon
      icon={ShoppingBag}
      title="Shop is coming next"
      description={`You've got ${profile.coins.toLocaleString()} coins waiting — themes, car skins, avatar frames, and keyboard styles will be spendable here once the Shop ships.`}
    />
  )
}
