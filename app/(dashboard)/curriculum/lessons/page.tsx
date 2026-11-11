import { Metadata } from "next"
import LessonsListPage from "@/features/dashboard/content-curriculum/template/LessonsListPage"

export const metadata: Metadata = {
  title: "Curriculum Lessons | LMS Admin",
  description: "Manage curriculum lessons, durations, access permissions, and video links.",
}

export default function LessonsPage() {
  return <LessonsListPage />
}

