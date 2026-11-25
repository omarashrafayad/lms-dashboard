"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherEarningsPage } from "@/features/dashboard/teacher-portal/components/TeacherEarningsPage"

export default function TeacherEarningsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Financial Center & Teacher Earnings"
        description="Review course enrollment revenues, your 70% net commission payouts, and request direct bank or InstaPay transfers."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherEarningsPage />
      </main>
    </div>
  )
}
