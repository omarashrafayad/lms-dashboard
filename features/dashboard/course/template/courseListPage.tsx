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
import { useDebounce } from "@/hooks/useDebounce"
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
  const [filters, setFilters] = React.useState<CourseFilterState>(initialFilters)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const debouncedSearch = useDebounce(filters.search, 400)

  const handleFilterChange = (key: keyof CourseFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
    setPage(1)
  }

  const { data: response, isLoading, isError } = useCourses({
    page,
    pageSize,
    search: debouncedSearch,
    category: filters.category,
    level: filters.level,
    status: filters.status,
  })

  const courses = response?.items || []
  const totalCount = response?.totalCount ?? 0
  const totalPages = response?.totalPages ?? 1

  const publishedCount = courses.filter(
    (c) => c.status?.toLowerCase() === "published" || c.status?.toLowerCase() === "active"
  ).length
  const draftCount = courses.filter((c) => c.status?.toLowerCase() === "draft").length
  const archivedCount = courses.filter(
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
            Showing <strong className="font-bold text-zinc-800">{courses.length}</strong> of{" "}
            <strong className="font-bold text-zinc-800">{totalCount}</strong> courses
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
          <CourseTable
            courses={courses}
            pageSize={pageSize}
            serverPagination={{
              currentPage: page,
              totalPages,
              totalItems: totalCount,
              onPageChange: (newPage) => setPage(newPage),
              pageSizeOptions: [10, 20, 50],
              onPageSizeChange: (newSize) => {
                setPageSize(newSize)
                setPage(1)
              },
            }}
          />
        )}
      </main>
    </div>
  )
}
