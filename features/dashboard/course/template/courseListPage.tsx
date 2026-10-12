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
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

const initialFilters: CourseFilterState = {
  search: "",
  category: "all",
  level: "all",
  duration: "all",
  status: "all",
}

export default function CourseListPage() {
  const router = useRouter()
  const [filters, setFilters] = React.useState<CourseFilterState>(initialFilters)

  const { data: apiCourses, isLoading, isError } = useCourses()

  const handleFilterChange = (key: keyof CourseFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
  }

  const filteredCourses = React.useMemo(() => {
    if (!apiCourses || !Array.isArray(apiCourses)) return []
    return apiCourses.filter((course) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const name = (course.name || course.title || "").toLowerCase()
        const instructor = (course.leadInstructor || course.instructor || "").toLowerCase()
        const category = (course.category || "").toLowerCase()
        if (!name.includes(query) && !instructor.includes(query) && !category.includes(query)) {
          return false
        }
      }

      if (filters.category !== "all" && course.category?.toLowerCase() !== filters.category.toLowerCase()) {
        return false
      }

      if (filters.level !== "all") {
        const level = (course.difficultyLevel || course.level || "").toLowerCase()
        if (level !== filters.level.toLowerCase()) {
          return false
        }
      }

      if (filters.status !== "all") {
        const status = (course.status || "").toLowerCase()
        if (status !== filters.status.toLowerCase()) {
          return false
        }
      }

      return true
    })
  }, [apiCourses, filters])

  const totalCount = filteredCourses.length
  const publishedCount = filteredCourses.filter(
    (c) => c.status?.toLowerCase() === "published" || c.status?.toLowerCase() === "active"
  ).length
  const draftCount = filteredCourses.filter((c) => c.status?.toLowerCase() === "draft").length
  const archivedCount = filteredCourses.filter(
    (c) => c.status?.toLowerCase() === "archived" || c.status?.toLowerCase() === "inactive"
  ).length

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Courses"
        description="Manage learning programs, organize course content, and control student access."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">
            Showing <strong className="font-bold text-zinc-800">{totalCount}</strong> courses
          </span>

          <Link
            href="/courses/add"
            className="h-10 px-5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Course</span>
          </Link>
        </div>

        <CourseMetricsCards
          total={totalCount}
          published={publishedCount}
          draft={draftCount}
          archived={archivedCount}
        />

        <CourseFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {isLoading ? (
          <LoadingSpinner title="Loading courses..." />
        ) : isError ? (
          <GlobalError />
        ) : (
          <CourseTable courses={filteredCourses} />
        )}
      </main>
    </div>
  )
}
