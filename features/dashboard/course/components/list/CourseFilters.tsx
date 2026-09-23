"use client"

import * as React from "react"
import { Search, RotateCcw } from "lucide-react"
import { CourseFilterState } from "../../types/course.types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface CourseFiltersProps {
  filters: CourseFilterState
  onChange: (key: keyof CourseFilterState, value: string) => void
  onReset: () => void
}

export function CourseFilters({ filters, onChange, onReset }: CourseFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* First row of filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Search input */}
        <div className="relative sm:col-span-2 md:col-span-1 lg:col-span-1">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search courses..."
            className="w-full h-10 pl-3.5 pr-3 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
          />
        </div>

        {/* Education Stage */}
        <Select
          value={filters.stage}
          onValueChange={(val) => onChange("stage", val ?? "all")}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="Education Stage" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">All Stages</SelectItem>
            <SelectItem value="Primary" className="text-xs">Primary</SelectItem>
            <SelectItem value="Preparatory" className="text-xs">Preparatory</SelectItem>
            <SelectItem value="Secondary" className="text-xs">Secondary</SelectItem>
          </SelectContent>
        </Select>

        {/* Academic Year */}
        <Select
          value={filters.year}
          onValueChange={(val) => onChange("year", val ?? "all")}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="Academic Year" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">All Years</SelectItem>
            <SelectItem value="2026" className="text-xs">2026 / 2027</SelectItem>
            <SelectItem value="2025" className="text-xs">2025 / 2026</SelectItem>
            <SelectItem value="2024" className="text-xs">2024 / 2025</SelectItem>
          </SelectContent>
        </Select>

        {/* Education System */}
        <Select
          value={filters.system}
          onValueChange={(val) => onChange("system", val ?? "all")}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="Education System" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">All Systems</SelectItem>
            <SelectItem value="National" className="text-xs">National</SelectItem>
            <SelectItem value="American" className="text-xs">American</SelectItem>
            <SelectItem value="IGCSE" className="text-xs">IGCSE</SelectItem>
            <SelectItem value="IB" className="text-xs">IB</SelectItem>
          </SelectContent>
        </Select>

        {/* Term */}
        <Select
          value={filters.term}
          onValueChange={(val) => onChange("term", val ?? "all")}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="Term" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">All Terms</SelectItem>
            <SelectItem value="Term 1" className="text-xs">Term 1</SelectItem>
            <SelectItem value="Term 2" className="text-xs">Term 2</SelectItem>
            <SelectItem value="Full Year" className="text-xs">Full Year</SelectItem>
          </SelectContent>
        </Select>

        {/* Subject */}
        <Select
          value={filters.subject}
          onValueChange={(val) => onChange("subject", val ?? "all")}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">All Subjects</SelectItem>
            <SelectItem value="Mathematics" className="text-xs">Mathematics</SelectItem>
            <SelectItem value="Physics" className="text-xs">Physics</SelectItem>
            <SelectItem value="Chemistry" className="text-xs">Chemistry</SelectItem>
            <SelectItem value="English" className="text-xs">English</SelectItem>
            <SelectItem value="Biology" className="text-xs">Biology</SelectItem>
            <SelectItem value="History" className="text-xs">History</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Second row of filters */}
      <div className="flex items-center gap-3">
        <div className="w-48">
          <Select
            value={filters.status}
            onValueChange={(val) => onChange("status", val ?? "all")}
          >
            <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-700 shadow-2xs font-normal">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
              <SelectItem value="Published" className="text-xs">Published</SelectItem>
              <SelectItem value="Draft" className="text-xs">Draft</SelectItem>
              <SelectItem value="Archived" className="text-xs">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <RotateCcw className="size-3.5 text-zinc-400" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  )
}
