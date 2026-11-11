import { Metadata } from "next"
import ChaptersListPage from "@/features/dashboard/content-curriculum/template/ChaptersListPage"

export const metadata: Metadata = {
  title: "Curriculum Chapters | LMS Admin",
  description: "Manage subject chapters and modular syllabus sequence.",
}

export default function ChaptersPage() {
  return <ChaptersListPage />
}

