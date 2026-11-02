"use client"

import * as React from "react"
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react"
import { FilterDropdown, FilterOption } from "@/components/shared/FilterDropdown"
import {
  useAcademicStages,
  useEducationSystems,
  useGrades,
} from "@/features/dashboard/reference-data/hooks/useReferenceData"

export interface FilterState {
  search: string
  stage: string
  grade: string
  system: string
  status: string
}

export interface StudentFiltersProps {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  onReset: () => void
}

export function StudentFilters({
  filters,
  onFilterChange,
  onReset,
}: StudentFiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  const { data: stages = [] } = useAcademicStages()
  const { data: systems = [] } = useEducationSystems()
  const { data: grades = [] } = useGrades()

  const stageOptions: FilterOption[] = React.useMemo(() => {
    const unique = Array.from(new Set(stages.map((st) => st.name).filter(Boolean)))
    return [
      { label: "All Stages", value: "all" },
      ...unique.map((st) => ({ label: st, value: st })),
    ]
  }, [stages])

  const gradeOptions: FilterOption[] = React.useMemo(() => {
    const unique = Array.from(new Set(grades.map((gr) => gr.name).filter(Boolean)))
    return [
      { label: "All Grades", value: "all" },
      ...unique.map((gr) => ({ label: gr, value: gr })),
    ]
  }, [grades])

  const systemOptions: FilterOption[] = React.useMemo(() => {
    const unique = Array.from(new Set(systems.map((sys) => sys.name).filter(Boolean)))
    return [
      { label: "All Systems", value: "all" },
      ...unique.map((sys) => ({ label: sys, value: sys })),
    ]
  }, [systems])

  const statusOptions: FilterOption[] = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left: Search input + dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Students input */}
        <div className="relative w-64 md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search students..."
            className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-zinc-200/90 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-2xs"
          />
        </div>

        {/* Stage Dropdown */}
        <FilterDropdown
          id="stage"
          label="Stage"
          value={filters.stage}
          options={stageOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onFilterChange({ stage: val === "all" ? "" : val })}
          minWidth="min-w-[110px]"
          dropdownWidth="w-48"
        />

        {/* Grade Dropdown */}
        <FilterDropdown
          id="grade"
          label="Grade"
          value={filters.grade}
          options={gradeOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onFilterChange({ grade: val === "all" ? "" : val })}
          minWidth="min-w-[110px]"
          dropdownWidth="w-48"
        />

        {/* System Dropdown */}
        <FilterDropdown
          id="system"
          label="System"
          value={filters.system}
          options={systemOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onFilterChange({ system: val === "all" ? "" : val })}
          minWidth="min-w-[110px]"
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
