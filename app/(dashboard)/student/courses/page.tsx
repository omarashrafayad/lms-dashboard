"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { StudentCoursesView } from "@/features/dashboard/student-portal/components/StudentCoursesView"

export default function StudentCoursesPage() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="My Courses"
        description="Browse enrolled secondary school subjects, track unit progression, and view video lectures."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <StudentCoursesView />
      </main>
    </div>
  )
}
