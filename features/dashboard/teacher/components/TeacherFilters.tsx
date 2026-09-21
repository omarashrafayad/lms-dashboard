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
import { TeacherFilterState } from "../types/teacher.types"
import { useTeacherSubjects } from "../hooks/useTeachers"

export interface TeacherFiltersProps {
  filters: TeacherFilterState
  onFilterChange: (filters: Partial<TeacherFilterState>) => void
  onReset: () => void
}

const FALLBACK_SUBJECTS = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Arabic",
  "History",
]

export function TeacherFilters({
  filters,
  onFilterChange,
  onReset,
}: TeacherFiltersProps) {
  const { data: subjectsData } = useTeacherSubjects()

  const subjectsList = React.useMemo(() => {
    if (subjectsData && Array.isArray(subjectsData) && subjectsData.length > 0) {
      return subjectsData.map((s) => s.name)
    }
    return FALLBACK_SUBJECTS
  }, [subjectsData])

  return (
    <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-3">
      {/* Top: Full width Search Input with Icon */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search by teacher name, email, or subject..."
          className="h-10 pl-10 pr-4 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm placeholder:text-zinc-400 focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange transition-all"
        />
      </div>

      {/* Bottom: Row of Dropdowns & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Subjects Filter */}
          <Select
            value={filters.subject}
            onValueChange={(val) => onFilterChange({ subject: val || "all" })}
          >
            <SelectTrigger className="h-9 px-3 min-w-[140px] rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-600 shadow-2xs hover:bg-zinc-50">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjectsList.map((subjectName) => (
                <SelectItem key={subjectName} value={subjectName}>
                  {subjectName}
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

          {/* Availability Filter */}
          <Select
            value={filters.availability}
            onValueChange={(val) => onFilterChange({ availability: val || "all" })}
          >
            <SelectTrigger className="h-9 px-3 min-w-[150px] rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-600 shadow-2xs hover:bg-zinc-50">
              <SelectValue placeholder="All Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Busy">Busy</SelectItem>
              <SelectItem value="Offline">Offline</SelectItem>
              <SelectItem value="Unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>

          {/* Time Filter */}
          <Select
            value={filters.time}
            onValueChange={(val) => onFilterChange({ time: val || "all" })}
          >
            <SelectTrigger className="h-9 px-3 min-w-[130px] rounded-xl border-zinc-200/80 bg-white text-xs font-medium text-zinc-600 shadow-2xs hover:bg-zinc-50">
              <SelectValue placeholder="Any Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Time</SelectItem>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Evening">Evening</SelectItem>
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
