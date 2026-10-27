"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherStats } from "../components/TeacherStats"
import { TeacherFilters } from "../components/TeacherFilters"
import { TeacherTable } from "../components/TeacherTable"
import { TeacherFilterState } from "../types/teacher.types"
import { useTeachers } from "../hooks/useTeachers"
import { useDebounce } from "@/hooks/useDebounce"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

const initialFilters: TeacherFilterState = {
  search: "",
  subject: "",
  status: "",
  availability: "",
}

export default function TeacherListPage() {
  const [filters, setFilters] = React.useState<TeacherFilterState>(initialFilters)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const debouncedSearch = useDebounce(filters.search, 400)

  const handleFilterChange = (updated: Partial<TeacherFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
    setPage(1)
  }

  const handleReset = () => {
    setFilters(initialFilters)
    setPage(1)
  }

  const { data: response, isLoading, error: isError } = useTeachers({
    page,
    pageSize,
    search: debouncedSearch,
    subject: filters.subject,
    status: filters.status,
    availability: filters.availability,
  })

  const teachers = response?.items || []
  const totalCount = response?.totalCount ?? 0
  const totalPages = response?.totalPages ?? 1

  const statsCounts = React.useMemo(() => {
    const active = teachers.filter((t) => t.isActive).length
    const available = teachers.filter((t) => t.isAvailable !== false && t.isActive).length
    const upcoming = teachers.reduce((acc, t) => acc + (t.availabilitySlots?.length || 0), 0)
    return { active, available, upcoming }
  }, [teachers])

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="All Teachers"
        description="Manage teachers, availability, sessions, students, and account status."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto">
        {/* Top Stats Section */}
        <TeacherStats
          totalCount={totalCount}
          activeCount={statsCounts.active}
          availableCount={statsCounts.available}
          upcomingSessionsCount={statsCounts.upcoming}
        />

        {/* Search & Filter Controls */}
        <TeacherFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Teacher Table or Loading State */}
        {isLoading ? (
          <LoadingSpinner title="Loading Teachers" />
        ) : isError ? (
          <GlobalError />
        ) : (
          <TeacherTable
            data={teachers}
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
