"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherSessionsPage } from "@/features/dashboard/teacher-portal/components/TeacherSessionsPage"

export default function TeacherSessionsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Live Sessions & Webinars"
        description="Schedule live interactive clinics, launch Google Meet / Zoom virtual rooms, and log attendance."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherSessionsPage />
      </main>
    </div>
  )
}
