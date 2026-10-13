import { SubscriptionsMainPage } from "@/features/dashboard/subscriptions/template/SubscriptionsMainPage"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing Plans | Subscriptions & Payments | Lumina Learning Admin",
  description: "Configure curriculum pricing tiers, access limits, and student subscription packages.",
}

export default function SubscriptionPlansRoute() {
  return <SubscriptionsMainPage initialTab="plans" />
}
