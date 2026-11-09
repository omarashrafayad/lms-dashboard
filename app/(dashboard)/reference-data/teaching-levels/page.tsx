import { Metadata } from "next"
import TeachingLevelsPage from "@/features/dashboard/reference-data/template/TeachingLevelsPage"

export const metadata: Metadata = {
  title: "Teaching Levels | LMS Admin",
  description: "Configure and manage teacher specialization and teaching levels.",
}

export default function TeachingLevelsRoute() {
  return <TeachingLevelsPage />
}

