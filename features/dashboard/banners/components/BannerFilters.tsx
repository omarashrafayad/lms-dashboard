"use client"

import * as React from "react"
import { Search, RotateCcw } from "lucide-react"
import { FilterDropdown, FilterOption } from "@/components/shared/FilterDropdown"

export interface BannerFilterState {
  search: string
  status: string
}

export interface BannerFiltersProps {
  filters: BannerFilterState
  onFilterChange: (filters: Partial<BannerFilterState>) => void
  onReset: () => void
}

export function BannerFilters({
  filters,
  onFilterChange,
  onReset,
}: BannerFiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  const statusOptions: FilterOption[] = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ]

  const hasActiveFilters = Boolean(
    filters.search || (filters.status && filters.status !== "all")
  )

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left: Search input + dropdown */}
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by title or link URL..."
            className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-white border border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all shadow-2xs"
          />
        </div>

        {/* Status Dropdown */}
        <FilterDropdown
          id="status"
          label="Status"
          value={filters.status}
          options={statusOptions}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={(value) => onFilterChange({ status: value })}
          minWidth="min-w-[120px]"
        />
      </div>

      {/* Right: Reset Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset filters</span>
        </button>
      )}
    </div>
  )
}

