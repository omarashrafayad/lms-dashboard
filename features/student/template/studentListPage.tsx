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

  const filteredStudents = React.useMemo(() => {
    return mockStudents.filter((student) => {
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

      if (filters.stage !== "all" && student.stage !== filters.stage) {
        return false
      }

      if (filters.grade !== "all" && student.grade !== filters.grade) {
        return false
      }

      if (filters.system !== "all" && student.system !== filters.system) {
        return false
      }

      if (filters.status !== "all" && student.status !== filters.status) {
        return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="flex flex-col min-h-full">
            <PageHeader
        title="Students"
        description="Manage and monitor all students registered on the platform."
      />
      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        <StudentStats
          totalCount={filteredStudents.length}
          onAddStudent={() => {
            console.log("Add Student clicked")
          }}
        />

        <StudentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        <StudentTable data={filteredStudents} />
      </main>
    </div>
  )
}
