import CurriculumStructurePage from "@/features/dashboard/curriculum/template/curriculumStructurePage"

export const metadata = {
  title: "Subject Structure | Scholar Admin Console",
  description: "Curriculum chapters, units, and lessons structure.",
}

interface PageProps {
  params: Promise<{ subjectId: string }>
}

export default async function Page({ params }: PageProps) {
  const { subjectId } = await params
  return <CurriculumStructurePage subjectId={subjectId} />
}
