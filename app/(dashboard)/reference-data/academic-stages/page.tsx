import { Metadata } from "next"
import AcademicStagesPage from "@/features/dashboard/reference-data/template/AcademicStagesPage"

export const metadata: Metadata = {
  title: "Academic Stages | Scholar Admin Console",
  description: "Manage system academic stages and educational phases.",
}

export default function Page() {
  return <AcademicStagesPage />
}
