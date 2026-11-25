"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherAssignmentsPage } from "@/features/dashboard/teacher-portal/components/TeacherAssignmentsPage"

export default function TeacherAssignmentsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Assignments & Homework Management"
        description="Create homework tasks, manage problem set deadlines, review student submissions, and release grades."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherAssignmentsPage />
      </main>
    </div>
  )
}
