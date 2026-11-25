"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { StudentSubjectsView } from "@/features/dashboard/student-portal/components/StudentSubjectsView"

export default function StudentSubjectsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="My Subjects"
        description="Explore enrolled secondary curriculum subjects, terms, and educational stages."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <StudentSubjectsView />
      </main>
    </div>
  )
}
