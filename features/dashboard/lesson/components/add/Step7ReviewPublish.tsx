"use client"

import * as React from "react"
import {
  Pencil,
  ChevronLeft,
  Play,
  Check,
  Loader2,
} from "lucide-react"
import { UseFormWatch } from "react-hook-form"
import { LessonFormValues, LessonStatus } from "../../types/lesson.types"

export interface Step7ReviewPublishProps {
  watch: UseFormWatch<LessonFormValues>
  onGoToStep: (step: number) => void
  onBack: () => void
  onCancel: () => void
  onSubmit: (status: LessonStatus) => void
  isSubmitting?: boolean
}

export function Step7ReviewPublish({
  watch,
  onGoToStep,
  onBack,
  onCancel,
  onSubmit,
  isSubmitting = false,
}: Step7ReviewPublishProps) {
  const formValues = watch()

  // Build curriculum placement string
  const curriculumItems = [
    formValues.stage || "Primary",
    formValues.year || "Grade 4",
    formValues.system || "National",
    formValues.term || "Term 1",
    formValues.subject || "Arabic",
    formValues.chapter || "Chapter 1 — Numbers",
    formValues.unit || "Unit 1 — Place Value",
  ].filter(Boolean)

  const curriculumBreadcrumb = curriculumItems.join(" → ")

  const videos = formValues.videos || []
  const quiz = formValues.quiz
  const totalQuizQuestions = quiz?.questions?.length || 0

  const pdfName =
    formValues.pdfFile?.name ||
    formValues.pdfTitle ||
    "Worksheet.pdf"
  const pdfSize = formValues.pdfFile
    ? `${(formValues.pdfFile.size / (1024 * 1024)).toFixed(1)} MB`
    : "2.4 MB"

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Step Header matching Image 5 */}
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold text-zinc-900 tracking-tight">
          Step 7 — Review & Publish
        </h2>
      </div>

      {/* Review Cards Stack matching Image 5 */}
      <div className="flex flex-col gap-4">
        {/* Card 1: Curriculum Placement */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-900">
              Curriculum Placement
            </h3>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <p className="text-xs text-zinc-500 font-normal leading-relaxed">
            {curriculumBreadcrumb}
          </p>
        </div>

        {/* Card 2: Lesson Information */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-900">
              Lesson Information
            </h3>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <div className="flex flex-col gap-2 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-normal">Title</span>
              <span className="font-semibold text-zinc-800" dir="auto">
                {formValues.title || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-normal">Order</span>
              <span className="font-semibold text-zinc-800">
                {formValues.order || "1"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-normal">Duration</span>
              <span className="font-semibold text-zinc-800" dir="auto">
                {formValues.duration || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Videos */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-900">
              Videos ({videos.length})
            </h3>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <div className="flex flex-col gap-2.5 pt-1">
            {videos.length === 0 ? (
              <span className="text-xs text-zinc-400 italic">No videos added yet</span>
            ) : (
              videos.map((vid, idx) => (
                <div key={vid.id || idx} className="flex items-center gap-2 text-xs">
                  <Play className="size-3 text-zinc-400 fill-zinc-400/20 shrink-0" />
                  <span className="text-zinc-800 font-medium" dir="auto">
                    {vid.title || `Video ${idx + 1}`}
                  </span>
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      vid.access === "Free"
                        ? "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]"
                        : "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                    }`}
                  >
                    {vid.access}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 4: PDF */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-900">PDF</h3>
            <button
              type="button"
              onClick={() => onGoToStep(4)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <p className="text-xs text-zinc-600 font-normal" dir="auto">
            {formValues.hasPdf || formValues.pdfFile || formValues.pdfTitle
              ? `${pdfName} · ${pdfSize} — ${formValues.title || "Lesson Material"}`
              : "No PDF resource attached"}
          </p>
        </div>

        {/* Card 5: Quiz */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-900">Quiz</h3>
            <button
              type="button"
              onClick={() => onGoToStep(5)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <p className="text-xs text-zinc-600 font-normal" dir="auto">
            {quiz?.title
              ? `${quiz.title} · ${totalQuizQuestions} questions · ${quiz.passingScore || 70}% pass · ${quiz.timeLimit || 15} min ${formValues.title ? "— " + formValues.title : ""}`
              : "Quiz · 10 questions · 70% pass · 15 min"}
          </p>
        </div>

        {/* Card 6: Access & Offline */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-900">
              Access & Offline
            </h3>
            <button
              type="button"
              onClick={() => onGoToStep(6)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <p className="text-xs text-zinc-600 font-normal">
            Free: first video only · Premium: remaining videos · Video download{" "}
            {formValues.allowVideoDownload ? "on" : "off"} · PDF download{" "}
            {formValues.allowPdfDownload ? "on" : "off"}
          </p>
        </div>
      </div>

      {/* Bottom Actions matching Image 5 */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
          >
            <ChevronLeft className="size-3.5 stroke-[2.5]" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => onSubmit("Draft")}
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => onSubmit("Published")}
            disabled={isSubmitting}
            className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5 stroke-[3]" />
            )}
            <span>Publish Lesson</span>
          </button>
        </div>
      </div>
    </div>
  )
}
