import ExamDetailPage from "@/features/dashboard/exam/template/examDetailPage"

export const metadata = {
  title: "Exam Details | Lumina Learning Admin",
  description: "View and manage exam details, questions, results, analytics, and history.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <ExamDetailPage id={id} />
}
