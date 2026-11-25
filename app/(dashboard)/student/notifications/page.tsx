"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { StudentNotificationsView } from "@/features/dashboard/student-portal/components/StudentNotificationsView"

export default function StudentNotificationsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Notifications Center"
        description="Stay notified regarding exam schedules, session rooms, assignment marks, and school bulletins."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <StudentNotificationsView />
      </main>
    </div>
  )
}
