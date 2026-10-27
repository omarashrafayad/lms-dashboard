"use client"

import * as React from "react"
import { Search, RotateCcw, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const { data: stages = [] } = useAcademicStages()
  const { data: systems = [] } = useEducationSystems()
  const { data: grades = [] } = useGrades()

  const stageOptions = React.useMemo(() => {
    return Array.from(new Set(stages.map((s) => s.name).filter(Boolean)))
  }, [stages])

  const gradeOptions = React.useMemo(() => {
    return Array.from(new Set(grades.map((g) => g.name).filter(Boolean)))
  }, [grades])

  const systemOptions = React.useMemo(() => {
    return Array.from(new Set(systems.map((s) => s.name).filter(Boolean)))
  }, [systems])

  const hasActiveFilters =
    Boolean(filters.search?.trim()) ||
    (filters.stage && filters.stage !== "all") ||
    (filters.year && filters.year !== "all") ||
    (filters.system && filters.system !== "all") ||
    (filters.term && filters.term !== "all")

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
      {/* Top: Search Input with Icon */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search subjects by name..."
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

      {/* Bottom: Row of Filter Selects with clean labels */}
      <div className="flex flex-wrap items-end justify-between gap-3 pt-1 border-zinc-100">
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-3 flex-1">
          {/* Education Stage */}
          <div className="flex flex-col gap-1 min-w-[100px] sm:flex-initial">

            <Select
              value={filters.stage || "allStage"}
              onValueChange={(val) => onFilterChange({ stage: val || "allStage" })}
            >
              <SelectTrigger className="h-9.5 px-3 rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50/80 transition-colors">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allStage">All Stages</SelectItem>
                {stageOptions.map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Academic Year */}
          <div className="flex flex-col gap-1 min-w-[100px] sm:flex-initial">
            <Select
              value={filters.year || "allYear"}
              onValueChange={(val) => onFilterChange({ year: val || "all" })}
            >
              <SelectTrigger className="h-9.5 px-3 rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50/80 transition-colors">
                <SelectValue placeholder="All Academic Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allYear">All Academic Years</SelectItem>
                {gradeOptions.map((gr) => (
                  <SelectItem key={gr} value={gr}>
                    {gr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Education System */}
          <div className="flex flex-col gap-1 min-w-[100px] sm:flex-initial">
            <Select
              value={filters.system || "allSystem"}
              onValueChange={(val) => onFilterChange({ system: val || "all" })}
            >
              <SelectTrigger className="h-9.5 px-3 rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50/80 transition-colors">
                <SelectValue placeholder="All Systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allSystem">All Systems</SelectItem>
                {systemOptions.map((sys) => (
                  <SelectItem key={sys} value={sys}>
                    {sys}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Term */}
          <div className="flex flex-col gap-1 min-w-[100px] flex-1 sm:flex-initial">
            {/* <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Term
            </span> */}
            <Select
              value={filters.term || "allTerms"}
              onValueChange={(val) => onFilterChange({ term: val || "allTerms" })}
            >
              <SelectTrigger className="h-9.5 px-3 rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50/80 transition-colors">
                <SelectValue placeholder="All Terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                <SelectItem value="Term 1">Term 1</SelectItem>
                <SelectItem value="Term 2">Term 2</SelectItem>
                <SelectItem value="Term 3">Term 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset Filters */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className={`text-xs text-zinc-500 hover:text-zinc-900 gap-1.5 px-3 h-9.5 rounded-xl hover:bg-zinc-100 cursor-pointer self-end shrink-0 transition-colors ${
            !hasActiveFilters ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Filters</span>
        </Button>
      </div>
    </div>
  )
}
