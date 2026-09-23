"use client"

import * as React from "react"
import { Check } from "lucide-react"

export interface ScheduleStepItem {
  id: number
  title: string
}

export const SCHEDULE_STEPS: ScheduleStepItem[] = [
  { id: 1, title: "Select Student" },
  { id: 2, title: "Select Teacher" },
  { id: 3, title: "Select Date & Time" },
  { id: 4, title: "Session Details" },
  { id: 5, title: "Review" },
]

export interface ScheduleSessionStepperProps {
  currentStep: number
  onStepClick?: (step: number) => void
}

export function ScheduleSessionStepper({
  currentStep,
  onStepClick,
}: ScheduleSessionStepperProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {SCHEDULE_STEPS.map((step) => {
        const isCompleted = step.id < currentStep
        const isActive = step.id === currentStep

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => {
              if (isCompleted && onStepClick) {
                onStepClick(step.id)
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap border ${
              isActive
                ? "border-[#F59E0B] bg-[#FFF9F2] text-[#D97706] font-semibold shadow-2xs"
                : isCompleted
                ? "border-zinc-200 bg-white text-zinc-800 font-medium hover:bg-zinc-50 cursor-pointer"
                : "border-zinc-200 bg-white text-zinc-400 font-normal cursor-default"
            }`}
          >
            {/* Step Icon / Number matching Images 4 & 5 */}
            {isCompleted ? (
              <div className="size-4 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0">
                <Check className="size-2.5 stroke-[3]" />
              </div>
            ) : (
              <span className={`text-[11px] font-bold ${isActive ? "text-[#D97706]" : "text-zinc-400"}`}>
                {step.id}
              </span>
            )}

            <span>{step.title}</span>
          </button>
        )
      })}
    </div>
  )
}
