import { Metadata } from "next"
import { RescheduleRequestsPage } from "@/features/dashboard/session/template/rescheduleRequestsPage"

export const metadata: Metadata = {
  title: "Session Reschedule Requests | Scholar LMS Admin",
  description: "Review and respond to session reschedule requests from students and teachers",
}

export default function Page() {
  return <RescheduleRequestsPage />
}
