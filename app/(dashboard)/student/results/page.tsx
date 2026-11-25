"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { StudentResultsView } from "@/features/dashboard/student-portal/components/StudentResultsView"

export default function StudentResultsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="My Results & Performance"
        description="Official grades, historical exam results, subject-wise analytics, and transcript."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <StudentResultsView />
      </main>
    </div>
  )
}
