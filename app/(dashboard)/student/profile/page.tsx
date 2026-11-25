"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { StudentProfileView } from "@/features/dashboard/student-portal/components/StudentProfileView"

export default function StudentProfileRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Student Profile & Settings"
        description="Personal student information, official enrollment data, security passwords, and preferences."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <StudentProfileView />
      </main>
    </div>
  )
}
