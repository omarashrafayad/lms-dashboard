"use client"

import * as React from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, RotateCcw, DollarSign } from "lucide-react"
import { FilterDropdown, FilterOption } from "@/components/shared/FilterDropdown"
import { TeacherFilterState } from "../types/teacher.types"
import { useTeacherSubjects } from "../hooks/useTeachers"

export interface TeacherFiltersProps {
  filters: TeacherFilterState
  onFilterChange: (filters: Partial<TeacherFilterState>) => void
  onReset: () => void
}

export function TeacherFilters({
  filters,
  onFilterChange,
  onReset,
}: TeacherFiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const { data: subjectsData } = useTeacherSubjects()

  const subjectsList = React.useMemo(() => {
    if (subjectsData && Array.isArray(subjectsData) && subjectsData.length > 0) {
      return Array.from(new Set(subjectsData.map((s) => s.name).filter(Boolean)))
    }
    return []
  }, [subjectsData])

  const subjectOptions: FilterOption[] = React.useMemo(() => {
    return [
      { label: "All Subjects", value: "all" },
      ...subjectsList.map((subjectName) => ({
        label: subjectName,
        value: subjectName,
      })),
    ]
  }, [subjectsList])

  const statusOptions: FilterOption[] = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ]

  const availabilityOptions: FilterOption[] = [
    { label: "All Availability", value: "all" },
    { label: "Available", value: "Available" },
    { label: "Unavailable", value: "Unavailable" },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left: Search input + dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Teachers input */}
        <div className="relative w-64 md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search teachers..."
            className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-zinc-200/90 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-2xs"
          />
        </div>

        {/* Subjects Dropdown */}
        <FilterDropdown
          id="subject"
          label="Subject"
          value={filters.subject}
          options={subjectOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onFilterChange({ subject: val === "all" ? "" : val })}
          minWidth="min-w-[120px]"
          dropdownWidth="w-48"
        />

        {/* Status Dropdown */}
        <FilterDropdown
          id="status"
          label="Status"
          value={filters.status}
          options={statusOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onFilterChange({ status: val === "all" ? "" : val })}
          minWidth="min-w-[105px]"
          dropdownWidth="w-36"
        />

        {/* Availability Dropdown */}
        <FilterDropdown
          id="availability"
          label="Availability"
          value={filters.availability}
          options={availabilityOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) =>
            onFilterChange({ availability: val === "all" ? "" : val })
          }
          minWidth="min-w-[125px]"
          dropdownWidth="w-40"
        />
      </div>

      {/* Right: More Filters & Reset Buttons matching Exam */}
      <div className="flex items-center gap-2">
        <Link
          href="/teacher/dues"
          className="h-10 px-3 bg-amber-50 border border-amber-200/90 rounded-xl text-xs font-semibold text-[#D97706] hover:bg-amber-100 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
        >
          <DollarSign className="size-3.5" />
          <span>Teacher Dues</span>
        </Link>
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
