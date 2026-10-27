"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ParentFilterState } from "../types/parent.types"

export interface ParentFiltersProps {
  filters: ParentFilterState
  onFilterChange: (updated: Partial<ParentFilterState>) => void
  onReset?: () => void
}

export function ParentFilters({
  filters,
  onFilterChange,
}: ParentFiltersProps) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search by parent name, email, or phone..."
          className="h-10 pl-10 pr-9 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm placeholder:text-zinc-400 focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange transition-all"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onFilterChange({ search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-0.5 rounded-full hover:bg-zinc-200/50 cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
