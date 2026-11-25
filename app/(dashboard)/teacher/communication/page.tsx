"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherCommunicationPage } from "@/features/dashboard/teacher-portal/components/TeacherCommunicationPage"

export default function TeacherCommunicationRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Communication & Support Hub"
        description="Answer student lesson inquiries, broadcast course announcements, moderate discussions, and chat directly."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherCommunicationPage />
      </main>
    </div>
  )
}
