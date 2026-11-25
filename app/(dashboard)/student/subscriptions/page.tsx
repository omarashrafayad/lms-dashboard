"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { StudentSubscriptionsView } from "@/features/dashboard/student-portal/components/StudentSubscriptionsView"

export default function StudentSubscriptionsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Subscription & Plans"
        description="Manage your learning tier, explore package features, apply coupons, and download invoices."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <StudentSubscriptionsView />
      </main>
    </div>
  )
}
