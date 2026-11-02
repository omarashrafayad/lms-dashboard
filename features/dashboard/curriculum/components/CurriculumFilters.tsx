"use client"

import * as React from "react"
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react"
import { FilterDropdown, FilterOption } from "@/components/shared/FilterDropdown"
import { SubjectFilterState } from "../types/curriculum.types"
import {
  useAcademicStages,
  useEducationSystems,
  useGrades,
} from "@/features/dashboard/reference-data/hooks/useReferenceData"

export interface CurriculumFiltersProps {
  filters: SubjectFilterState
  onFilterChange: (filters: Partial<SubjectFilterState>) => void
  onReset: () => void
}

export function CurriculumFilters({
  filters,
  onFilterChange,
  onReset,
}: CurriculumFiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  const { data: stages = [] } = useAcademicStages()
  const { data: systems = [] } = useEducationSystems()
  const { data: grades = [] } = useGrades()

  const stageOptions: FilterOption[] = React.useMemo(() => {
    const list = Array.from(new Set(stages.map((s) => s.name).filter(Boolean)))
    return [
      { label: "All Stages", value: "all" },
      ...list.map((st) => ({ label: st, value: st })),
    ]
  }, [stages])

  const yearOptions: FilterOption[] = React.useMemo(() => {
    const list = Array.from(new Set(grades.map((g) => g.name).filter(Boolean)))
    return [
      { label: "All Academic Years", value: "all" },
      ...list.map((gr) => ({ label: gr, value: gr })),
    ]
  }, [grades])

  const systemOptions: FilterOption[] = React.useMemo(() => {
    const list = Array.from(new Set(systems.map((s) => s.name).filter(Boolean)))
    return [
      { label: "All Systems", value: "all" },
      ...list.map((sys) => ({ label: sys, value: sys })),
    ]
  }, [systems])

  const termOptions: FilterOption[] = [
    { label: "All Terms", value: "all" },
    { label: "Term 1", value: "Term 1" },
    { label: "Term 2", value: "Term 2" },
    { label: "Term 3", value: "Term 3" },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left: Search input + dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Subjects input */}
        <div className="relative w-64 md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search subjects..."
            className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-zinc-200/90 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-2xs"
          />
        </div>

        {/* Education Stage Dropdown */}
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

        {/* Academic Year Dropdown */}
        <FilterDropdown
          id="year"
          label="Academic Year"
          value={filters.year}
          options={yearOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onFilterChange({ year: val === "all" ? "" : val })}
          minWidth="min-w-[130px]"
          dropdownWidth="w-48"
        />

        {/* Education System Dropdown */}
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

        {/* Term Dropdown */}
        <FilterDropdown
          id="term"
          label="Term"
          value={filters.term}
          options={termOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onFilterChange({ term: val === "all" ? "" : val })}
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
