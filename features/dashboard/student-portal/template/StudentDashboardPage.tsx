"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { StudentOverviewContent } from "../components/StudentOverviewContent"

export default function StudentDashboardPage() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Student Overview"
        description="Your academic summary, subjects, featured courses, upcoming exams, and faculty highlights."
      />

      <main className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl w-full mx-auto pb-16">
        <StudentOverviewContent />
      </main>
    </div>
  )
}

export { StudentDashboardPage }
