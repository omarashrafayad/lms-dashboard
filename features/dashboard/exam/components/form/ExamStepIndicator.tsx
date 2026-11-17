"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface StepItem {
  number: number
  label: string
}

export const EXAM_STEPS: StepItem[] = [
  { number: 1, label: "Select Exam Type" },
  { number: 2, label: "Exam Information" },
  { number: 3, label: "Academic Mapping" },
  { number: 4, label: "Questions" },
  { number: 5, label: "Settings & Review" },
]

export interface ExamStepIndicatorProps {
  steps?: StepItem[]
  currentStep: number
  onStepClick?: (stepNumber: number) => void
}

export function ExamStepIndicator({
  steps = EXAM_STEPS,
  currentStep,
  onStepClick,
}: ExamStepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {steps.map((st) => {
        const isCurrent = st.number === currentStep
        const isCompleted = st.number < currentStep

        return (
          <button
            key={st.number}
            type="button"
            onClick={() => {
              if (isCompleted && onStepClick) {
                onStepClick(st.number)
              }
            }}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap",
              isCurrent &&
                "bg-[#FFF9F2] text-[#D97706] border border-[#F59E0B] font-semibold shadow-2xs",
              isCompleted &&
                "bg-amber-50 text-amber-900 border border-amber-200/80 font-medium cursor-pointer hover:bg-amber-100/70",
              !isCurrent &&
                !isCompleted &&
                "border border-zinc-200 bg-white text-zinc-400 font-normal cursor-not-allowed"
            )}
          >
            {isCompleted ? (
              <span className="size-3.5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
            ) : (
              <span
                className={cn(
                  "text-xs font-bold",
                  isCurrent ? "text-[#F59E0B]" : "text-zinc-400"
                )}
              >
                {st.number}
              </span>
            )}
            <span>{st.label}</span>
          </button>
        )
      })}
    </div>
  )
}
