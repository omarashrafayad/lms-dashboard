import TeacherEditPage from "@/features/teacher/template/teacherEditPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <TeacherEditPage teacherId={id} />
}
