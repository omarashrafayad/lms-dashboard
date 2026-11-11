import { Metadata } from "next"
import LessonsListPage from "@/features/dashboard/content-curriculum/template/LessonsListPage"

export const metadata: Metadata = {
  title: "Lessons | LMS Admin Console",
  description: "Manage lesson content, videos, PDFs, quizzes, and student access.",
}

export default function Page() {
  return <LessonsListPage />
}
