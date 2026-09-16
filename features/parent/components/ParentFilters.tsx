"use client"

import * as React from "react"
import { Search, RotateCcw, ChevronDown } from "lucide-react"
import { ParentFilterState } from "../types/parent.types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface ParentFiltersProps {
  filters: ParentFilterState
  onFilterChange: (updated: Partial<ParentFilterState>) => void
  onReset: () => void
}

export function ParentFilters({
  filters,
  onFilterChange,
  onReset,
}: ParentFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search by parent name, email, or phone..."
          className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-white border border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
        />
      </div>

      {/* Filter: Status */}
      <div className="w-[125px]">
        <Select
          value={filters.status}
          onValueChange={(val) => onFilterChange({ status: val ?? "all" })}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-zinc-200/80 text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">Status</SelectItem>
            <SelectItem value="Active" className="text-xs">Active</SelectItem>
            <SelectItem value="Inactive" className="text-xs">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter: Has Linked Children */}
      <div className="w-[175px]">
        <Select
          value={filters.hasLinkedChildren}
          onValueChange={(val) => onFilterChange({ hasLinkedChildren: val ?? "all" })}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-zinc-200/80 text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="Has Linked Children" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">Has Linked Children</SelectItem>
            <SelectItem value="yes" className="text-xs">With Children</SelectItem>
            <SelectItem value="no" className="text-xs">No Children</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter: Subscription Status */}
      <div className="w-[165px]">
        <Select
          value={filters.subscriptionStatus}
          onValueChange={(val) => onFilterChange({ subscriptionStatus: val ?? "all" })}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-zinc-200/80 text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="Subscription Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">Subscription Status</SelectItem>
            <SelectItem value="active" className="text-xs">Has Subscription</SelectItem>
            <SelectItem value="none" className="text-xs">No Subscription</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter: Registration Date */}
      <div className="w-[155px]">
        <Select
          value={filters.registrationDate}
          onValueChange={(val) => onFilterChange({ registrationDate: val ?? "all" })}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-zinc-200/80 text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="Registration Date" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">Registration Date</SelectItem>
            <SelectItem value="2026" className="text-xs">This Year (2026)</SelectItem>
            <SelectItem value="recent" className="text-xs">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset Filters */}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors ml-auto cursor-pointer"
      >
        <RotateCcw className="size-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  )
}
