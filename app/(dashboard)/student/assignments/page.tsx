"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { StudentAssignmentsView } from "@/features/dashboard/student-portal/components/StudentAssignmentsView"

export default function StudentAssignmentsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Assignments & Homework"
        description="Coursework problem sets, essay submissions, file attachments, and teacher feedback."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <StudentAssignmentsView />
      </main>
    </div>
  )
}
