import { StudentCourseLessonView } from "@/features/dashboard/student-portal/components/StudentCourseLessonView"

interface PageProps {
  params: Promise<{ courseId: string; lessonId: string }>
}

export default async function StudentCourseLessonPage({ params }: PageProps) {
  const { courseId, lessonId } = await params
  return <StudentCourseLessonView courseId={courseId} lessonId={lessonId} />
}
