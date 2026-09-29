import { Metadata } from "next"
import EducationSystemsPage from "@/features/dashboard/reference-data/template/EducationSystemsPage"

export const metadata: Metadata = {
  title: "Education Systems | Scholar Admin Console",
  description: "Manage curricula and education systems.",
}

export default function Page() {
  return <EducationSystemsPage />
}
