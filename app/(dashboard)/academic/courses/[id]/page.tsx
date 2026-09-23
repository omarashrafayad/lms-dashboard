import CourseDetailPage from "@/features/dashboard/course/template/courseDetailPage"

export const metadata = {
  title: "Course Details | Scholar Admin Console",
  description: "Course overview, content lessons, exam, students, and analytics.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <CourseDetailPage courseId={id} />
}
