"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { CourseMetricsCards } from "../components/list/CourseMetricsCards"
import { CourseFilters } from "../components/list/CourseFilters"
import { CourseTable } from "../components/list/CourseTable"
import { useCourses } from "../hooks/useCourses"
import { CourseFilterState } from "../types/course.types"
import { toast } from "sonner"

export default function CourseListPage() {
  const router = useRouter()
  const [filters, setFilters] = React.useState<CourseFilterState>({
    search: "",
    stage: "all",
    year: "all",
    system: "all",
    term: "all",
    subject: "all",
    status: "all",
  })

  const { data: courses = [], isLoading } = useCourses(filters)

  const handleFilterChange = (key: keyof CourseFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      search: "",
      stage: "all",
      year: "all",
      system: "all",
      term: "all",
      subject: "all",
      status: "all",
    })
  }

  // Calculate counts for metric cards based on all courses
  const totalCount = courses.length
  const publishedCount = courses.filter((c) => c.status === "Published").length
  const draftCount = courses.filter((c) => c.status === "Draft").length
  const archivedCount = courses.filter((c) => c.status === "Archived").length

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Page Header matching Image 1 */}
      <PageHeader
        title="Courses"
        description="Manage learning programs, organize course content, and control student access."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20">
        {/* Header Action Row matching Image 1 */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">
            Showing <strong className="font-bold text-zinc-800">{totalCount}</strong> courses
          </span>

          <Link
            href="/courses/add"
            className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Course</span>
          </Link>
        </div>

        {/* 4 Metrics Cards matching Image 1 */}
        <CourseMetricsCards
          total={totalCount}
          published={publishedCount}
          draft={draftCount}
          archived={archivedCount}
        />

        {/* Filter Bar matching Image 1 */}
        <CourseFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Courses Table matching Image 1 */}
        <CourseTable courses={courses} isLoading={isLoading} />
      </main>
    </div>
  )
}
