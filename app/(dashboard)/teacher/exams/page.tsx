"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherExamsPage } from "@/features/dashboard/teacher-portal/components/TeacherExamsPage"

export default function TeacherExamsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Exams & Assessment Center"
        description="Author standardized midterm exams, formative quizzes, question pools, and inspect grading performance."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherExamsPage />
      </main>
    </div>
  )
}
