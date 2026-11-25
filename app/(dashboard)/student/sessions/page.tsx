"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { StudentSessionsView } from "@/features/dashboard/student-portal/components/StudentSessionsView"

export default function StudentSessionsRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="My Sessions"
        description="Schedule, live webinar rooms, recorded lectures, and classroom agenda."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <StudentSessionsView />
      </main>
    </div>
  )
}
