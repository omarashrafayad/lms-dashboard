"use client"

import * as React from "react"
import { Check } from "lucide-react"

export interface StepItem {
  id: number
  title: string
  subtitle?: string
}

export const ADD_LESSON_STEPS: StepItem[] = [
  { id: 1, title: "Curriculum Placement" },
  { id: 2, title: "Lesson Information" },
  { id: 3, title: "Video Content" },
  { id: 4, title: "PDF" },
  { id: 5, title: "Lesson Quiz" },
  { id: 6, title: "Access & Offline" },
  { id: 7, title: "Review & Publish" },
]

export interface AddLessonStepperProps {
  currentStep: number
  onStepClick?: (step: number) => void
}

export function AddLessonStepper({
  currentStep,
  onStepClick,
}: AddLessonStepperProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] gap-2">
        {ADD_LESSON_STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isActive = step.id === currentStep
          const isUpcoming = step.id > currentStep

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator and label */}
              <div
                onClick={() => {
                  if (isCompleted && onStepClick) {
                    onStepClick(step.id)
                  }
                }}
                className={`flex items-center gap-2.5 shrink-0 ${
                  isCompleted && onStepClick ? "cursor-pointer" : ""
                }`}
              >
                {/* Circle */}
                {isCompleted ? (
                  <div className="size-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-2xs shrink-0">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                ) : isActive ? (
                  <div className="size-6 rounded-full border-2 border-[#F59E0B] bg-amber-50/50 text-[#F59E0B] font-bold text-xs flex items-center justify-center shrink-0">
                    {step.id}
                  </div>
                ) : (
                  <div className="size-6 rounded-full bg-zinc-100 text-zinc-400 font-semibold text-xs flex items-center justify-center shrink-0">
                    {step.id}
                  </div>
                )}

                {/* Title */}
                <span
                  className={`text-xs whitespace-nowrap ${
                    isActive
                      ? "font-bold text-zinc-900"
                      : isCompleted
                      ? "font-semibold text-zinc-800"
                      : "font-normal text-zinc-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector line between steps */}
              {index < ADD_LESSON_STEPS.length - 1 && (
                <div
                  className={`h-[1.5px] flex-1 min-w-3 max-w-10 rounded-full transition-colors ${
                    step.id < currentStep ? "bg-[#F59E0B]" : "bg-zinc-200"
                  }`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
