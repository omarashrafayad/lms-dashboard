import { Metadata } from "next"
import { SupportMainPage } from "@/features/dashboard/support/template/SupportMainPage"

export const metadata: Metadata = {
  title: "Support & Help Center | LMS Dashboard",
  description: "Manage institutional support inquiries, browse troubleshooting guides, and verify cloud infrastructure health.",
}

export default function SupportPage() {
  return <SupportMainPage />
}
