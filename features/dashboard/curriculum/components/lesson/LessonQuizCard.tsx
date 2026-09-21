"use client"

import * as React from "react"
import {
  HelpCircle,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LessonQuiz } from "../../types/curriculum.types"

export interface LessonQuizCardProps {
  quiz: LessonQuiz
  onEditQuiz?: () => void
  onRemoveQuiz?: () => void
}

export function LessonQuizCard({
  quiz,
  onEditQuiz,
  onRemoveQuiz,
}: LessonQuizCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
            <HelpCircle className="size-4" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm text-zinc-900">Lesson Quiz</h3>
            <span className="text-xs text-zinc-400">
              Every lesson can have its own quiz.
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border text-brand-green bg-emerald-50/80 border-emerald-200/60">
          <span className="size-1.5 rounded-full bg-brand-green" />
          {quiz.status}
        </span>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Questions */}
        <div className="p-4 rounded-xl border border-zinc-200/70 bg-zinc-50/40 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
            <HelpCircle className="size-3.5 text-zinc-400" />
            <span>Questions</span>
          </div>
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {quiz.questionsCount}
          </span>
        </div>

        {/* Passing Score */}
        <div className="p-4 rounded-xl border border-zinc-200/70 bg-zinc-50/40 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
            <CheckCircle2 className="size-3.5 text-zinc-400" />
            <span>Passing Score</span>
          </div>
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {quiz.passingScore}
          </span>
        </div>

        {/* Time Limit */}
        <div className="p-4 rounded-xl border border-zinc-200/70 bg-zinc-50/40 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
            <Clock className="size-3.5 text-zinc-400" />
            <span>Time Limit</span>
          </div>
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {quiz.timeLimit}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-9 px-3.5 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
        >
          <Eye className="size-3.5 text-zinc-500" />
          <span>Preview Quiz</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onEditQuiz}
          className="h-9 px-3.5 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
        >
          <Pencil className="size-3.5 text-zinc-500" />
          <span>Edit Quiz</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onRemoveQuiz}
          className="h-9 px-3.5 rounded-xl border-zinc-200/80 bg-white text-red-600 hover:text-red-700 text-xs font-medium hover:bg-red-50 shadow-2xs gap-1.5 cursor-pointer"
        >
          <Trash2 className="size-3.5 text-red-500" />
          <span>Remove Quiz</span>
        </Button>
      </div>
    </div>
  )
}
