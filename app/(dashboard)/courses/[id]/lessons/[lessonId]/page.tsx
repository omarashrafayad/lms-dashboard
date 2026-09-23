import { Metadata } from "next"
import CourseLessonViewPage from "@/features/dashboard/course/template/courseLessonViewPage"

export const metadata: Metadata = {
  title: "View Lesson Content | Scholar LMS Admin",
  description: "View and play course lesson materials and resources.",
}

interface PageProps {
  params: Promise<{ id: string; lessonId: string }>
}

export default async function Page({ params }: PageProps) {
  const { id, lessonId } = await params
  return <CourseLessonViewPage courseId={id} lessonId={lessonId} />
}
