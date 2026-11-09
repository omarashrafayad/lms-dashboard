import { Metadata } from "next"
import TermsPage from "@/features/dashboard/reference-data/template/TermsPage"

export const metadata: Metadata = {
  title: "Academic Terms | LMS Admin",
  description: "Configure and manage academic semester terms.",
}

export default function TermsRoute() {
  return <TermsPage />
}

