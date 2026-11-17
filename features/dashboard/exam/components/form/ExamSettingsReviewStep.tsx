"use client"

import * as React from "react"
import { Control, useWatch } from "react-hook-form"
import { UniSelect } from "@/components/shared/UniSelect"
import { UniInput } from "@/components/shared/UniInput"
import { CheckCircle2, AlertCircle, FileText, Clock, Award, HelpCircle } from "lucide-react"

export interface ExamSettingsReviewStepProps {
  control: Control<any>
  availabilityOptions: { label: string; value: string }[]
  questionsCount: number
  totalPoints: number
}

export function ExamSettingsReviewStep({
  control,
  availabilityOptions,
  questionsCount,
  totalPoints,
}: ExamSettingsReviewStepProps) {
  const watchAvailability = useWatch({ control, name: "availability" })
  const watchTitle = useWatch({ control, name: "title" })
  const watchExamType = useWatch({ control, name: "examType" })
  const watchCourseName = useWatch({ control, name: "courseName" })
  const watchLevel = useWatch({ control, name: "level" })
  const watchMonth = useWatch({ control, name: "month" })
  const watchDuration = useWatch({ control, name: "durationMinutes" })
  const watchPassingScore = useWatch({ control, name: "passingScore" })
  const watchAttemptsAllowed = useWatch({ control, name: "attemptsAllowed" })
  const watchStatus = useWatch({ control, name: "status" })

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 max-w-3xl flex flex-col gap-6 mt-2 animate-in fade-in-50">
      <div>
        <h2 className="text-base font-bold text-zinc-900">Settings & Review</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Configure availability and publish status before saving.
        </p>
      </div>

      {/* Availability Selector */}
      <UniSelect
        control={control}
        name="availability"
        label="AVAILABILITY *"
        options={availabilityOptions}
        required
      />

      {/* Conditional Date Pickers if Scheduled */}
      {watchAvailability === "Scheduled" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200/70 animate-in fade-in-50">
          <UniInput
            control={control}
            name="availableFrom"
            label="AVAILABLE FROM *"
            type="datetime-local"
            required
          />
          <UniInput
            control={control}
            name="availableTo"
            label="AVAILABLE UNTIL *"
            type="datetime-local"
            required
          />
        </div>
      )}

      {/* Status Selector */}
      <UniSelect
        control={control}
        name="status"
        label="EXAM STATUS *"
        options={[
          { label: "Published (Available to students)", value: "Published" },
          { label: "Draft (Saved privately)", value: "Draft" },
        ]}
        required
      />

      {/* Summary Card */}
      <div className="p-5 bg-gradient-to-br from-amber-50/50 to-orange-50/20 rounded-2xl border border-amber-200/70 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
          <FileText className="size-4 text-amber-600" />
          <span>Exam Configuration Summary</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400 uppercase font-semibold">
              Title
            </span>
            <span className="font-bold text-zinc-900 truncate">
              {watchTitle || "Untitled"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400 uppercase font-semibold">
              Type
            </span>
            <span className="font-bold text-zinc-900">
              {watchExamType === "Course"
                ? `Course (${watchCourseName || "Selected"})`
                : watchExamType === "Monthly"
                ? `Monthly (${watchMonth || ""})`
                : "Subject Exam"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400 uppercase font-semibold">
              Duration
            </span>
            <span className="font-bold text-zinc-900">
              {watchDuration || 60} mins
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400 uppercase font-semibold">
              Questions
            </span>
            <span className="font-bold text-zinc-900">
              {questionsCount} ({totalPoints} pts)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs pt-2 border-t border-amber-200/50">
          <div className="flex items-center gap-1.5 text-zinc-600">
            <Award className="size-3.5 text-amber-600" />
            <span>Pass Mark: <strong>{watchPassingScore || 50}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600">
            <Clock className="size-3.5 text-amber-600" />
            <span>Attempts: <strong>{watchAttemptsAllowed || 1}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            <span>Status: <strong>{watchStatus || "Published"}</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}
