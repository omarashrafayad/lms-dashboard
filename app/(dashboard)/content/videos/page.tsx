import { Metadata } from "next"
import VideosListPage from "@/features/dashboard/content-curriculum/template/VideosListPage"

export const metadata: Metadata = {
  title: "Educational Videos | LMS Admin",
  description: "Manage uploaded instructional videos and lesson streaming media.",
}

export default function VideosPage() {
  return <VideosListPage />
}

