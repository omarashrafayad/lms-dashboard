import { Metadata } from "next"
import RolesListPage from "@/features/dashboard/roles/template/rolesListPage"

export const metadata: Metadata = {
  title: "Roles & Permissions | LMS Admin",
  description: "Manage system access roles, granular permission matrices, and security policies.",
}

export default function RolesPage() {
  return <RolesListPage />
}

