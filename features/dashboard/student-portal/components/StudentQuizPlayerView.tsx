"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Send,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Layers,
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import {
  useStudentQuiz,
  useStudentLessonQuiz,
  useStudentQuizDetail,
  useStudentQuizResult,
  useSubmitStudentQuizAttempt,
  useNextStudentQuizGroup,
} from "../hooks/useStudentPortal"
import { StudentQuizResultResponse } from "../types/studentApi.types"

interface StudentQuizPlayerViewProps {
  quizId: string
}

export function StudentQuizPlayerView({ quizId }: StudentQuizPlayerViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const lessonId = searchParams.get("lessonId") || ""
  const subjectId = searchParams.get("subjectId") || ""
  const courseId = searchParams.get("courseId") || ""
  const initialView = searchParams.get("view") === "result" ? "result" : "take"

  const [mode, setMode] = React.useState<"take" | "result">(initialView)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [timeLeftSeconds, setTimeLeftSeconds] = React.useState(900)
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [submittedResult, setSubmittedResult] =
    React.useState<StudentQuizResultResponse | null>(null)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const {
    data: quizData,
    isLoading: isQuizLoading,
    isError: isQuizError,
    refetch: refetchQuiz,
  } = useStudentQuiz(quizId)

  const { data: lessonQuizData } = useStudentLessonQuiz(lessonId)
  const { data: quizDetailData } = useStudentQuizDetail(quizId)

  const {
    data: fetchedResult,
    isLoading: isResultLoading,
    refetch: refetchResult,
  } = useStudentQuizResult(quizId, mode === "result")

  const submitMutation = useSubmitStudentQuizAttempt(quizId)
  const nextGroupMutation = useNextStudentQuizGroup(quizId)

  const quiz = quizData || lessonQuizData
  const questions = React.useMemo(
    () =>
      [...(quiz?.questions || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [quiz?.questions]
  )
  const groups = quiz?.groups || quizDetailData?.groups || []

  // Initialize countdown from timeLimitMinutes
  React.useEffect(() => {
    if (quiz?.timeLimitMinutes && mode === "take") {
      setTimeLeftSeconds(quiz.timeLimitMinutes * 60)
      setElapsedSeconds(0)
    }
  }, [quiz?.timeLimitMinutes, quiz?.groupId, mode])

  // Countdown timer
  React.useEffect(() => {
    if (mode !== "take" || !quiz) return
    const interval = setInterval(() => {
      setElapsedSeconds((e) => e + 1)
      setTimeLeftSeconds((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [mode, quiz])

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const backHref = React.useMemo(() => {
    if (subjectId && lessonId) return `/student/subjects/${subjectId}/lessons/${lessonId}`
    if (courseId && lessonId) return `/student/courses/${courseId}/lessons/${lessonId}`
    if (subjectId) return `/student/subjects/${subjectId}`
    return "/student/subjects"
  }, [subjectId, courseId, lessonId])

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const answeredCount = Object.keys(answers).filter((k) => !!answers[k]).length
  const unansweredCount = Math.max(0, questions.length - answeredCount)

  const handleSubmitAttempt = async () => {
    setSubmitError(null)
    setShowConfirm(false)
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q.id,
          answer: answers[q.id] || "",
        })),
        timeSpentSeconds: elapsedSeconds,
      }
      const res = await submitMutation.mutateAsync(payload)
      if (res?.attempt) {
        setSubmittedResult(res)
      }
      setMode("result")
      await refetchResult()
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ||
          "Failed to submit quiz attempt. Please try again."
      )
    }
  }

  const handleNextGroup = async (currentGroupId: string) => {
    try {
      await nextGroupMutation.mutateAsync(currentGroupId)
      setAnswers({})
      setCurrentIndex(0)
      setSubmittedResult(null)
      setMode("take")
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message || "Unable to load next quiz group."
      )
    }
  }

  const handleRetake = () => {
    setAnswers({})
    setCurrentIndex(0)
    setSubmittedResult(null)
    setMode("take")
  }

  const activeResult = fetchedResult || submittedResult
  const currentQuestion = questions[currentIndex]

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={quiz?.title || quizDetailData?.title || "Lesson Quiz"}
        description={
          quiz?.groupName
            ? `Group ${quiz.groupOrder || 1}: ${quiz.groupName} • Passing Score: ${
                quiz.passingScore
              }%`
            : "Interactive assessment and instant score evaluation"
        }
      />

      <main className="p-6 md:p-8 max-w-6xl w-full mx-auto flex flex-col gap-6 pb-16">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
            <span>Back to Lesson</span>
          </button>

          <div className="flex items-center gap-2">
            {mode === "take" && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold border ${
                  timeLeftSeconds < 120
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
              onClick={() => setMode(mode === "take" ? "result" : "take")}
              className="px-4 py-2 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              {mode === "take" ? "View Previous Result" : "Switch to Quiz Questions"}
            </button>
          </div>
        </div>

        {/* Quiz Groups Strip */}
        {groups.length > 0 && (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-zinc-500 mr-1">Groups:</span>
            {groups.map((grp) => {
              const isCurrent = grp.id === quiz?.groupId
              return (
                <div
                  key={grp.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                    isCurrent
                      ? "bg-brand-orange text-white border-brand-orange"
                      : grp.hasPassed
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200"
                  }`}
                >
                  <span>
                    {grp.order}. {grp.name}
                  </span>
                  {grp.hasPassed && <CheckCircle2 className="size-3.5" />}
                </div>
              )
            })}
          </div>
        )}

        {submitError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* MODE 1: TAKING THE QUIZ */}
        {mode === "take" && (
          <>
            {isQuizLoading ? (
              <div className="p-16 rounded-3xl bg-white border border-zinc-200/80 flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 animate-spin text-brand-orange" />
                <p className="text-xs font-semibold text-zinc-500">
                  Loading quiz questions...
                </p>
              </div>
            ) : isQuizError ? (
              <div className="p-10 rounded-3xl bg-white border border-rose-200 text-center flex flex-col items-center gap-3">
                <AlertCircle className="size-10 text-rose-500" />
                <h3 className="text-base font-bold text-zinc-900">
                  Could not load quiz
                </h3>
                <button
                  type="button"
                  onClick={() => refetchQuiz()}
                  className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:brightness-105 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : questions.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-zinc-200 text-center flex flex-col items-center gap-3">
                <HelpCircle className="size-10 text-zinc-300" />
                <h3 className="text-sm font-bold text-zinc-800">
                  No questions found in this quiz group
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Question Card */}
                <div className="lg:col-span-3 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/60">
                        Question {currentIndex + 1} of {questions.length}
                      </span>
                      <span className="text-xs text-zinc-500 font-semibold">
                        {answeredCount} / {questions.length} Answered
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70">
                      <h3 className="text-base font-bold text-zinc-900 leading-relaxed">
                        {currentQuestion?.questionText}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-3">
                      {currentQuestion?.options?.map((opt, idx) => {
                        const isSelected = answers[currentQuestion.id] === opt
                        const letter = String.fromCharCode(65 + idx)
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectOption(currentQuestion.id, opt)}
                            className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left text-sm font-medium transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-50 border-brand-orange ring-2 ring-brand-orange/20 text-zinc-950 font-bold"
                                : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                            }`}
                          >
                            <span
                              className={`size-8 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                                isSelected
                                  ? "bg-brand-orange text-white"
                                  : "bg-zinc-100 text-zinc-600"
                              }`}
                            >
                              {letter}
                            </span>
                            <span className="flex-1">{opt}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                      disabled={currentIndex === 0}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="size-4" />
                      <span>Previous</span>
                    </button>

                    {currentIndex < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
                        }
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs cursor-pointer"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="size-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        disabled={submitMutation.isPending}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs cursor-pointer"
                      >
                        <Send className="size-3.5" />
                        <span>
                          {submitMutation.isPending ? "Submitting..." : "Submit Quiz"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Navigator Sidebar */}
                <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4 h-fit">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Question Navigator
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => {
                      const isCur = idx === currentIndex
                      const isAns = !!answers[q.id]
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          className={`size-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                            isCur
                              ? "bg-brand-orange text-white ring-2 ring-brand-orange/30"
                              : isAns
                              ? "bg-emerald-600 text-white"
                              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    disabled={submitMutation.isPending}
                    className="w-full py-2.5 px-4 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Finish & Submit</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* MODE 2: QUIZ RESULT VIEW */}
        {mode === "result" && (
          <>
            {isResultLoading && !activeResult ? (
              <div className="p-16 rounded-3xl bg-white border border-zinc-200/80 flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 animate-spin text-brand-orange" />
                <p className="text-xs font-semibold text-zinc-500">
                  Loading quiz result...
                </p>
              </div>
            ) : !activeResult?.attempt ? (
              <div className="p-12 rounded-3xl bg-white border border-zinc-200 text-center flex flex-col items-center gap-4">
                <Award className="size-12 text-brand-orange" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-zinc-900">
                    No Completed Attempt Yet
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Complete and submit the quiz to view your score and answer explanations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode("take")}
                  className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:brightness-105 cursor-pointer"
                >
                  Start Quiz Now
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Hero Result Summary */}
                <div
                  className={`p-7 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    activeResult.attempt.passed
                      ? "bg-gradient-to-br from-emerald-700 to-teal-900"
                      : "bg-gradient-to-br from-rose-700 to-red-900"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                      <Award className="size-8 text-amber-300" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 w-fit">
                        {activeResult.attempt.passed ? "PASSED" : "NEEDS REVIEW"}
                      </span>
                      <h2 className="text-xl font-extrabold">
                        {activeResult.attempt.title || quiz?.title}
                      </h2>
                      <span className="text-xs text-white/80">
                        {activeResult.attempt.groupName} • Passing Score:{" "}
                        {activeResult.attempt.passingScore}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 bg-black/20 px-6 py-4 rounded-2xl border border-white/10">
                    <div className="text-center">
                      <span className="text-xs text-white/75 block">Score</span>
                      <span className="text-3xl font-extrabold text-amber-300">
                        {activeResult.attempt.percentage}%
                      </span>
                    </div>
                    <div className="h-10 w-px bg-white/20" />
                    <div className="text-xs flex flex-col gap-1">
                      <span className="text-emerald-200 font-bold">
                        Correct: {activeResult.attempt.correctAnswers} /{" "}
                        {activeResult.attempt.totalQuestions}
                      </span>
                      <span className="text-rose-200 font-bold">
                        Wrong: {activeResult.attempt.wrongAnswers}
                      </span>
                      <span className="text-white/80">
                        Attempts: {activeResult.attempt.attempts}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Group / Retake Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
                  {activeResult.placement ? (
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <Layers className="size-4 text-brand-orange" />
                      <span className="font-bold text-zinc-800">
                        {activeResult.placement.subject.name}
                      </span>
                      <span>•</span>
                      <span>{activeResult.placement.chapter.name}</span>
                      <span>•</span>
                      <span>{activeResult.placement.unit.name}</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Retake Group</span>
                    </button>

                    {activeResult.attempt.hasMoreGroups &&
                      activeResult.attempt.nextGroupId && (
                        <button
                          type="button"
                          disabled={nextGroupMutation.isPending}
                          onClick={() =>
                            handleNextGroup(activeResult.attempt.quizGroupId)
                          }
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold shadow-2xs cursor-pointer"
                        >
                          <span>
                            {nextGroupMutation.isPending
                              ? "Loading Next Group..."
                              : "Proceed to Next Group"}
                          </span>
                          <ArrowRight className="size-4" />
                        </button>
                      )}
                  </div>
                </div>

                {/* Detailed Answer Review */}
                {activeResult.answers && activeResult.answers.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-extrabold text-zinc-900">
                      Answer Review & Explanations ({activeResult.answers.length})
                    </h3>
                    {activeResult.answers.map((ans, idx) => (
                      <div
                        key={ans.questionId}
                        className={`p-5 rounded-2xl bg-white border shadow-2xs flex flex-col gap-3 ${
                          ans.isCorrect ? "border-emerald-200" : "border-rose-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`size-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                ans.isCorrect
                                  ? "bg-emerald-600 text-white"
                                  : "bg-rose-600 text-white"
                              }`}
                            >
                              {ans.order || idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-zinc-900">
                              {ans.questionText}
                            </h4>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                              ans.isCorrect
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {ans.isCorrect ? (
                              <>
                                <CheckCircle2 className="size-3" /> Correct
                              </>
                            ) : (
                              <>
                                <XCircle className="size-3" /> Incorrect
                              </>
                            )}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div
                            className={`p-3 rounded-xl border ${
                              ans.isCorrect
                                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                : "bg-rose-50 border-rose-200 text-rose-900"
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase block opacity-75">
                              Your Answer
                            </span>
                            <span className="font-bold">
                              {ans.submittedAnswer || "No answer submitted"}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                            <span className="text-[10px] font-bold uppercase block opacity-75">
                              Correct Answer
                            </span>
                            <span className="font-bold">{ans.correctAnswerText}</span>
                          </div>
                        </div>

                        {ans.explanation && (
                          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700">
                            <span className="font-bold text-zinc-900">Explanation: </span>
                            {ans.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Submit Confirmation Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center">
              <div className="size-14 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center mx-auto">
                <AlertTriangle className="size-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-zinc-900">Submit Quiz?</h3>
                <p className="text-xs text-zinc-500">
                  You answered {answeredCount} out of {questions.length} questions.
                  {unansweredCount > 0 && (
                    <span className="block text-rose-600 font-semibold mt-1">
                      {unansweredCount} questions are still unanswered.
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer"
                >
                  Review Answers
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAttempt}
                  className="flex-1 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs cursor-pointer"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
