import { Metadata } from "next"
import SessionListPage from "@/features/dashboard/session/template/sessionListPage"

export const metadata: Metadata = {
  title: "All Sessions | Scholar LMS Admin",
  description: "Manage scheduled sessions, monitor session status, and view student, teacher, booking, and payment details.",
}

export default function Page() {
  return <SessionListPage />
}
