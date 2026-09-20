import TeacherDetailPage from "@/features/dashboard/teacher/template/teacherDetailPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <TeacherDetailPage teacherId={id} />
}
