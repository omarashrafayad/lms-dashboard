"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherAnalyticsPage } from "@/features/dashboard/teacher-portal/components/TeacherAnalyticsPage"

export default function TeacherAnalyticsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Curriculum & Performance Analytics"
        description="Track student retention, lesson completion rates, score distributions, and identify curriculum drop-off spots."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherAnalyticsPage />
      </main>
    </div>
  )
}
