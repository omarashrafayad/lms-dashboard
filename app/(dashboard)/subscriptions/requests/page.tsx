import { SubscriptionsMainPage } from "@/features/dashboard/subscriptions/template/SubscriptionsMainPage"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Offline Payment Requests | Subscriptions & Payments | Lumina Learning Admin",
  description: "Review and approve offline wallet and bank transfer receipts from parents.",
}

export default function SubscriptionRequestsRoute() {
  return <SubscriptionsMainPage initialTab="requests" />
}
