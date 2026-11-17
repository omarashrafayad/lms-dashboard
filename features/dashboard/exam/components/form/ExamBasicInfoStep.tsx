"use client"

import * as React from "react"
import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Search, Loader2, GraduationCap } from "lucide-react"
import { UniInput } from "@/components/shared/UniInput"

export interface ExamBasicInfoStepProps {
  control: Control<any>
  examType: string
  courseId?: string
  courseName?: string
  onSelectCourse: (id: string, name: string) => void
  onClearCourse: () => void
  courses: any[]
  isLoadingCourses: boolean
  courseSearch: string
  onCourseSearchChange: (val: string) => void
}

export function ExamBasicInfoStep({
  control,
  examType,
  courseId,
  courseName,
  onSelectCourse,
  onClearCourse,
  courses,
  isLoadingCourses,
  courseSearch,
  onCourseSearchChange,
}: ExamBasicInfoStepProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 max-w-3xl flex flex-col gap-6 mt-2 animate-in fade-in-50">
      <h2 className="text-base font-bold text-zinc-900">Exam Information</h2>

      {/* Exam Title */}
      <UniInput
        control={control}
        name="title"
        label="EXAM TITLE *"
        placeholder="e.g. Algebra — Final Exam"
        required
      />

      {/* Description */}
      <FormField
        control={control}
        name="description"
        render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              DESCRIPTION
            </FormLabel>
            <FormControl>
              <textarea
                {...field}
                rows={4}
                placeholder="Add an optional description for this exam."
                className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Course Selection Field for Course Exam */}
      {examType === "Course" && (
        <div className="flex flex-col gap-2.5 animate-in fade-in-50 duration-200">
          <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
            SELECT COURSE *
          </label>

          {courseId ? (
            <div className="flex items-center justify-between p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2.5 min-w-0">
                <GraduationCap className="size-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-zinc-900 truncate">
                  {courseName || "Selected Course"}
                </span>
              </div>
              <button
                type="button"
                onClick={onClearCourse}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer shrink-0 ml-3"
              >
                Change Course
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => onCourseSearchChange(e.target.value)}
                  placeholder="Search courses from backend (page 1, 10 items)..."
                  className="w-full h-10 pl-10 pr-10 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                />
                {isLoadingCourses && (
                  <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-500 animate-spin" />
                )}
              </div>

              <div className="border border-zinc-200 rounded-xl max-h-48 overflow-y-auto divide-y divide-zinc-100 bg-white shadow-2xs">
                {isLoadingCourses ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-zinc-400 text-xs">
                    <Loader2 className="size-4 animate-spin text-amber-500" />
                    <span>Searching courses...</span>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="py-4 px-3 text-center text-xs text-zinc-400">
                    {courseSearch ? `No courses found for "${courseSearch}"` : "No courses available."}
                  </div>
                ) : (
                  courses.map((c: any) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectCourse(c.id, c.name || c.title || "Untitled Course")}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-amber-50/50 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-zinc-900 group-hover:text-amber-700 truncate">
                          {c.name || c.title || "Untitled Course"}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {[c.category, c.difficultyLevel].filter(Boolean).join(" · ") || "Course"}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 group-hover:bg-amber-100 px-2.5 py-1 rounded-lg shrink-0 ml-2">
                        Select
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
          <p className="text-[11px] text-zinc-400">
            Choose the course this exam belongs to. Students enrolled in this course will take this assessment.
          </p>
        </div>
      )}

      {/* Exam Type Indicator */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
          EXAM TYPE
        </label>
        <input
          type="text"
          disabled
          value={
            examType === "Monthly"
              ? "Monthly Exam"
              : examType === "Subject"
              ? "Subject Exam"
              : `Course Exam${courseName ? ` (${courseName})` : ""}`
          }
          className="h-10 px-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-600 font-medium cursor-not-allowed"
        />
      </div>

      {/* Duration, Passing Score, Attempts in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UniInput
          control={control}
          name="durationMinutes"
          label="DURATION (MINUTES) *"
          type="number"
          placeholder="60"
          required
        />
        <UniInput
          control={control}
          name="passingScore"
          label="PASSING SCORE (%) *"
          type="number"
          placeholder="50"
          required
        />
        <UniInput
          control={control}
          name="attemptsAllowed"
          label="ATTEMPTS ALLOWED *"
          type="number"
          placeholder="1"
          required
        />
      </div>
    </div>
  )
}
