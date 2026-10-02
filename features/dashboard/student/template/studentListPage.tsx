"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { StudentStats } from "../components/StudentStats"
import { StudentFilters, FilterState } from "../components/StudentFilters"
import { StudentTable } from "../components/StudentTable"
import { useStudents } from "../hooks/useStudents"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

const initialFilters: FilterState = {
  search: "",
  stage: "all",
  grade: "all",
  system: "all",
  status: "all",
}

export default function StudentListPage() {
  const router = useRouter()
  const [filters, setFilters] = React.useState<FilterState>(initialFilters)

  const { data: apiStudents, isLoading, isError } = useStudents()

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const filteredStudents = React.useMemo(() => {
    if (!apiStudents || !Array.isArray(apiStudents)) return []
    return apiStudents.filter((student) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchesName = student.fullName?.toLowerCase().includes(query)
        const matchesEmail = student.email?.toLowerCase().includes(query)
        const matchesPhone = student.phoneNumber?.toLowerCase().includes(query)
        const code = `std-${(student.id || "").slice(0, 5)}`
        const matchesCode = code.includes(query) || student.id.toLowerCase().includes(query)
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCode) {
          return false
        }
      }

      if (filters.stage !== "all" && student.educationStage?.toLowerCase() !== filters.stage.toLowerCase()) {
        return false
      }

      if (filters.grade !== "all" && student.grade?.toLowerCase() !== filters.grade.toLowerCase()) {
        return false
      }

      if (filters.system !== "all" && student.educationSystem?.toLowerCase() !== filters.system.toLowerCase()) {
        return false
      }

      if (filters.status !== "all") {
        const status = student.isActive ? "active" : "inactive"
        if (status !== filters.status.toLowerCase()) {
          return false
        }
      }

      return true
    })
  }, [apiStudents, filters])

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
          <StudentTable data={filteredStudents} />
        )}
      </main>
    </div>
  )
}
