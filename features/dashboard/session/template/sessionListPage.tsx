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

  const { data: rawSessions = [], isLoading, isError } = useSessions()

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

  const filteredSessions = React.useMemo(() => {
    if (!Array.isArray(rawSessions)) return []

    return rawSessions.filter((session) => {
      // Search
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase()
        const matchesStudent = session.studentName?.toLowerCase().includes(q)
        const matchesTeacher = session.teacherName?.toLowerCase().includes(q)
        const matchesSubject = (session.subject || session.subjectOrCourse)?.toLowerCase().includes(q)
        const matchesNum = (session.sessionNumber || session.sessionId || session.sessionCode || session.id)?.toLowerCase().includes(q)
        if (!matchesStudent && !matchesTeacher && !matchesSubject && !matchesNum) {
          return false
        }
      }

      // Status Tab
      if (filters.statusTab && filters.statusTab !== "All") {
        const sessionStatus = (session.status || session.sessionStatus || "").toLowerCase()
        if (filters.statusTab === "Today") {
          const todayStr = new Date().toDateString()
          const sessionDateStr = session.date ? new Date(session.date).toDateString() : ""
          if (sessionDateStr !== todayStr && !session.date?.toLowerCase().includes("today")) {
            return false
          }
        } else if (sessionStatus !== filters.statusTab.toLowerCase()) {
          return false
        }
      }

      // Status dropdown
      if (filters.status !== "all") {
        const sessionStatus = (session.status || session.sessionStatus || "").toLowerCase()
        if (sessionStatus !== filters.status.toLowerCase()) {
          return false
        }
      }

      // Teacher dropdown
      if (filters.teacher !== "all") {
        if (session.teacherName?.toLowerCase() !== filters.teacher.toLowerCase()) {
          return false
        }
      }

      // Student dropdown
      if (filters.student !== "all") {
        if (session.studentName?.toLowerCase() !== filters.student.toLowerCase()) {
          return false
        }
      }

      return true
    })
  }, [rawSessions, filters])

  // Calculate metrics based on total data
  const totalCount = filteredSessions.length
  const upcomingCount = filteredSessions.filter(
    (s) => (s.status || s.sessionStatus) === "Upcoming"
  ).length
  const inProgressCount = filteredSessions.filter(
    (s) => (s.status || s.sessionStatus) === "In Progress"
  ).length
  const completedCount = filteredSessions.filter(
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
          <SessionTable sessions={filteredSessions} isLoading={false} />
        )}
      </main>
    </div>
  )
}
