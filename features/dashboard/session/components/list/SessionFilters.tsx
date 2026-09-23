"use client"

import * as React from "react"
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react"
import { SessionFilterState } from "../../types/session.types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockTeachersList, mockStudentsList } from "../../data/mockSessions"

export interface SessionFiltersProps {
  filters: SessionFilterState
  onChange: (key: keyof SessionFilterState, value: string) => void
  onReset: () => void
}

export function SessionFilters({
  filters,
  onChange,
  onReset,
}: SessionFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-[320px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search by student, teacher, or session ID..."
            className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
          />
        </div>

        {/* Date Filter */}
        <Select
          value={filters.date}
          onValueChange={(val) => onChange("date", val)}
        >
          <SelectTrigger className="h-10 min-w-[130px] rounded-xl border-zinc-200 bg-white text-xs text-zinc-700 shadow-2xs">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-zinc-200">
            <SelectItem value="all" className="text-xs">
              All Dates
            </SelectItem>
            <SelectItem value="today" className="text-xs">
              Today
            </SelectItem>
            <SelectItem value="this-week" className="text-xs">
              This Week
            </SelectItem>
            <SelectItem value="next-week" className="text-xs">
              Next Week
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Session Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(val) => onChange("status", val)}
        >
          <SelectTrigger className="h-10 min-w-[140px] rounded-xl border-zinc-200 bg-white text-xs text-zinc-700 shadow-2xs">
            <SelectValue placeholder="Session Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-zinc-200">
            <SelectItem value="all" className="text-xs">
              All Statuses
            </SelectItem>
            <SelectItem value="In Progress" className="text-xs">
              In Progress
            </SelectItem>
            <SelectItem value="Upcoming" className="text-xs">
              Upcoming
            </SelectItem>
            <SelectItem value="Completed" className="text-xs">
              Completed
            </SelectItem>
            <SelectItem value="Missed" className="text-xs">
              Missed
            </SelectItem>
            <SelectItem value="Cancelled" className="text-xs">
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Teacher Filter */}
        <Select
          value={filters.teacher}
          onValueChange={(val) => onChange("teacher", val)}
        >
          <SelectTrigger className="h-10 min-w-[130px] rounded-xl border-zinc-200 bg-white text-xs text-zinc-700 shadow-2xs">
            <SelectValue placeholder="Teacher" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-zinc-200">
            <SelectItem value="all" className="text-xs">
              All Teachers
            </SelectItem>
            {mockTeachersList.map((t) => (
              <SelectItem key={t.id} value={t.name} className="text-xs">
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Student Filter */}
        <Select
          value={filters.student}
          onValueChange={(val) => onChange("student", val)}
        >
          <SelectTrigger className="h-10 min-w-[130px] rounded-xl border-zinc-200 bg-white text-xs text-zinc-700 shadow-2xs">
            <SelectValue placeholder="Student" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-zinc-200">
            <SelectItem value="all" className="text-xs">
              All Students
            </SelectItem>
            {mockStudentsList.slice(0, 6).map((s) => (
              <SelectItem key={s.id} value={s.name} className="text-xs">
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* More Filters button matching Image 1 */}
        <button
          type="button"
          onClick={() => {}}
          className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <SlidersHorizontal className="size-3.5 text-zinc-500" />
          <span>More Filters</span>
        </button>
      </div>

      {/* Reset Button */}
      <div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3.5 text-zinc-400" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}
