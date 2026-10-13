import { SubscriptionsMainPage } from "@/features/dashboard/subscriptions/template/SubscriptionsMainPage"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Subscriptions & Payments | Lumina Learning Admin",
  description: "Manage subscription plans, student enrollments, transaction ledger, and payment approvals.",
}

export default function SubscriptionsPage() {
  return <SubscriptionsMainPage initialTab="overview" />
}
