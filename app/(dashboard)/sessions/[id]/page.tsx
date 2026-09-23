import { Metadata } from "next"
import SessionDetailPage from "@/features/dashboard/session/template/sessionDetailPage"

export const metadata: Metadata = {
  title: "Session Details | Scholar LMS Admin",
  description: "View session details, student and teacher information, booking history, and activity timeline.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <SessionDetailPage sessionId={id} />
}
