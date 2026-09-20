"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const ADD_STUDENT_STEPS = [
  { number: 1, label: "Basic", sublabel: "Information" },
  { number: 2, label: "Academic", sublabel: "Information" },
] as const

export interface StudentAddStepperProps {
  currentStep: number
  completedSteps: number[]
}

export function StudentAddStepper({
  currentStep,
  completedSteps,
}: StudentAddStepperProps) {
  return (
    <div className="w-full flex items-center justify-center px-6 py-5">
      <div className="flex items-center gap-0 w-full max-w-[620px]">
        {ADD_STUDENT_STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(step.number)
          const isCurrent = currentStep === step.number
          const isLast = idx === ADD_STUDENT_STEPS.length - 1

          return (
            <React.Fragment key={step.number}>
              {/* Step Circle + Label */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all",
                    isCompleted
                      ? "bg-brand-orange text-white"
                      : isCurrent
                      ? "bg-brand-orange text-white"
                      : "bg-zinc-100 text-zinc-400 border border-zinc-200/80"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 stroke-[2.5]" />
                  ) : (
                    step.number
                  )}
                </div>

                <div className="flex flex-col leading-none">
                  <span
                    className={cn(
                      "text-[10px] font-medium uppercase tracking-wider",
                      isCurrent || isCompleted
                        ? "text-zinc-500"
                        : "text-zinc-400"
                    )}
                  >
                    STEP {step.number}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold mt-0.5",
                      isCurrent || isCompleted
                        ? "text-zinc-900"
                        : "text-zinc-400"
                    )}
                  >
                    {step.label}
                    {step.sublabel && (
                      <>
                        <br />
                        {step.sublabel}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-3">
                  <div
                    className={cn(
                      "h-px w-full",
                      isCompleted ? "bg-brand-orange" : "bg-zinc-200"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
