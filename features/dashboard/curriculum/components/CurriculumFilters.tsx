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
import { SubjectFilterState } from "../types/curriculum.types"

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
  return (
    <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
      {/* Top: Search Input with Icon */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search subjects..."
          className="h-10 pl-10 pr-4 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm placeholder:text-zinc-400 focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange transition-all"
        />
      </div>

      {/* Bottom: Row of Filter Selects with Labels above each */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Education Stage */}
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <span className="text-[11px] font-medium text-zinc-500">
              Education Stage
            </span>
            <Select
              value={filters.stage}
              onValueChange={(val) => onFilterChange({ stage: val || "all" })}
            >
              <SelectTrigger className="h-9 px-3 rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50">
                <SelectValue placeholder="All Education Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Education Stage</SelectItem>
                <SelectItem value="Primary">Primary</SelectItem>
                <SelectItem value="Preparatory">Preparatory</SelectItem>
                <SelectItem value="Secondary">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Academic Year */}
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <span className="text-[11px] font-medium text-zinc-500">
              Academic Year
            </span>
            <Select
              value={filters.year}
              onValueChange={(val) => onFilterChange({ year: val || "all" })}
            >
              <SelectTrigger className="h-9 px-3 rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50">
                <SelectValue placeholder="All Academic Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Academic Year</SelectItem>
                <SelectItem value="Grade 4">Grade 4</SelectItem>
                <SelectItem value="Grade 5">Grade 5</SelectItem>
                <SelectItem value="Grade 6">Grade 6</SelectItem>
                <SelectItem value="Grade 7">Grade 7</SelectItem>
                <SelectItem value="Grade 8">Grade 8</SelectItem>
                <SelectItem value="Grade 9">Grade 9</SelectItem>
                <SelectItem value="Grade 10">Grade 10</SelectItem>
                <SelectItem value="Grade 11">Grade 11</SelectItem>
                <SelectItem value="Grade 12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Education System */}
          <div className="flex flex-col gap-1.5 min-w-[155px]">
            <span className="text-[11px] font-medium text-zinc-500">
              Education System
            </span>
            <Select
              value={filters.system}
              onValueChange={(val) => onFilterChange({ system: val || "all" })}
            >
              <SelectTrigger className="h-9 px-3 rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50">
                <SelectValue placeholder="All Education System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Education System</SelectItem>
                <SelectItem value="National">National</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="IGCSE">IGCSE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Term */}
          <div className="flex flex-col gap-1.5 min-w-[125px]">
            <span className="text-[11px] font-medium text-zinc-500">Term</span>
            <Select
              value={filters.term}
              onValueChange={(val) => onFilterChange({ term: val || "all" })}
            >
              <SelectTrigger className="h-9 px-3 rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50">
                <SelectValue placeholder="All Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Term</SelectItem>
                <SelectItem value="Term 1">Term 1</SelectItem>
                <SelectItem value="Term 2">Term 2</SelectItem>
                <SelectItem value="Term 3">Term 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5 min-w-[130px]">
            <span className="text-[11px] font-medium text-zinc-500">Subject</span>
            <Select
              value={filters.subject}
              onValueChange={(val) => onFilterChange({ subject: val || "all" })}
            >
              <SelectTrigger className="h-9 px-3 rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50">
                <SelectValue placeholder="All Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subject</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="English">English</SelectItem>
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
          className="text-xs text-zinc-500 hover:text-zinc-900 gap-1.5 px-2.5 h-9 rounded-xl hover:bg-zinc-100 cursor-pointer self-end mb-0.5"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Filters</span>
        </Button>
      </div>
    </div>
  )
}
