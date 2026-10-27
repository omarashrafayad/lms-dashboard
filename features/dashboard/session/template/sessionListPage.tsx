"use client"

import * as React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { SessionMetricsCards } from "../components/list/SessionMetricsCards"
import { SessionStatusTabs } from "../components/list/SessionStatusTabs"
import { SessionFilters } from "../components/list/SessionFilters"
import { SessionTable } from "../components/list/SessionTable"
import { useSessions } from "../hooks/useSessions"
import { SessionFilterState } from "../types/session.types"
import { useDebounce } from "@/hooks/useDebounce"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

export default function SessionListPage() {
  const [filters, setFilters] = React.useState<SessionFilterState>({
    search: "",
    statusTab: "All",
    date: "all",
    status: "all",
    teacher: "all",
    student: "all",
  })
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const debouncedSearch = useDebounce(filters.search, 400)

  const handleFilterChange = (key: keyof SessionFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleResetFilters = () => {
    setFilters({
      search: "",
      statusTab: "All",
      date: "all",
      status: "all",
      teacher: "all",
      student: "all",
    })
    setPage(1)
  }

  const { data: response, isLoading, isError } = useSessions({
    page,
    pageSize,
    search: debouncedSearch,
    status: filters.status !== "all" ? filters.status : undefined,
    date: filters.date !== "all" ? filters.date : undefined,
    teacher: filters.teacher !== "all" ? filters.teacher : undefined,
    student: filters.student !== "all" ? filters.student : undefined,
    statusTab: filters.statusTab !== "All" ? filters.statusTab : undefined,
  })

  const sessions = response?.items || []
  const totalCount = response?.totalCount ?? 0
  const totalPages = response?.totalPages ?? 1

  // Calculate metrics based on total data
  const upcomingCount = sessions.filter(
    (s) => (s.status || s.sessionStatus) === "Upcoming"
  ).length
  const inProgressCount = sessions.filter(
    (s) => (s.status || s.sessionStatus) === "In Progress"
  ).length
  const completedCount = sessions.filter(
    (s) => (s.status || s.sessionStatus) === "Completed"
  ).length

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="All Sessions"
        description="Manage scheduled sessions, monitor session status, and view student, teacher, booking, and payment details."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">
            Showing <strong className="font-bold text-zinc-800">{totalCount}</strong> sessions
          </span>

          <Link
            href="/sessions/schedule"
            className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Schedule Session</span>
          </Link>
        </div>

        <SessionMetricsCards
          total={totalCount}
          upcoming={upcomingCount}
          inProgress={inProgressCount}
          completed={completedCount}
        />

        <SessionStatusTabs
          activeTab={filters.statusTab}
          onTabChange={(tab) => handleFilterChange("statusTab", tab)}
        />

        <SessionFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {isLoading ? (
          <LoadingSpinner title="loading sessions" />
        ) : isError ? (
          <GlobalError />
        ) : (
          <SessionTable
            sessions={sessions}
            isLoading={false}
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
