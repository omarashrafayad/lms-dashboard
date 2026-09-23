import { Metadata } from "next"
import SessionSchedulePage from "@/features/dashboard/session/template/sessionSchedulePage"

export const metadata: Metadata = {
  title: "Schedule Session | Scholar LMS Admin",
  description: "Schedule a new 1:1 or group learning session with student and teacher selection.",
}

export default function Page() {
  return <SessionSchedulePage />
}
