import ExamPreviewPage from "@/features/dashboard/exam/template/examPreviewPage"

export const metadata = {
  title: "Exam Preview | Lumina Learning Admin",
  description: "Student read-only preview mode for exam.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <ExamPreviewPage id={id} />
}
