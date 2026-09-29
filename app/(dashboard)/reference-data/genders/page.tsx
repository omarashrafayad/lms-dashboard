import { Metadata } from "next"
import GendersPage from "@/features/dashboard/reference-data/template/GendersPage"

export const metadata: Metadata = {
  title: "Genders | Scholar Admin Console",
  description: "Manage genders used across the platform.",
}

export default function Page() {
  return <GendersPage />
}
