import { Metadata } from "next"
import ReferenceDataHubPage from "@/features/dashboard/reference-data/template/ReferenceDataHubPage"

export const metadata: Metadata = {
  title: "Reference Data | Scholar Admin Console",
  description:
    "Manage system reference data, academic stages, education systems, grades, and genders.",
}

export default function Page() {
  return <ReferenceDataHubPage />
}
