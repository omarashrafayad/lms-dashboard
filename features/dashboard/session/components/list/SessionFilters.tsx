"use client"

import * as React from "react"
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react"
import { FilterDropdown, FilterOption } from "@/components/shared/FilterDropdown"
import { SessionFilterState } from "../../types/session.types"
import { useTeachers } from "@/features/dashboard/teacher/hooks/useTeachers"
import { useStudents } from "@/features/dashboard/student/hooks/useStudents"

export interface SessionFiltersProps {
  filters: SessionFilterState
  onChange: (key: keyof SessionFilterState, value: string) => void
  onReset: () => void
}

export function SessionFilters({
  filters,
  onChange,
  onReset,
}: SessionFiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  const { data: teachersData } = useTeachers({ pageSize: 100 })
  const teachers = Array.isArray(teachersData) ? teachersData : teachersData?.items || []
  const { data: studentsData } = useStudents({ pageSize: 100 })
  const students = Array.isArray(studentsData) ? studentsData : studentsData?.items || []

  const dateOptions: FilterOption[] = [
    { label: "All Dates", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "this-week" },
    { label: "Next Week", value: "next-week" },
  ]

  const statusOptions: FilterOption[] = [
    { label: "All Statuses", value: "all" },
    { label: "In Progress", value: "In Progress" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Completed", value: "Completed" },
    { label: "Missed", value: "Missed" },
    { label: "Cancelled", value: "Cancelled" },
  ]

  const teacherOptions: FilterOption[] = React.useMemo(() => {
    const unique = Array.from(
      new Set(teachers.map((t) => t.fullName || t.email).filter(Boolean))
    )
    return [
      { label: "All Teachers", value: "all" },
      ...unique.map((name) => ({ label: name, value: name })),
    ]
  }, [teachers])

  const studentOptions: FilterOption[] = React.useMemo(() => {
    const unique = Array.from(
      new Set(students.map((s) => s.fullName || s.email).filter(Boolean))
    )
    return [
      { label: "All Students", value: "all" },
      ...unique.map((name) => ({ label: name, value: name })),
    ]
  }, [students])

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left: Search input + dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Sessions input */}
        <div className="relative w-64 md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search by student, teacher, or session..."
            className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-zinc-200/90 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-2xs"
          />
        </div>

        {/* Date Dropdown */}
        <FilterDropdown
          id="date"
          label="Date"
          value={filters.date}
          options={dateOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onChange("date", val === "all" ? "" : val)}
          minWidth="min-w-[105px]"
          dropdownWidth="w-36"
        />

        {/* Status Dropdown */}
        <FilterDropdown
          id="status"
          label="Status"
          value={filters.status}
          options={statusOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onChange("status", val === "all" ? "" : val)}
          minWidth="min-w-[110px]"
          dropdownWidth="w-40"
        />

        {/* Teacher Dropdown */}
        <FilterDropdown
          id="teacher"
          label="Teacher"
          value={filters.teacher}
          options={teacherOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onChange("teacher", val === "all" ? "" : val)}
          minWidth="min-w-[115px]"
          dropdownWidth="w-48"
        />

        {/* Student Dropdown */}
        <FilterDropdown
          id="student"
          label="Student"
          value={filters.student}
          options={studentOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onChange("student", val === "all" ? "" : val)}
          minWidth="min-w-[115px]"
          dropdownWidth="w-48"
        />
      </div>

      {/* Right: More Filters & Reset Buttons matching Exam */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="h-10 px-3 bg-white border border-zinc-200/90 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}
