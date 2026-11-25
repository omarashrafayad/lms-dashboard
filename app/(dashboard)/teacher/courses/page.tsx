"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherCoursesPage } from "@/features/dashboard/teacher-portal/components/TeacherCoursesPage"

export default function TeacherCoursesRoute() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="My Courses & Curriculum"
        description="Organize your assigned physics & STEM curricula, author chapters, and track student cohort progress."
        actions={
          <Link href="/teacher/content">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-orange hover:bg-brand-orange/90 text-white shadow-2xs transition-all cursor-pointer">
              <Plus className="size-4 stroke-[2.5]" />
              <span>Add Learning Material</span>
            </button>
          </Link>
        }
      />
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <TeacherCoursesPage />
      </main>
    </div>
  )
}
