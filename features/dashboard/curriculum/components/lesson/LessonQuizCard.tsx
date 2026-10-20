"use client"

import * as React from "react"
import {
  HelpCircle,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LessonQuiz } from "../../types/curriculum.types"
import { AddQuizModal } from "./AddQuizModal"
import { EditQuizModal } from "./EditQuizModal"
import { useLessonQuizzes, useDeleteQuiz } from "../../hooks/useCurriculum"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export interface LessonQuizCardProps {
  lessonId?: string
  quiz?: LessonQuiz | null
  onEditQuiz?: () => void
  onRemoveQuiz?: () => void
}

export function LessonQuizCard({
  lessonId,
  quiz: fallbackQuiz,
  onEditQuiz,
  onRemoveQuiz,
}: LessonQuizCardProps) {
  const { data: serverQuizzes = [], isLoading } = useLessonQuizzes(lessonId)
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const deleteQuizMutation = useDeleteQuiz()

  // Primary quiz from server or fallback prop
  const currentQuiz: any =
    serverQuizzes && serverQuizzes.length > 0
      ? serverQuizzes[0]
      : fallbackQuiz || null

  const handleRemove = async () => {
    if (currentQuiz?.id && lessonId) {
      try {
        await deleteQuizMutation.mutateAsync({ quizId: currentQuiz.id, lessonId })
        toast.success("Quiz removed successfully!!")
      } catch (err: unknown) {
        toast.error(getErrorMessage(err))
      }
    }
    onRemoveQuiz?.()
  }

  const statusLabel =
    currentQuiz?.status ||
    (currentQuiz?.isPublished !== undefined
      ? currentQuiz.isPublished
        ? "Active"
        : "Draft"
      : "Active")

  const passingScoreText =
    currentQuiz?.passingScore !== undefined
      ? typeof currentQuiz.passingScore === "number"
        ? `${currentQuiz.passingScore}%`
        : currentQuiz.passingScore
      : "70%"

  const timeLimitText =
    currentQuiz?.timeLimit !== undefined
      ? typeof currentQuiz.timeLimit === "number"
        ? `${currentQuiz.timeLimit} mins`
        : currentQuiz.timeLimit
      : "15 mins"

  const questionsCount = currentQuiz?.questionsCount ?? 0

  return (
    <>
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
              <HelpCircle className="size-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-sm text-zinc-900">
                {currentQuiz?.title || "Lesson Quiz"}
              </h3>
              <span className="text-xs text-zinc-400">
                Every lesson can have its own assessment quiz.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentQuiz && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border text-brand-green bg-emerald-50/80 border-emerald-200/60">
                <span className="size-1.5 rounded-full bg-brand-green" />
                {statusLabel}
              </span>
            )}

            {lessonId && !currentQuiz && (
              <Button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer"
              >
                <Plus className="size-3.5 stroke-[2.5]" />
                <span>Add Quiz</span>
              </Button>
            )}
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="size-5 text-brand-orange animate-spin" />
          </div>
        ) : !currentQuiz ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/40 p-8 flex flex-col items-center justify-center gap-2 text-center">
            <span className="text-xs text-zinc-400">
              No quiz created for this lesson yet.
            </span>
            {lessonId && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs font-semibold text-brand-orange hover:underline cursor-pointer"
              >
                Create a Quiz
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 3 Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Questions */}
              <div className="p-4 rounded-xl border border-zinc-200/70 bg-zinc-50/40 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                  <HelpCircle className="size-3.5 text-zinc-400" />
                  <span>Questions</span>
                </div>
                <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                  {questionsCount}
                </span>
              </div>

              {/* Passing Score */}
              <div className="p-4 rounded-xl border border-zinc-200/70 bg-zinc-50/40 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                  <CheckCircle2 className="size-3.5 text-zinc-400" />
                  <span>Passing Score</span>
                </div>
                <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                  {passingScoreText}
                </span>
              </div>

              {/* Time Limit */}
              <div className="p-4 rounded-xl border border-zinc-200/70 bg-zinc-50/40 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                  <Clock className="size-3.5 text-zinc-400" />
                  <span>Time Limit</span>
                </div>
                <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                  {timeLimitText}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onEditQuiz) {
                    onEditQuiz()
                  } else {
                    setIsEditModalOpen(true)
                  }
                }}
                className="h-9 px-3.5 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
              >
                <Pencil className="size-3.5 text-zinc-500" />
                <span>Edit Quiz</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={deleteQuizMutation.isPending}
                onClick={handleRemove}
                className="h-9 px-3.5 rounded-xl border-zinc-200/80 bg-white text-red-600 hover:text-red-700 text-xs font-medium hover:bg-red-50 shadow-2xs gap-1.5 cursor-pointer"
              >
                {deleteQuizMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin text-red-500" />
                ) : (
                  <Trash2 className="size-3.5 text-red-500" />
                )}
                <span>Remove Quiz</span>
              </Button>
            </div>
          </>
        )}
      </div>

      {lessonId && (
        <AddQuizModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          lessonId={lessonId}
        />
      )}

      {lessonId && currentQuiz?.id && (
        <EditQuizModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          quizId={currentQuiz.id}
          lessonId={lessonId}
        />
      )}
    </>
  )
}
