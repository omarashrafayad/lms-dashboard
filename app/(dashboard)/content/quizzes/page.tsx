import { Metadata } from "next"
import QuizzesListPage from "@/features/dashboard/content-curriculum/template/QuizzesListPage"

export const metadata: Metadata = {
  title: "Quizzes & Assessments | LMS Admin",
  description: "Manage assessment quizzes, questions, and passing thresholds.",
}

export default function QuizzesPage() {
  return <QuizzesListPage />
}

