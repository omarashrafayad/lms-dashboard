import { StudentSubjectLessonView } from "@/features/dashboard/student-portal/components/StudentSubjectLessonView"

interface PageProps {
  params: Promise<{ subjectId: string; lessonId: string }>
}

export default async function StudentSubjectLessonPage({ params }: PageProps) {
  const { subjectId, lessonId } = await params
  return <StudentSubjectLessonView subjectId={subjectId} lessonId={lessonId} />
}
