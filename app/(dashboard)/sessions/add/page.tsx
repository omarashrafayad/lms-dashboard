import { Metadata } from "next"
import SessionSchedulePage from "@/features/dashboard/session/template/sessionSchedulePage"

export const metadata: Metadata = {
  title: "Schedule Session | Scholar LMS Admin",
}

export default function Page() {
  return <SessionSchedulePage />
}
