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
  const categories = [
    "Computer Science",
    "Mathematics",
    "Sciences",
    "Languages",
    "Design & Arts",
    "Humanities",
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Search input */}
        <div className="relative sm:col-span-2 md:col-span-1 lg:col-span-2">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search by course name or instructor..."
            className="w-full h-10 pl-3.5 pr-3 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={filters.category}
          onValueChange={(val) => onChange("category", val ?? "all")}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-xs">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Level Filter */}
        <Select
          value={filters.level}
          onValueChange={(val) => onChange("level", val ?? "all")}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">All Levels</SelectItem>
            <SelectItem value="Beginner" className="text-xs">Beginner</SelectItem>
            <SelectItem value="Intermediate" className="text-xs">Intermediate</SelectItem>
            <SelectItem value="Advanced" className="text-xs">Advanced</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(val) => onChange("status", val ?? "all")}
        >
          <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-700 shadow-2xs font-normal">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
            <SelectItem value="Published" className="text-xs">Published</SelectItem>
            <SelectItem value="Draft" className="text-xs">Draft</SelectItem>
            <SelectItem value="Archived" className="text-xs">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Indicators & Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          {(filters.search ||
            filters.category !== "all" ||
            filters.level !== "all" ||
            filters.status !== "all") && (
            <span>Filtered results active</span>
          )}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer self-end"
        >
          <RotateCcw className="size-3" />
          <span>Reset filters</span>
        </button>
      </div>
    </div>
  )
}
