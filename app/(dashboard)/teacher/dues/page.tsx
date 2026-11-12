import { Metadata } from "next"
import { TeacherDuesPage } from "@/features/dashboard/teacher/template/teacherDuesPage"

export const metadata: Metadata = {
  title: "Teacher Dues | Scholar LMS Admin",
  description: "View teacher dues, commission deductions, and net earnings",
}

export default function Page() {
  return <TeacherDuesPage />
}

