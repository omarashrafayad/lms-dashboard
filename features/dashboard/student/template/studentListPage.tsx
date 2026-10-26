"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { StudentStats } from "../components/StudentStats"
import { StudentFilters, FilterState } from "../components/StudentFilters"
import { StudentTable } from "../components/StudentTable"
import { useStudents } from "../hooks/useStudents"
import { useDebounce } from "@/hooks/useDebounce"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

const initialFilters: FilterState = {
  search: "",
  stage: "",
  grade: "",
  system: "",
  status: "",
}

export default function StudentListPage() {
  const router = useRouter()
  const [filters, setFilters] = React.useState<FilterState>(initialFilters)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const debouncedSearch = useDebounce(filters.search, 400)

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
    setPage(1)
  }

  const handleReset = () => {
    setFilters(initialFilters)
    setPage(1)
  }

  const { data: studentsResponse, isLoading, isError } = useStudents({
    page,
    pageSize,
    search: debouncedSearch,
    stage: filters.stage,
    grade: filters.grade,
    system: filters.system,
    status: filters.status,
  })

  const students = studentsResponse?.items || []
  const totalCount = studentsResponse?.totalCount ?? 0
  const totalPages = studentsResponse?.totalPages ?? 1

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Students"
        description="Manage and monitor all students registered on the platform."
      />
      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        <StudentStats
          totalCount={totalCount}
          onAddStudent={() => {
            router.push("/student/add")
          }}
        />

        <StudentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {isLoading ? (
          <LoadingSpinner title="loading students" />
        ) : isError ? (
          <GlobalError />
        ) : (
          <StudentTable
            data={students}
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
