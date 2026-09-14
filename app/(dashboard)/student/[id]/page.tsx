import StudentDetailPage from "@/features/student/template/studentDetailPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <StudentDetailPage studentId={id} />
}
