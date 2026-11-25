"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { StudentCertificatesView } from "@/features/dashboard/student-portal/components/StudentCertificatesView"

export default function StudentCertificatesRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Earned Certificates"
        description="Official accredited diplomas and certificates of curriculum completion."
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <StudentCertificatesView />
      </main>
    </div>
  )
}
