import { SubscriptionsMainPage } from "@/features/dashboard/subscriptions/template/SubscriptionsMainPage"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transactions & Invoices | Subscriptions & Payments | Lumina Learning Admin",
  description: "View financial payment ledger, digital tax receipts, and payment method audit.",
}

export default function SubscriptionTransactionsRoute() {
  return <SubscriptionsMainPage initialTab="transactions" />
}
