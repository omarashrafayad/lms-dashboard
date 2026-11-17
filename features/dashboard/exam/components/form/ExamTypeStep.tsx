"use client"

import * as React from "react"
import { Calendar, BookOpen, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ExamTypeStepProps {
  selectedType: string
  onSelectType: (type: "Monthly" | "Subject" | "Course") => void
}

export function ExamTypeStep({ selectedType, onSelectType }: ExamTypeStepProps) {
  return (
    <div className="flex flex-col gap-6 mt-2 animate-in fade-in-50">
      <div>
        <h2 className="text-base font-bold text-zinc-900">Select Exam Type</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Choose the kind of exam you want to create. This determines how it is mapped and used.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Monthly Exam Card */}
        <div
          onClick={() => onSelectType("Monthly")}
          className={cn(
            "bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-2xs cursor-pointer transition-all hover:border-zinc-300",
            selectedType === "Monthly"
              ? "border-amber-500 ring-2 ring-amber-100 bg-amber-50/20"
              : "border-zinc-200/90"
          )}
        >
          <div className="size-10 rounded-xl bg-zinc-100 border border-zinc-200/70 flex items-center justify-center text-zinc-600">
            <Calendar className="size-5 text-zinc-600" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-bold text-zinc-900">Monthly Exam</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              A recurring monthly assessment mapped to a specific term and month.
            </p>
          </div>
        </div>

        {/* Subject Exam Card */}
        <div
          onClick={() => onSelectType("Subject")}
          className={cn(
            "bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-2xs cursor-pointer transition-all hover:border-zinc-300",
            selectedType === "Subject"
              ? "border-amber-500 ring-2 ring-amber-100 bg-amber-50/20"
              : "border-zinc-200/90"
          )}
        >
          <div className="size-10 rounded-xl bg-zinc-100 border border-zinc-200/70 flex items-center justify-center text-zinc-600">
            <BookOpen className="size-5 text-zinc-600" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-bold text-zinc-900">Subject Exam</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              A subject-level exam mapped to a level, stage, and one or more target subjects.
            </p>
          </div>
        </div>

        {/* Course Exam Card */}
        <div
          onClick={() => onSelectType("Course")}
          className={cn(
            "bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-2xs cursor-pointer transition-all hover:border-zinc-300",
            selectedType === "Course"
              ? "border-amber-500 ring-2 ring-amber-100 bg-amber-50/20"
              : "border-zinc-200/90"
          )}
        >
          <div className="size-10 rounded-xl bg-zinc-100 border border-zinc-200/70 flex items-center justify-center text-zinc-600">
            <GraduationCap className="size-5 text-zinc-600" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-bold text-zinc-900">Course Exam</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              An assessment linked directly to a course and administered to enrolled students.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
