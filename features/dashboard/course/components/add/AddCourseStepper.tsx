"use client"

import * as React from "react"
import { Check } from "lucide-react"

export interface AddCourseStepItem {
  id: number
  title: string
}

export const ADD_COURSE_STEPS: AddCourseStepItem[] = [
  { id: 1, title: "Course Information" },
  { id: 2, title: "Academic Mapping" },
  { id: 3, title: "Course Content" },
  { id: 4, title: "Course Exam" },
  { id: 5, title: "Course Settings" },
  { id: 6, title: "Review" },
]

export interface AddCourseStepperProps {
  currentStep: number
  onStepClick?: (step: number) => void
}

export function AddCourseStepper({
  currentStep,
  onStepClick,
}: AddCourseStepperProps) {
  return (
    <div className="w-full sm:w-64 flex flex-col gap-1.5 select-none shrink-0">
      {ADD_COURSE_STEPS.map((step) => {
        const isCompleted = step.id < currentStep
        const isActive = step.id === currentStep

        return (
          <div
            key={step.id}
            onClick={() => {
              if (isCompleted && onStepClick) {
                onStepClick(step.id)
              }
            }}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              isActive
                ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-3"
                : isCompleted
                ? "text-zinc-700 hover:bg-zinc-50 cursor-pointer font-medium"
                : "text-zinc-400 font-normal"
            }`}
          >
            {/* Step Circle */}
            {isCompleted ? (
              <div className="size-5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0">
                <Check className="size-3 stroke-[3]" />
              </div>
            ) : isActive ? (
              <div className="size-5 rounded-full border-2 border-[#F59E0B] bg-white text-[#F59E0B] font-bold text-[11px] flex items-center justify-center shrink-0">
                {step.id}
              </div>
            ) : (
              <div className="size-5 rounded-full border border-zinc-200 bg-white text-zinc-400 font-medium text-[11px] flex items-center justify-center shrink-0">
                {step.id}
              </div>
            )}

            <span className="text-xs">{step.title}</span>
          </div>
        )
      })}
    </div>
  )
}
