"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherStats } from "../components/TeacherStats"
import { TeacherFilters } from "../components/TeacherFilters"
import { TeacherTable } from "../components/TeacherTable"
import { TeacherFilterState } from "../types/teacher.types"
import { useTeachers } from "../hooks/useTeachers"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

const initialFilters: TeacherFilterState = {
  search: "",
  subject: "all",
  status: "all",
  availability: "all",
  time: "all",
}

export default function TeacherListPage() {
  const [filters, setFilters] = React.useState<TeacherFilterState>(initialFilters)

  const { data: apiTeachers, isLoading, error: isError } = useTeachers()

  const handleFilterChange = (updated: Partial<TeacherFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const filteredTeachers = React.useMemo(() => {
    if (!apiTeachers || !Array.isArray(apiTeachers)) return []
    return apiTeachers.filter((teacher) => {
      // Search term filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchesName = teacher.fullName?.toLowerCase().includes(query)
        const matchesEmail = teacher.email?.toLowerCase().includes(query)
        const matchesPhone = teacher.phoneNumber?.toLowerCase().includes(query)
        const subjects = teacher.specializations
          ? (teacher.specializations.map((s) => s.subjectName).filter(Boolean) as string[])
          : []
        const matchesSubject = subjects.some((s) => s.toLowerCase().includes(query))
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesSubject) {
          return false
        }
      }

      // Subject filter
      if (filters.subject !== "all") {
        const subjects = teacher.specializations
          ? (teacher.specializations.map((s) => s.subjectName).filter(Boolean) as string[])
          : []
        if (!subjects.some((s) => s.toLowerCase() === filters.subject.toLowerCase())) {
          return false
        }
      }

      // Status filter
      if (filters.status !== "all") {
        const status = teacher.isActive ? "Active" : "Inactive"
        if (status !== filters.status) {
          return false
        }
      }

      // Availability filter
      if (filters.availability !== "all") {
        let availability = "Available"
        if (teacher.isAvailable === false) {
          availability = "Unavailable"
        } else if (!teacher.isActive) {
          availability = "Offline"
        }
        if (availability !== filters.availability) {
          return false
        }
      }

      return true
    })
  }, [apiTeachers, filters])

  const statsCounts = React.useMemo(() => {
    const active = filteredTeachers.filter((t) => t.isActive).length
    const available = filteredTeachers.filter((t) => t.isAvailable !== false && t.isActive).length
    const upcoming = filteredTeachers.reduce((acc, t) => acc + (t.availabilitySlots?.length || 0), 0)
    return { active, available, upcoming }
  }, [filteredTeachers])

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
          <LoadingSpinner title="Loading Teachers" />
        ) : isError ? (
          <GlobalError />
        ) : (
          <TeacherTable data={filteredTeachers} />
        )}
      </main>
    </div>
  )
}
