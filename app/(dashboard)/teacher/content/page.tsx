"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherContentPage } from "@/features/dashboard/teacher-portal/components/TeacherContentPage"

export default function TeacherContentRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Content & Media Studio"
        description="Upload and publish video lectures, formula sheets, interactive simulations, and PDF learning materials."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherContentPage />
      </main>
    </div>
  )
}
