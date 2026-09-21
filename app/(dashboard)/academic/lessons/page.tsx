import LessonListPage from "@/features/dashboard/lesson/template/lessonListPage"

export const metadata = {
  title: "Lessons | Scholar Admin Console",
  description:
    "Manage lesson content, videos, PDFs, quizzes, and student access.",
}

export default function Page() {
  return <LessonListPage />
}
