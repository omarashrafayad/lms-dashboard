import LessonDetailPage from "@/features/dashboard/lesson/template/lessonDetailPage"

export const metadata = {
  title: "Lesson Details | Scholar Admin Console",
  description: "Lesson content, videos, PDF, quiz, access, and history.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <LessonDetailPage lessonId={id} />
}
