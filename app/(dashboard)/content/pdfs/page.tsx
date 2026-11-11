import { Metadata } from "next"
import PdfsListPage from "@/features/dashboard/content-curriculum/template/PdfsListPage"

export const metadata: Metadata = {
  title: "PDF Documents & Books | LMS Admin",
  description: "Manage PDF documents, books, and lesson file attachments.",
}

export default function PdfsPage() {
  return <PdfsListPage />
}

