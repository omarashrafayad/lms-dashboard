import CurriculumLessonPage from "@/features/dashboard/curriculum/template/curriculumLessonPage"

export const metadata = {
  title: "Lesson Details | Scholar Admin Console",
  description: "Lesson content, videos, PDF, quiz, access, and history.",
}

interface PageProps {
  params: Promise<{ subjectId: string; lessonId: string }>
}

export default async function Page({ params }: PageProps) {
  const { subjectId, lessonId } = await params
  return <CurriculumLessonPage subjectId={subjectId} lessonId={lessonId} />
}
