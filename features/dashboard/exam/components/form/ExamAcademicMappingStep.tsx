"use client"

import * as React from "react"
import { Control } from "react-hook-form"
import { Search, Loader2, BookOpen, X, Check } from "lucide-react"
import { UniSelect } from "@/components/shared/UniSelect"
import { cn } from "@/lib/utils"

export interface ExamAcademicMappingStepProps {
  control: Control<any>
  examType: string
  levelOptions: { label: string; value: string }[]
  termOptions: { label: string; value: string }[]
  monthOptions: { label: string; value: string }[]
  selectedSubjects: string[]
  onToggleSubject: (subjectId: string) => void
  subjects: any[]
  isLoadingSubjects: boolean
  subjectSearch: string
  onSubjectSearchChange: (val: string) => void
}

export function ExamAcademicMappingStep({
  control,
  examType,
  levelOptions,
  termOptions,
  monthOptions,
  selectedSubjects,
  onToggleSubject,
  subjects,
  isLoadingSubjects,
  subjectSearch,
  onSubjectSearchChange,
}: ExamAcademicMappingStepProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 max-w-3xl flex flex-col gap-6 mt-2 animate-in fade-in-50">
      <div>
        <h2 className="text-base font-bold text-zinc-900">Academic Mapping</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Specify target educational level and curriculum mapping for this exam.
        </p>
      </div>

      {/* Target Level */}
      <UniSelect
        control={control}
        name="level"
        label="TARGET LEVEL *"
        options={levelOptions}
        placeholder="Select academic level..."
        required
      />

      {/* Monthly exam specific fields */}
      {examType === "Monthly" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in-50">
          <UniSelect
            control={control}
            name="term"
            label="ACADEMIC TERM *"
            options={termOptions}
            placeholder="Select term..."
            required
          />
          <UniSelect
            control={control}
            name="month"
            label="TARGET MONTH *"
            options={monthOptions}
            placeholder="Select month..."
            required
          />
        </div>
      )}

      {/* Subject Selection for Subject Exam */}
      {examType === "Subject" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              SELECT TARGET SUBJECTS *
            </label>
            <span className="text-xs text-zinc-400">
              {selectedSubjects.length} selected
            </span>
          </div>

          {/* Selected subjects badges */}
          {selectedSubjects.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
              {selectedSubjects.map((subId) => {
                const subObj = subjects.find((s: any) => s.id === subId)
                const subName = subObj?.name || subObj?.title || subId
                return (
                  <span
                    key={subId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200"
                  >
                    <BookOpen className="size-3 text-amber-600" />
                    <span>{subName}</span>
                    <button
                      type="button"
                      onClick={() => onToggleSubject(subId)}
                      className="size-4 rounded-full hover:bg-amber-200 flex items-center justify-center cursor-pointer ml-0.5 text-amber-800"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          {/* Search Subjects input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={subjectSearch}
              onChange={(e) => onSubjectSearchChange(e.target.value)}
              placeholder="Search subjects from backend (page 1, 10 items)..."
              className="w-full h-10 pl-10 pr-10 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
            {isLoadingSubjects && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-500 animate-spin" />
            )}
          </div>

          {/* Subjects list */}
          <div className="border border-zinc-200 rounded-xl max-h-56 overflow-y-auto divide-y divide-zinc-100 bg-white shadow-2xs">
            {isLoadingSubjects ? (
              <div className="flex items-center justify-center gap-2 py-5 text-zinc-400 text-xs">
                <Loader2 className="size-4 animate-spin text-amber-500" />
                <span>Loading subjects...</span>
              </div>
            ) : subjects.length === 0 ? (
              <div className="py-5 px-3 text-center text-xs text-zinc-400">
                {subjectSearch ? `No subjects match "${subjectSearch}"` : "No subjects available."}
              </div>
            ) : (
              subjects.map((s: any) => {
                const isSelected = selectedSubjects.includes(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onToggleSubject(s.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors cursor-pointer",
                      isSelected ? "bg-amber-50/70" : "hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                          isSelected
                            ? "bg-[#F59E0B] border-[#F59E0B] text-white"
                            : "border-zinc-300 bg-white"
                        )}
                      >
                        {isSelected && <Check className="size-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-medium text-zinc-900 truncate">
                        {s.name || s.title || "Untitled Subject"}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 shrink-0 ml-2">
                      {s.code || s.academicStage || "Subject"}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
