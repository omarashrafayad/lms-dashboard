import { Metadata } from "next"
import SessionEditPage from "@/features/dashboard/session/template/sessionEditPage"

export const metadata: Metadata = {
  title: "Edit Session | Scholar LMS Admin",
  description: "Update scheduled session details, teacher, timing, duration, and notes.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <SessionEditPage sessionId={id} />
}
