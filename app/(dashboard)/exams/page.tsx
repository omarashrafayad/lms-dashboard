import ExamListPage from "@/features/dashboard/exam/template/examListPage"

export const metadata = {
  title: "Exams | Lumina Learning Admin",
  description:
    "Manage monthly, subject, and course exams, including questions, duration, access, and student results.",
}

export default function Page() {
  return <ExamListPage />
}
