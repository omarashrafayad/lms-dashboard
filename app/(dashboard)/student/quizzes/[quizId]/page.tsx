import * as React from "react"
import { StudentQuizPlayerView } from "@/features/dashboard/student-portal/components/StudentQuizPlayerView"

interface PageProps {
  params: Promise<{ quizId: string }>
}

export default async function StudentQuizPage({ params }: PageProps) {
  const { quizId } = await params
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-zinc-500">Loading quiz...</div>}>
      <StudentQuizPlayerView quizId={quizId} />
    </React.Suspense>
  )
}
