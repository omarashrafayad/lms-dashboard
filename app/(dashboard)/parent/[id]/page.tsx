import ParentDetailPage from "@/features/dashboard/parent/template/parentDetailPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <ParentDetailPage parentId={id} />
}
