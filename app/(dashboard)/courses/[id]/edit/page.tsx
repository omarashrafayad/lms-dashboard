import { Metadata } from "next"
import CourseEditPage from "@/features/dashboard/course/template/courseEditPage"

export const metadata: Metadata = {
  title: "Edit Course | Scholar LMS Admin",
  description: "Update and configure course curriculum, academic mapping, final exam, and settings.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <CourseEditPage courseId={id} />
}
