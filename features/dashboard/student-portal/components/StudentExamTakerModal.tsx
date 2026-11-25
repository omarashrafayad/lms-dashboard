"use client"

import * as React from "react"
import {
  X,
  Clock,
  AlertTriangle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  FileCheck,
  AlertCircle,
  Loader2,
  Eye,
  Lock,
} from "lucide-react"
import { useStudentExam, useSubmitStudentExamAttempt } from "../hooks/useStudentPortal"
import { StudentExamQuestion, StudentExamResultResponse } from "../types/studentApi.types"

interface StudentExamTakerModalProps {
  examId: string | null
  isOpen: boolean
  onClose: () => void
  onSubmitExam: (examId: string, result?: StudentExamResultResponse) => void
  onViewResult?: (examId: string) => void
}

export function StudentExamTakerModal({
  examId,
  isOpen,
  onClose,
  onSubmitExam,
  onViewResult,
}: StudentExamTakerModalProps) {
  const { data, isLoading, isError, refetch } = useStudentExam(examId || "")
  const submitMutation = useSubmitStudentExamAttempt(examId || "")

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [flagged, setFlagged] = React.useState<Record<string, boolean>>({})
  const [timeLeftSeconds, setTimeLeftSeconds] = React.useState(3600)
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0)
  const [showConfirmSubmit, setShowConfirmSubmit] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const exam = data?.exam
  const access = data?.access
  const questions: StudentExamQuestion[] = React.useMemo(
    () => [...(data?.questions || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [data?.questions]
  )

  React.useEffect(() => {
    if (isOpen && examId) {
      setCurrentQuestionIndex(0)
      setAnswers({})
      setFlagged({})
      setElapsedSeconds(0)
      setSubmitError(null)
      setShowConfirmSubmit(false)
    }
  }, [isOpen, examId])

  React.useEffect(() => {
    if (exam?.durationMinutes) {
      setTimeLeftSeconds(exam.durationMinutes * 60)
    }
  }, [exam?.durationMinutes])

  React.useEffect(() => {
    if (!isOpen || !exam || access?.canAttempt === false) return
    const timer = setInterval(() => {
      setElapsedSeconds((e) => e + 1)
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isOpen, exam, access?.canAttempt])

  if (!isOpen || !examId) return null

  const currentQuestion = questions[currentQuestionIndex]

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }))
  }

  const handleTextAnswer = (text: string) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: text }))
  }

  const toggleFlag = () => {
    if (!currentQuestion) return
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }))
  }

  const answeredCount = Object.keys(answers).filter((k) => !!answers[k]).length
  const unansweredCount = Math.max(0, questions.length - answeredCount)

  const handleConfirmSubmit = async () => {
    setShowConfirmSubmit(false)
    setSubmitError(null)
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q.id,
          answer: answers[q.id] || "",
        })),
        timeSpentSeconds: elapsedSeconds,
      }
      const res = await submitMutation.mutateAsync(payload)
      onSubmitExam(examId, res)
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ||
          "Failed to submit exam attempt. Please verify your connection and retry."
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-zinc-200/80">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/90">
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2.5 rounded-xl bg-brand-orange text-white shadow-2xs shrink-0">
              <FileCheck className="size-5" />
            </span>
            <div className="flex flex-col min-w-0">
              <h2 className="text-base font-extrabold text-zinc-900 truncate">
                {exam?.title || "Assessment Session"}
              </h2>
              <span className="text-xs text-zinc-500 truncate">
                {exam?.subjects?.join(", ")} • {exam?.level} • Total Marks:{" "}
                {exam?.totalPoints || 0} pts
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {access?.canAttempt !== false && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold border ${
                  timeLeftSeconds < 300
                    ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse"
                    : "bg-white text-zinc-900 border-zinc-200"
                }`}
              >
                <Clock className="size-4 text-brand-orange" />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="size-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Submit Error Banner */}
        {submitError && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Content Body */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-brand-orange" />
            <p className="text-xs font-semibold text-zinc-500">
              Preparing examination questions...
            </p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <AlertCircle className="size-10 text-rose-500" />
            <h3 className="text-base font-bold text-zinc-900">
              Could not load examination
            </h3>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:brightness-105 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : access && !access.canAttempt ? (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center">
              <Lock className="size-8" />
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <h3 className="text-lg font-extrabold text-zinc-900">
                Assessment Closed or Attempts Exhausted
              </h3>
              <p className="text-xs text-zinc-500">
                {access.closedReason ||
                  `You have used ${access.attemptsUsed} attempt(s). Remaining attempts: ${access.remainingAttempts}.`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              {onViewResult && (
                <button
                  type="button"
                  onClick={() => onViewResult(examId)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold cursor-pointer"
                >
                  <Eye className="size-4" />
                  <span>View My Result</span>
                </button>
              )}
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            No questions available for this assessment.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-zinc-50/40">
            {/* Left 3 Cols */}
            <div className="lg:col-span-3 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/60">
                    Question {currentQuestionIndex + 1} of {questions.length} •{" "}
                    {currentQuestion?.points || 0} Points
                  </span>

                  <button
                    type="button"
                    onClick={toggleFlag}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      flagged[currentQuestion?.id]
                        ? "bg-brand-orange text-white"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white"
                    }`}
                  >
                    <Flag className="size-3.5" />
                    <span>
                      {flagged[currentQuestion?.id]
                        ? "Flagged for Review"
                        : "Flag Question"}
                    </span>
                  </button>
                </div>

                {/* Question Text */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <h3 className="text-sm md:text-base font-bold text-zinc-900 leading-relaxed">
                    {currentQuestion?.questionText}
                  </h3>
                </div>

                {/* Options */}
                {currentQuestion?.options && currentQuestion.options.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = answers[currentQuestion.id] === option
                      const letter = String.fromCharCode(65 + idx)

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(option)}
                          className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left text-xs md:text-sm font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-50 border-brand-orange ring-2 ring-brand-orange/20 text-zinc-950 font-bold shadow-2xs"
                              : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                          }`}
                        >
                          <span
                            className={`size-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                              isSelected
                                ? "bg-brand-orange text-white"
                                : "bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="flex-1">{option}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-zinc-600">
                      Write your detailed answer:
                    </label>
                    <textarea
                      rows={5}
                      value={answers[currentQuestion?.id] || ""}
                      onChange={(e) => handleTextAnswer(e.target.value)}
                      placeholder="Type your response here..."
                      className="w-full p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs md:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuestionIndex((i) => Math.min(questions.length - 1, i + 1))
                    }
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitMutation.isPending}
                    onClick={() => setShowConfirmSubmit(true)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>
                      {submitMutation.isPending ? "Submitting..." : "Submit Assessment"}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Right 1 Col: Navigator */}
            <div className="flex flex-col gap-4 p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs h-fit">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Question Navigator
              </h4>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex
                  const isAnswered = !!answers[q.id]
                  const isFlag = !!flagged[q.id]

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`relative size-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-brand-orange text-white ring-2 ring-brand-orange/30 shadow-2xs"
                          : isAnswered
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                        }`}
                    >
                      {idx + 1}
                      {isFlag && (
                        <span className="absolute -top-1 -right-1 size-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-zinc-200 text-xs">
                <div className="flex items-center justify-between text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-emerald-600" />
                    Answered
                  </span>
                  <span className="font-bold">{answeredCount}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-zinc-300" />
                    Unanswered
                  </span>
                  <span className="font-bold">{unansweredCount}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-amber-500" />
                    Flagged
                  </span>
                  <span className="font-bold">
                    {Object.values(flagged).filter(Boolean).length}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={submitMutation.isPending}
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full mt-2 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="size-3.5" />
                <span>
                  {submitMutation.isPending ? "Submitting..." : "Finish & Submit"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center">
              <div className="size-14 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center mx-auto">
                <AlertTriangle className="size-7" />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-zinc-900">
                  Submit Examination?
                </h3>
                <p className="text-xs text-zinc-500">
                  You have answered {answeredCount} out of {questions.length} questions.
                  {unansweredCount > 0 && (
                    <span className="text-rose-600 font-semibold block mt-1">
                      Warning: {unansweredCount} questions are still unanswered.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer"
                >
                  Return to Questions
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
