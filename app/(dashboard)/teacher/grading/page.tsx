"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherGradingPage } from "@/features/dashboard/teacher-portal/components/TeacherGradingPage"

export default function TeacherGradingRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Grading & Evaluation Workspace"
        description="Centralized queue for evaluating student essay exams, laboratory assignments, and releasing rubric feedback."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherGradingPage />
      </main>
    </div>
  )
}
