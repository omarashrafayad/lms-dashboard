"use client"

import * as React from "react"
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react"
import { FilterDropdown, FilterOption } from "@/components/shared/FilterDropdown"
import { CourseFilterState } from "../../types/course.types"

export interface CourseFiltersProps {
  filters: CourseFilterState
  onChange: (key: keyof CourseFilterState, value: string) => void
  onReset: () => void
}

export function CourseFilters({ filters, onChange, onReset }: CourseFiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  const categoryOptions: FilterOption[] = [
    { label: "All Categories", value: "all" },
    { label: "Computer Science", value: "Computer Science" },
    { label: "Mathematics", value: "Mathematics" },
    { label: "Sciences", value: "Sciences" },
    { label: "Languages", value: "Languages" },
    { label: "Design & Arts", value: "Design & Arts" },
    { label: "Humanities", value: "Humanities" },
  ]

  const levelOptions: FilterOption[] = [
    { label: "All Levels", value: "all" },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ]

  const statusOptions: FilterOption[] = [
    { label: "All Statuses", value: "all" },
    { label: "Published", value: "Published" },
    { label: "Draft", value: "Draft" },
    { label: "Archived", value: "Archived" },
  ]

  const durationOptions: FilterOption[] = [
    { label: "All Durations", value: "all" },
    { label: "Under 5 hrs", value: "<5" },
    { label: "5 - 10 hrs", value: "5-10" },
    { label: "10+ hrs", value: ">10" },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left: Search input + dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Courses input */}
        <div className="relative w-64 md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search courses..."
            className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-zinc-200/90 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-2xs"
          />
        </div>

        {/* Category Dropdown */}
        <FilterDropdown
          id="category"
          label="Category"
          value={filters.category}
          options={categoryOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onChange("category", val === "all" ? "" : val)}
          minWidth="min-w-[120px]"
          dropdownWidth="w-48"
        />

        {/* Level Dropdown */}
        <FilterDropdown
          id="level"
          label="Level"
          value={filters.level}
          options={levelOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onChange("level", val === "all" ? "" : val)}
          minWidth="min-w-[100px]"
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
          minWidth="min-w-[105px]"
          dropdownWidth="w-36"
        />

        {/* Duration Dropdown */}
        <FilterDropdown
          id="duration"
          label="Duration"
          value={filters.duration}
          options={durationOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onChange("duration", val === "all" ? "" : val)}
          minWidth="min-w-[105px]"
          dropdownWidth="w-40"
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
