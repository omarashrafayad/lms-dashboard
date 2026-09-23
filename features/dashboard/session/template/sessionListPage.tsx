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

export default function SessionListPage() {
  const [filters, setFilters] = React.useState<SessionFilterState>({
    search: "",
    statusTab: "All",
    date: "all",
    status: "all",
    teacher: "all",
    student: "all",
  })

  const { data: sessions = [], isLoading } = useSessions(filters)

  const handleFilterChange = (key: keyof SessionFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
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
  }

  // Calculate metrics based on total data
  const totalCount = sessions.length
  const upcomingCount = sessions.filter((s) => s.status === "Upcoming").length
  const inProgressCount = sessions.filter((s) => s.status === "In Progress").length
  const completedCount = sessions.filter((s) => s.status === "Completed").length

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Page Header matching Image 1 */}
      <PageHeader
        title="All Sessions"
        description="Manage scheduled sessions, monitor session status, and view student, teacher, booking, and payment details."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20">
        {/* Header Action Row matching Image 1 */}
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

        {/* 4 Metric Cards matching Image 1 */}
        <SessionMetricsCards
          total={totalCount}
          upcoming={upcomingCount}
          inProgress={inProgressCount}
          completed={completedCount}
        />

        {/* Status Tabs matching Image 1 */}
        <SessionStatusTabs
          activeTab={filters.statusTab}
          onTabChange={(tab) => handleFilterChange("statusTab", tab)}
        />

        {/* Filter Bar matching Image 1 */}
        <SessionFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Sessions Table matching Image 1 */}
        <SessionTable sessions={sessions} isLoading={isLoading} />
      </main>
    </div>
  )
}
