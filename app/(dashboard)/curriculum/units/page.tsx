import { Metadata } from "next"
import UnitsListPage from "@/features/dashboard/content-curriculum/template/UnitsListPage"

export const metadata: Metadata = {
  title: "Curriculum Units | LMS Admin",
  description: "Manage learning units, chapter structures, and module sequences.",
}

export default function UnitsPage() {
  return <UnitsListPage />
}

