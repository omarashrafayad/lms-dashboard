"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

export interface StudentAddActionsProps {
  currentStep: number
  isSubmitting: boolean
  onCancel: () => void
  onBack: () => void
  onNext: () => void
}

export function StudentAddActions({
  currentStep,
  isSubmitting,
  onCancel,
  onBack,
  onNext,
}: StudentAddActionsProps) {
  return (
    <div className="flex items-center justify-between pt-1 pb-10">
      {currentStep === 1 ? (
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
        >
          Cancel
        </button>
      ) : (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="size-3.5" />
          <span>Back</span>
        </button>
      )}

      {currentStep === 1 ? (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-brand-orange hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <span>Save & Continue</span>
          <ChevronRight className="size-3.5" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-orange hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
          <span>Create Student</span>
        </button>
      )}
    </div>
  )
}
