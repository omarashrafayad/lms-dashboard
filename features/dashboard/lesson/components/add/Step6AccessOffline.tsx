"use client"

import * as React from "react"
import { Lock, ChevronLeft, ChevronRight } from "lucide-react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { LessonFormValues } from "../../types/lesson.types"

export interface Step6AccessOfflineProps {
  watch: UseFormWatch<LessonFormValues>
  setValue: UseFormSetValue<LessonFormValues>
  onNext: () => void
  onBack: () => void
  onCancel: () => void
}

export function Step6AccessOffline({
  watch,
  setValue,
  onNext,
  onBack,
  onCancel,
}: Step6AccessOfflineProps) {
  const allowVideoDownload = watch("allowVideoDownload")
  const allowPdfDownload = watch("allowPdfDownload")

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Step Header matching Image 4 */}
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold text-zinc-900 tracking-tight">
          Step 6 — Access & Offline
        </h2>
      </div>

      {/* 2 Plan Cards Grid matching Image 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Free Plan */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col items-start gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
            Free Plan
          </span>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Free students can watch{" "}
            <span className="font-bold text-zinc-900">the first video only</span>.
          </p>
        </div>

        {/* Card 2: Premium Plan */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            <Lock className="size-3 stroke-[2.5]" />
            <span>Premium</span>
          </span>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Premium students unlock{" "}
            <span className="font-bold text-zinc-900">all remaining videos</span> and full content.
          </p>
        </div>
      </div>

      {/* Settings Card with Toggles matching Image 4 */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 divide-y divide-zinc-100 flex flex-col">
        {/* Allow Video Download Row */}
        <div className="pb-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-900">
              Allow Video Download
            </span>
            <span className="text-[11px] text-zinc-400 mt-0.5">
              Students can save videos for offline viewing.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setValue("allowVideoDownload", !allowVideoDownload)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              allowVideoDownload ? "bg-[#F59E0B]" : "bg-zinc-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                allowVideoDownload ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Allow PDF Download Row */}
        <div className="pt-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-900">
              Allow PDF Download
            </span>
            <span className="text-[11px] text-zinc-400 mt-0.5">
              Students can download the lesson PDF.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setValue("allowPdfDownload", !allowPdfDownload)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              allowPdfDownload ? "bg-[#F59E0B]" : "bg-zinc-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                allowPdfDownload ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Bottom Actions matching Image 4 */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
          >
            <ChevronLeft className="size-3.5 stroke-[2.5]" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
          >
            <span>Continue</span>
            <ChevronRight className="size-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  )
}
