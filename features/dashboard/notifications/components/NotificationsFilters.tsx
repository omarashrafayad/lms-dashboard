"use client"

import * as React from "react"
import { Search, RotateCcw } from "lucide-react"
import { FilterDropdown, FilterOption } from "@/components/shared/FilterDropdown"

export interface NotificationFilterState {
  search: string
  audience: string
  status: string
  category: string
}

export interface NotificationsFiltersProps {
  filters: NotificationFilterState
  onFilterChange: (filters: Partial<NotificationFilterState>) => void
  onReset: () => void
}

export function NotificationsFilters({
  filters,
  onFilterChange,
  onReset,
}: NotificationsFiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  const audienceOptions: FilterOption[] = [
    { label: "All Audiences", value: "all" },
    { label: "Students", value: "students" },
    { label: "Teachers", value: "teachers" },
    { label: "Parents", value: "parents" },
    { label: "Specific Course", value: "course" },
    { label: "Specific Plan", value: "plan" },
  ]

  const statusOptions: FilterOption[] = [
    { label: "All Status", value: "all" },
    { label: "Published", value: "Published" },
    { label: "Draft", value: "Draft" },
  ]

  const categoryOptions: FilterOption[] = [
    { label: "All Categories", value: "all" },
    { label: "General", value: "general" },
    { label: "Academic & Exams", value: "academic_exam" },
    { label: "Sessions", value: "schedule_session" },
    { label: "Billing & Plans", value: "billing_subscription" },
    { label: "Course Updates", value: "course_update" },
    { label: "Urgent Alerts", value: "urgent" },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left: Search input + dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative w-64 md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search notifications..."
            className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-zinc-200/90 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-2xs"
          />
        </div>

        {/* Audience Dropdown */}
        <FilterDropdown
          id="audience"
          label="Audience"
          value={filters.audience}
          options={audienceOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onFilterChange({ audience: val === "all" ? "" : val })}
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
          minWidth="min-w-[110px]"
          dropdownWidth="w-40"
        />

        {/* Category Dropdown */}
        <FilterDropdown
          id="category"
          label="Category"
          value={filters.category}
          options={categoryOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(val) => onFilterChange({ category: val === "all" ? "" : val })}
          minWidth="min-w-[120px]"
          dropdownWidth="w-48"
        />
      </div>

      {/* Right: Reset Filters button */}
      <div>
        <button
          type="button"
          onClick={onReset}
          className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="size-3.5 text-zinc-400" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  )
}

