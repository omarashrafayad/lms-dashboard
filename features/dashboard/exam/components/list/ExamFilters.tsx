"use client"

import * as React from "react"
import { Search, ChevronDown, SlidersHorizontal, RotateCcw, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ExamFilterState } from "../../types/exam.types"

interface ExamFiltersProps {
  filters: ExamFilterState
  counts: {
    all: number
    monthly: number
    subject: number
    course: number
  }
  onChange: (key: keyof ExamFilterState, value: string) => void
  onReset: () => void
}

export function ExamFilters({
  filters,
  counts,
  onChange,
  onReset,
}: ExamFiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  const examTypeOptions = [
    { label: "All Types", value: "all" },
    { label: "Monthly Exam", value: "Monthly" },
    { label: "Subject Exam", value: "Subject" },
    { label: "Course Exam", value: "Course" },
  ]

  const levelOptions = [
    { label: "All Levels", value: "all" },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ]

  const questionsOptions = [
    { label: "All Questions", value: "all" },
    { label: "Under 15 Questions", value: "<15" },
    { label: "15 - 20 Questions", value: "15-20" },
    { label: "21 - 30 Questions", value: "21-30" },
    { label: "30+ Questions", value: ">30" },
  ]

  const durationOptions = [
    { label: "All Durations", value: "all" },
    { label: "Under 30 min", value: "<30" },
    { label: "30 - 45 min", value: "30-45" },
    { label: "45+ min", value: ">45" },
  ]

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-filter-dropdown]")) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  return (
    <div className="flex flex-col gap-5">
      {/* Category Tabs matching Image 1 */}
      <div className="flex items-center gap-8 border-b border-zinc-200/80 -mb-1">
        <button
          type="button"
          onClick={() => onChange("tab", "all")}
          className={cn(
            "pb-3 text-sm font-semibold transition-all relative cursor-pointer",
            filters.tab === "all"
              ? "text-zinc-900"
              : "text-zinc-500 hover:text-zinc-800 font-medium"
          )}
        >
          All Exams
          {filters.tab === "all" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F59E0B] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange("tab", "monthly")}
          className={cn(
            "pb-3 text-sm transition-all relative cursor-pointer",
            filters.tab === "monthly"
              ? "text-zinc-900 font-semibold"
              : "text-zinc-500 hover:text-zinc-800 font-medium"
          )}
        >
          Monthly
          {filters.tab === "monthly" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F59E0B] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange("tab", "subject")}
          className={cn(
            "pb-3 text-sm transition-all relative cursor-pointer",
            filters.tab === "subject"
              ? "text-zinc-900 font-semibold"
              : "text-zinc-500 hover:text-zinc-800 font-medium"
          )}
        >
          Subject
          {filters.tab === "subject" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F59E0B] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange("tab", "course")}
          className={cn(
            "pb-3 text-sm transition-all relative cursor-pointer",
            filters.tab === "course"
              ? "text-zinc-900 font-semibold"
              : "text-zinc-500 hover:text-zinc-800 font-medium"
          )}
        >
          Course
          {filters.tab === "course" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F59E0B] rounded-full" />
          )}
        </button>
      </div>

      {/* Filter Row matching Image 1 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Search input + dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Exams input */}
          <div className="relative w-64 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange("search", e.target.value)}
              placeholder="Search exams..."
              className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-zinc-200/90 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-2xs"
            />
          </div>

          {/* Exam Type Dropdown */}
          <div className="relative" data-filter-dropdown>
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === "type" ? null : "type")
              }
              className={cn(
                "h-10 px-3.5 bg-white border border-zinc-200/90 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center justify-between gap-2 shadow-2xs cursor-pointer transition-colors min-w-[110px]",
                filters.type !== "all" && "border-amber-400 text-amber-900 bg-amber-50/40"
              )}
            >
              <span>
                {filters.type === "all"
                  ? "Exam Type"
                  : examTypeOptions.find((o) => o.value === filters.type)?.label ||
                    "Exam Type"}
              </span>
              <ChevronDown className="size-3.5 text-zinc-400" />
            </button>

            {openDropdown === "type" && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg z-30 p-1.5 flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95">
                {examTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange("type", opt.value)
                      setOpenDropdown(null)
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer",
                      filters.type === opt.value
                        ? "bg-amber-50 text-amber-900 font-semibold"
                        : "text-zinc-600 hover:bg-zinc-50"
                    )}
                  >
                    <span>{opt.label}</span>
                    {filters.type === opt.value && (
                      <Check className="size-3.5 text-amber-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Level Dropdown */}
          <div className="relative" data-filter-dropdown>
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === "level" ? null : "level")
              }
              className={cn(
                "h-10 px-3.5 bg-white border border-zinc-200/90 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center justify-between gap-2 shadow-2xs cursor-pointer transition-colors min-w-[95px]",
                filters.level !== "all" && "border-amber-400 text-amber-900 bg-amber-50/40"
              )}
            >
              <span>
                {filters.level === "all"
                  ? "Level"
                  : filters.level}
              </span>
              <ChevronDown className="size-3.5 text-zinc-400" />
            </button>

            {openDropdown === "level" && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-zinc-200 rounded-xl shadow-lg z-30 p-1.5 flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95">
                {levelOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange("level", opt.value)
                      setOpenDropdown(null)
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer",
                      filters.level === opt.value
                        ? "bg-amber-50 text-amber-900 font-semibold"
                        : "text-zinc-600 hover:bg-zinc-50"
                    )}
                  >
                    <span>{opt.label}</span>
                    {filters.level === opt.value && (
                      <Check className="size-3.5 text-amber-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Questions Dropdown */}
          <div className="relative" data-filter-dropdown>
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "questions" ? null : "questions"
                )
              }
              className={cn(
                "h-10 px-3.5 bg-white border border-zinc-200/90 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center justify-between gap-2 shadow-2xs cursor-pointer transition-colors min-w-[110px]",
                filters.questions !== "all" && "border-amber-400 text-amber-900 bg-amber-50/40"
              )}
            >
              <span>
                {filters.questions === "all"
                  ? "Questions"
                  : questionsOptions.find((o) => o.value === filters.questions)
                      ?.label || "Questions"}
              </span>
              <ChevronDown className="size-3.5 text-zinc-400" />
            </button>

            {openDropdown === "questions" && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg z-30 p-1.5 flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95">
                {questionsOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange("questions", opt.value)
                      setOpenDropdown(null)
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer",
                      filters.questions === opt.value
                        ? "bg-amber-50 text-amber-900 font-semibold"
                        : "text-zinc-600 hover:bg-zinc-50"
                    )}
                  >
                    <span>{opt.label}</span>
                    {filters.questions === opt.value && (
                      <Check className="size-3.5 text-amber-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Duration Dropdown */}
          <div className="relative" data-filter-dropdown>
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === "duration" ? null : "duration")
              }
              className={cn(
                "h-10 px-3.5 bg-white border border-zinc-200/90 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center justify-between gap-2 shadow-2xs cursor-pointer transition-colors min-w-[105px]",
                filters.duration !== "all" && "border-amber-400 text-amber-900 bg-amber-50/40"
              )}
            >
              <span>
                {filters.duration === "all"
                  ? "Duration"
                  : durationOptions.find((o) => o.value === filters.duration)
                      ?.label || "Duration"}
              </span>
              <ChevronDown className="size-3.5 text-zinc-400" />
            </button>

            {openDropdown === "duration" && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-zinc-200 rounded-xl shadow-lg z-30 p-1.5 flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95">
                {durationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange("duration", opt.value)
                      setOpenDropdown(null)
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer",
                      filters.duration === opt.value
                        ? "bg-amber-50 text-amber-900 font-semibold"
                        : "text-zinc-600 hover:bg-zinc-50"
                    )}
                  >
                    <span>{opt.label}</span>
                    {filters.duration === opt.value && (
                      <Check className="size-3.5 text-amber-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: More Filters & Reset Buttons matching Image 1 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-10 px-3.5 bg-white border border-zinc-200/90 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="size-3.5 text-zinc-500" />
            <span>More Filters</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="h-10 px-3 bg-white border border-zinc-200/90 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  )
}
