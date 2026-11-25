"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherProfilePage } from "@/features/dashboard/teacher-portal/components/TeacherProfilePage"

export default function TeacherProfileRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Teacher Profile & Operational Settings"
        description="Manage your academic credentials, qualifications, weekly live availability schedule, and account security."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherProfilePage />
      </main>
    </div>
  )
}
