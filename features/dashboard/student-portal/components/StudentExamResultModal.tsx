"use client"

import * as React from "react"
import {
  X,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useStudentExamResult } from "../hooks/useStudentPortal"
import { StudentExamResultResponse } from "../types/studentApi.types"

interface StudentExamResultModalProps {
  examId: string | null
  isOpen: boolean
  onClose: () => void
  initialResult?: StudentExamResultResponse | null
}

export function StudentExamResultModal({
  examId,
  isOpen,
  onClose,
  initialResult,
}: StudentExamResultModalProps) {
  const [expandedQuestions, setExpandedQuestions] = React.useState<
    Record<string, boolean>
  >({})

  const { data, isLoading, isError, refetch } = useStudentExamResult(
    examId || "",
    isOpen
  )

  if (!isOpen || !examId) return null

  const payload = data || initialResult
  const resultObj = payload?.result || payload
  const examObj = payload?.exam

  const score = resultObj?.earnedPoints ?? resultObj?.score ?? 0
  const totalPoints = examObj?.totalPoints ?? payload?.totalPoints ?? 100
  const pct =
    payload?.percentage ??
    (totalPoints > 0 ? Math.round((score / totalPoints) * 100) : resultObj?.score ?? 0)
  const correctCount = resultObj?.correctAnswers ?? 0
  const wrongCount = resultObj?.wrongAnswers ?? 0
  const completionMinutes = resultObj?.completionMinutes ?? 0
  const attempts = resultObj?.attempts ?? 1
  const statusText = resultObj?.status || (pct >= 50 ? "Passed" : "Failed")
  const isPassed =
    payload?.passed ??
    (statusText.toLowerCase().includes("pass") || pct >= (examObj?.passingScore ?? 50))

  const completedAtFormatted = resultObj?.completedAt
    ? new Date(resultObj.completedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Submitted"

  const answers = payload?.answers || []

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-zinc-200/80">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-orange text-white">
              Exam Results & Review
            </span>
            {examObj?.subjects && examObj.subjects.length > 0 && (
              <span className="text-xs font-semibold text-zinc-500">
                • {examObj.subjects.join(", ")}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center cursor-pointer"
            aria-label="Close result modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 bg-zinc-50/30">
          {isLoading && !payload ? (
            <div className="p-14 flex flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-brand-orange" />
              <p className="text-xs font-semibold text-zinc-500">
                Loading assessment result...
              </p>
            </div>
          ) : isError && !payload ? (
            <div className="p-10 text-center flex flex-col items-center gap-3">
              <AlertCircle className="size-10 text-rose-500" />
              <h3 className="text-base font-bold text-zinc-900">
                Could not fetch exam result
              </h3>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:brightness-105 cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Score Hero Card */}
              <div
                className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-white shadow-md ${
                  isPassed
                    ? "bg-gradient-to-br from-emerald-700 to-teal-900 border-emerald-600"
                    : "bg-gradient-to-br from-rose-700 to-red-900 border-rose-600"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <Award className="size-8 text-amber-300" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white w-fit">
                      {statusText}
                    </span>
                    <h2 className="text-lg font-extrabold leading-tight">
                      {examObj?.title || "Examination Result"}
                    </h2>
                    <span className="text-xs text-white/80">
                      Attempts Used: {attempts} • Completed: {completedAtFormatted}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end bg-black/25 px-5 py-4 rounded-2xl border border-white/10 shrink-0">
                  <span className="text-xs text-white/75">Final Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold">{score}</span>
                    <span className="text-sm opacity-75">/ {totalPoints}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-300">{pct}% Grade</span>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-zinc-400">Correct Answers</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> {correctCount} Questions
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-zinc-400">Wrong Answers</span>
                  <span className="font-bold text-rose-600 flex items-center gap-1">
                    <XCircle className="size-3.5" /> {wrongCount} Questions
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-zinc-400">Completion Time</span>
                  <span className="font-bold text-zinc-800 flex items-center gap-1">
                    <Clock className="size-3.5 text-brand-orange" /> {completionMinutes} mins
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-zinc-400">Submission Date</span>
                  <span className="font-bold text-zinc-800">{completedAtFormatted}</span>
                </div>
              </div>

              {/* Question-by-Question Review (when provided by backend) */}
              {answers.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Question-by-Question Review ({answers.length})
                  </h3>

                  {answers.map((ans, idx) => {
                    const isExpanded = !!expandedQuestions[ans.questionId]
                    return (
                      <div
                        key={ans.questionId}
                        className="p-4 rounded-2xl border border-zinc-200/80 bg-white flex flex-col gap-3"
                      >
                        <div
                          onClick={() => toggleQuestion(ans.questionId)}
                          className="flex items-center justify-between cursor-pointer gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`size-6 rounded-lg text-white text-xs font-bold flex items-center justify-center shrink-0 ${
                                ans.isCorrect ? "bg-emerald-600" : "bg-rose-600"
                              }`}
                            >
                              {ans.order || idx + 1}
                            </span>
                            <span className="text-xs font-bold text-zinc-800 truncate">
                              {ans.questionText || `Question ${idx + 1}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ans.isCorrect
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {ans.isCorrect ? "Correct" : "Incorrect"}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="size-4 text-zinc-400" />
                            ) : (
                              <ChevronDown className="size-4 text-zinc-400" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2 text-xs">
                            <p className="text-zinc-800 font-medium">
                              {ans.questionText}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                                <span className="text-[10px] font-bold uppercase text-zinc-400 block">
                                  Your Answer
                                </span>
                                <span className="font-bold text-zinc-900">
                                  {ans.submittedAnswer || "No answer"}
                                </span>
                              </div>
                              {ans.correctAnswerText && (
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                                    Correct Answer
                                  </span>
                                  <span className="font-bold text-emerald-950">
                                    {ans.correctAnswerText}
                                  </span>
                                </div>
                              )}
                            </div>
                            {ans.explanation && (
                              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600">
                                <span className="font-bold text-zinc-900">
                                  Explanation:{" "}
                                </span>
                                {ans.explanation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-zinc-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
