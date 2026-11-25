"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { StudentExamsView } from "@/features/dashboard/student-portal/components/StudentExamsView"

export default function StudentExamsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Exams & Quizzes"
        description="Official examinations center, live question answering, and performance breakdown."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <StudentExamsView />
      </main>
    </div>
  )
}
