import { Metadata } from "next"
import GradesPage from "@/features/dashboard/reference-data/template/GradesPage"

export const metadata: Metadata = {
  title: "Grades | Scholar Admin Console",
  description: "Manage grade levels linked to academic stages.",
}

export default function Page() {
  return <GradesPage />
}
