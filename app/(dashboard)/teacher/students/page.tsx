"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherStudentsPage } from "@/features/dashboard/teacher-portal/components/TeacherStudentsPage"

export default function TeacherStudentsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="My Students & Academic Roster"
        description="Track student attendance records, exam performance trajectories, and identify at-risk learners early."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherStudentsPage />
      </main>
    </div>
  )
}
