"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { StudentStats } from "../components/StudentStats"
import { StudentFilters, FilterState } from "../components/StudentFilters"
import { StudentTable } from "../components/StudentTable"
import { mockStudents } from "../data/mockStudents"
import { useStudents } from "../hooks/useStudents"
import { mapApiStudentToStudent } from "../utils/student.mapper"
import { Loader2 } from "lucide-react"

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

  const { data: apiStudents, isLoading , error} = useStudents()

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const baseStudents = React.useMemo(() => {
    if (apiStudents && Array.isArray(apiStudents)) {
      return apiStudents.map(mapApiStudentToStudent)
    }
    return null
  }, [apiStudents])

  const filteredStudents = React.useMemo(() => {
    if (!baseStudents) return []
    return baseStudents.filter((student) => {
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

      if (filters.stage !== "all" && student.stage.toLowerCase() !== filters.stage.toLowerCase()) {
        return false
      }

      if (filters.grade !== "all" && student.grade.toLowerCase() !== filters.grade.toLowerCase()) {
        return false
      }

      if (filters.system !== "all" && student.system.toLowerCase() !== filters.system.toLowerCase()) {
        return false
      }

      if (filters.status !== "all" && student.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false
      }

      return true
    })
  }, [baseStudents, filters])

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
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs">
            <Loader2 className="size-6 text-brand-orange animate-spin mr-2" />
            <span className="text-sm text-zinc-500">Loading students...</span>
          </div>
        ) : (
          <StudentTable data={filteredStudents} />
        )}
      </main>
    </div>
  )
}
