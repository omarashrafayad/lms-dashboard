"use client"

import * as React from "react"
import { Control } from "react-hook-form"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import { Calendar, Clock, Video } from "lucide-react"

export interface ScheduleDetailsStepProps {
  control: Control<any>
  selectedDate: string
  selectedTime: string
  targetType: "subject" | "course"
  onTargetTypeChange: (type: "subject" | "course") => void
  subjectOptions: { label: string; value: string }[]
  courseOptions: { label: string; value: string }[]
  sessionTypeOptions: { label: string; value: string }[]
  durationOptions: { label: string; value: string }[]
}

export function ScheduleDetailsStep({
  control,
  selectedDate,
  selectedTime,
  targetType,
  onTargetTypeChange,
  subjectOptions,
  courseOptions,
  sessionTypeOptions,
  durationOptions,
}: ScheduleDetailsStepProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-bold text-zinc-900 tracking-tight">
          Session Details
        </h2>
        <p className="text-xs text-zinc-500">
          Configure curriculum topic, session format, meeting details, and duration.
        </p>
      </div>

      {/* Date & Time pill */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200/70">
        <div className="flex items-center gap-2.5 text-xs text-zinc-700">
          <Calendar className="size-4 text-amber-500 shrink-0" />
          <span className="font-semibold text-zinc-900">{selectedDate || "Date Selected"}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-zinc-700">
          <Clock className="size-4 text-amber-500 shrink-0" />
          <span className="font-semibold text-zinc-900">{selectedTime || "Time Slot Selected"}</span>
        </div>
      </div>

      {/* Target Type Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
          CURRICULUM MAPPING *
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onTargetTypeChange("subject")}
            className={`h-10 px-5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              targetType === "subject"
                ? "border-[#F59E0B] bg-[#FFF9F2] text-[#D97706] shadow-2xs"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            Subject
          </button>
          <button
            type="button"
            onClick={() => onTargetTypeChange("course")}
            className={`h-10 px-5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              targetType === "course"
                ? "border-[#F59E0B] bg-[#FFF9F2] text-[#D97706] shadow-2xs"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            Course
          </button>
        </div>
      </div>

      {/* Target Subject or Course selection */}
      {targetType === "subject" ? (
        <UniSelect
          control={control}
          name="subjectId"
          label="Select Subject"
          options={subjectOptions}
          required
          labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
        />
      ) : (
        <UniSelect
          control={control}
          name="courseId"
          label="Select Course"
          options={courseOptions}
          required
          labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
        />
      )}

      {/* Session Type & Max Students */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <UniSelect
          control={control}
          name="sessionType"
          label="Session Type"
          options={sessionTypeOptions}
          required
          labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
        />
        <UniInput
          control={control}
          name="maxStudents"
          label="Max Students"
          type="number"
          required
          placeholder="1"
          labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
        />
      </div>

      {/* Duration */}
      <UniSelect
        control={control}
        name="durationMinutes"
        label="Duration"
        options={durationOptions}
        required
        labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
      />

      {/* Notes */}
      <UniInput
        control={control}
        name="notes"
        label="Notes"
        placeholder="Add any additional notes for this session..."
        labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
        inputClassName="h-10 text-xs rounded-xl"
        helperText="Optional notes visible to student and teacher."
      />
    </div>
  )
}
