"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherStats } from "../components/TeacherStats"
import { TeacherFilters } from "../components/TeacherFilters"
import { TeacherTable } from "../components/TeacherTable"
import { mockTeachers } from "../data/mockTeachers"
import { TeacherFilterState } from "../types/teacher.types"
import { useTeachers } from "../hooks/useTeachers"
import { mapApiTeacherToTeacher } from "../utils/teacher.mapper"
import { Loader2 } from "lucide-react"

const initialFilters: TeacherFilterState = {
  search: "",
  subject: "all",
  status: "all",
  availability: "all",
  time: "all",
}

export default function TeacherListPage() {
  const [filters, setFilters] = React.useState<TeacherFilterState>(initialFilters)

  const { data: apiTeachers, isLoading } = useTeachers()

  const handleFilterChange = (updated: Partial<TeacherFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const baseTeachers = React.useMemo(() => {
    if (apiTeachers && Array.isArray(apiTeachers)) {
      if (apiTeachers.length > 0) {
        return apiTeachers.map((t, idx) => mapApiTeacherToTeacher(t, idx))
      }
      return []
    }
    return mockTeachers
  }, [apiTeachers])

  const statsCounts = React.useMemo(() => {
    const active = baseTeachers.filter((t) => t.status === "Active").length
    const available = baseTeachers.filter((t) => t.availability === "Available").length
    const upcoming = baseTeachers.reduce((acc, t) => acc + (t.upcomingSessions || 0), 0)
    return { active, available, upcoming }
  }, [baseTeachers])

  const filteredTeachers = React.useMemo(() => {
    return baseTeachers.filter((teacher) => {
      // Search term filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchesName = teacher.name.toLowerCase().includes(query)
        const matchesEmail = teacher.email.toLowerCase().includes(query)
        const matchesPhone = teacher.phone.toLowerCase().includes(query)
        const matchesSubject = teacher.subjects.some((s) =>
          s.toLowerCase().includes(query)
        )
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesSubject) {
          return false
        }
      }

      // Subject filter
      if (
        filters.subject !== "all" &&
        !teacher.subjects.some((s) => s.toLowerCase() === filters.subject.toLowerCase())
      ) {
        return false
      }

      // Status filter
      if (filters.status !== "all" && teacher.status !== filters.status) {
        return false
      }

      // Availability filter
      if (
        filters.availability !== "all" &&
        teacher.availability !== filters.availability
      ) {
        return false
      }

      return true
    })
  }, [baseTeachers, filters])

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="All Teachers"
        description="Manage teachers, availability, sessions, students, and account status."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto">
        {/* Top Stats Section */}
        <TeacherStats
          totalCount={filteredTeachers.length}
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
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs">
            <Loader2 className="size-6 text-brand-orange animate-spin mr-2" />
            <span className="text-sm text-zinc-500">Loading teachers...</span>
          </div>
        ) : (
          <TeacherTable data={filteredTeachers} />
        )}
      </main>
    </div>
  )
}
