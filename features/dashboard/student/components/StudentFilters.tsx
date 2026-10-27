"use client"

import * as React from "react"
import { Search, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useAcademicStages,
  useEducationSystems,
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
  const { data: stages = [] } = useAcademicStages()
  const { data: systems = [] } = useEducationSystems()

  return (
    <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-3">
      {/* Top: Full width Search Input with Icon */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search by student name, email, or phone..."
          className="h-10 pl-10 pr-4 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm placeholder:text-zinc-400 focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange transition-all"
        />
      </div>

      {/* Bottom: Row of Dropdowns & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Stage Filter */}
          <Select
            value={filters.stage}
            onValueChange={(val) => onFilterChange({ stage: val || "all" })}
          >
            <SelectTrigger className="h-9 px-3 min-w-[135px] rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-600 shadow-2xs hover:bg-zinc-50">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map((st) => (
                <SelectItem key={st.id} value={st.name}>
                  {st.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* System Filter */}
          <Select
            value={filters.system}
            onValueChange={(val) => onFilterChange({ system: val || "all" })}
          >
            <SelectTrigger className="h-9 px-3 min-w-[135px] rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-600 shadow-2xs hover:bg-zinc-50">
              <SelectValue placeholder="All Systems" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              {systems.map((sys) => (
                <SelectItem key={sys.id} value={sys.name}>
                  {sys.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(val) => onFilterChange({ status: val || "all" })}
          >
            <SelectTrigger className="h-9 px-3 min-w-[130px] rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-600 shadow-2xs hover:bg-zinc-50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs text-zinc-500 hover:text-zinc-900 gap-1.5 px-2.5 h-9 rounded-xl hover:bg-zinc-100 cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Filters</span>
        </Button>
      </div>
    </div>
  )
}
