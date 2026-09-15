"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherStats } from "../components/TeacherStats"
import { TeacherFilters } from "../components/TeacherFilters"
import { TeacherTable } from "../components/TeacherTable"
import { mockTeachers } from "../data/mockTeachers"
import { TeacherFilterState } from "../types/teacher.types"

const initialFilters: TeacherFilterState = {
  search: "",
  subject: "all",
  status: "all",
  availability: "all",
  time: "all",
}

export default function TeacherListPage() {
  const [filters, setFilters] = React.useState<TeacherFilterState>(initialFilters)

  const handleFilterChange = (updated: Partial<TeacherFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const filteredTeachers = React.useMemo(() => {
    return mockTeachers.filter((teacher) => {
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
        !teacher.subjects.includes(filters.subject)
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
  }, [filters])

  return (
    <div className="flex flex-col min-h-full">
      {/* Reusable Page Header matching screenshot */}
      <PageHeader
        title="All Teachers"
        description="Manage teachers, availability, sessions, students, and account status."
      />

      {/* Main Page Content Body */}
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto">
        {/* Top Stats Section (Count, Add Button, 4 KPI Cards) */}
        <TeacherStats totalCount={filteredTeachers.length} />

        {/* Search & Filter Controls */}
        <TeacherFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Teacher Table */}
        <TeacherTable data={filteredTeachers} />
      </main>
    </div>
  )
}
