import * as React from "react"
import { StudentSubjectDetailView } from "@/features/dashboard/student-portal/components/StudentSubjectDetailView"

interface PageProps {
  params: Promise<{ subjectId: string }>
}

export default async function StudentSubjectDetailPage({ params }: PageProps) {
  const { subjectId } = await params
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-zinc-500">Loading subject...</div>}>
      <StudentSubjectDetailView subjectId={subjectId} />
    </React.Suspense>
  )
}
