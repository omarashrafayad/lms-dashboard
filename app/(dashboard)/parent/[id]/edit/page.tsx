import ParentEditPage from "@/features/parent/template/parentEditPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <ParentEditPage parentId={id} />
}
