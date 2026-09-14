import StudentEditPage from "@/features/student/template/studentEditPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <StudentEditPage studentId={id} />
}
