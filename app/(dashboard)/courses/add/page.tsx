import { Metadata } from "next"
import CourseAddPage from "@/features/dashboard/course/template/courseAddPage"

export const metadata: Metadata = {
  title: "Add Course | Scholar LMS Admin",
  description: "Create and publish a new academic course with curriculum, lessons, exams, and settings.",
}

export default function Page() {
  return <CourseAddPage />
}
