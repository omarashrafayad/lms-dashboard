"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { StudentStats } from "../components/StudentStats"
import { StudentFilters, FilterState } from "../components/StudentFilters"
import { StudentTable } from "../components/StudentTable"
import { mockStudents } from "../data/mockStudents"

const initialFilters: FilterState = {
  search: "",
  stage: "all",
  grade: "all",
  system: "all",
  status: "all",
}

export default function StudentListPage() {
  const [filters, setFilters] = React.useState<FilterState>(initialFilters)

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  // Filter student data dynamically based on active filter state
  const filteredStudents = React.useMemo(() => {
    return mockStudents.filter((student) => {
      // Search term filter (matches name, email, phone, or code)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchesName = student.name.toLowerCase().includes(query)
        const matchesEmail = student.email.toLowerCase().includes(query)
        const matchesPhone = student.phone.toLowerCase().includes(query)
        const matchesCode = student.code.toLowerCase().includes(query)
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCode) {
          return false
        }
      }

      // Stage filter
      if (filters.stage !== "all" && student.stage !== filters.stage) {
        return false
      }

      // Grade filter
      if (filters.grade !== "all" && student.grade !== filters.grade) {
        return false
      }

      // System filter
      if (filters.system !== "all" && student.system !== filters.system) {
        return false
      }

      // Status filter
      if (filters.status !== "all" && student.status !== filters.status) {
        return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="flex flex-col min-h-full">
      {/* Reusable Page Header - Customize title and description here */}
      <PageHeader
        title="Students"
        description="Manage and monitor all students registered on the platform."
      />

      {/* Main Page Content Body */}
      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        {/* Top Stats Section (Count, Add Button, KPI Cards) */}
        <StudentStats
          totalCount={filteredStudents.length}
          onAddStudent={() => {
            console.log("Add Student clicked")
          }}
        />

        {/* Search & Filter Controls */}
        <StudentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Student Table powered by UniTable */}
        <StudentTable data={filteredStudents} />
      </main>
    </div>
  )
}
