"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { useExamStore } from "@/stores/useExamStore"
import { initialExamsMockData } from "../data/examMockData"
import { ExamQuestionItem } from "../types/exam.types"

interface ExamPreviewPageProps {
  id: string
}

export default function ExamPreviewPage({ id }: ExamPreviewPageProps) {
  const router = useRouter()
  const { getExamByIdOrSlug } = useExamStore()

  const exam = getExamByIdOrSlug(id) || initialExamsMockData[0]

  // Default sample questions if exam.questions is empty
  const defaultQuestions: ExamQuestionItem[] = [
    {
      id: "sq1",
      number: 1,
      question: "Sample question 1",
      type: "Multiple Choice",
      options: [
        { key: "A", text: "Option A" },
        { key: "B", text: "Option B" },
        { key: "C", text: "Option C" },
      ],
      correctAnswer: "A",
      points: 2,
      difficulty: "Beginner",
    },
    {
      id: "sq2",
      number: 2,
      question: "What is the value of 3x + 15 when x = 7?",
      type: "Multiple Choice",
      options: [
        { key: "A", text: "Option A (32)" },
        { key: "B", text: "Option B (36)" },
        { key: "C", text: "Option C (42)" },
      ],
      correctAnswer: "B",
      points: 2,
      difficulty: "Beginner",
    },
  ]

  const questions =
    exam.questions && exam.questions.length > 0
      ? exam.questions
      : defaultQuestions

  const totalQuestions = exam.questionsCount || questions.length
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [selectedAnswers, setSelectedAnswers] = React.useState<
    Record<number, string>
  >({})

  const currentQuestion = questions[currentIdx] || questions[0]
  const questionNumber = currentIdx + 1
  const progressPercent = Math.round((questionNumber / totalQuestions) * 100)

  const handleSelectOption = (key: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: key,
    }))
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top Header Bar matching Image 1 */}
      <header className="w-full flex items-center justify-between px-8 py-5 border-b border-zinc-200/80 bg-white sticky top-0 z-20">
        <button
          type="button"
          onClick={() => router.push(`/academic/exams/${exam.slug || exam.id}`)}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>

        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200/80 shadow-2xs">
          Student Preview · Read-only
        </span>
      </header>

      {/* Main Preview Container */}
      <main className="flex-1 p-6 md:p-10 flex flex-col max-w-3xl w-full mx-auto pb-24">
        {/* Subject Category */}
        <span className="text-xs font-semibold text-zinc-500 mb-1">
          {exam.subject || "Mathematics"}
        </span>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-2">
          {exam.title}
        </h1>

        {/* Meta Stats row */}
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-6">
          <span>{totalQuestions} questions</span>
          <span>{exam.duration}</span>
          <span>Passing score {exam.passingScore}</span>
        </div>

        {/* Question Counter & Progress Percent */}
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 mb-2">
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span>{progressPercent}%</span>
        </div>

        {/* Progress Bar matching Image 1 */}
        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-[#F59E0B] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Card matching Image 1 */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-6 md:p-8 flex flex-col gap-6">
          {/* Card Header: Type · Points & Required */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              {currentQuestion.type?.toUpperCase() || "MULTIPLE CHOICE"} ·{" "}
              {currentQuestion.points || 2} PTS
            </span>
            <span className="text-xs text-zinc-400 font-normal">
              Required
            </span>
          </div>

          {/* Question Statement */}
          <h2 className="text-base md:text-lg font-bold text-zinc-900 leading-snug">
            {currentQuestion.question}
          </h2>

          {/* Options List matching Image 1 */}
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswers[currentIdx] === opt.key

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectOption(opt.key)}
                  className={`w-full flex items-center justify-between p-3.5 px-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-amber-400 bg-amber-50/40 text-zinc-900 shadow-2xs"
                      : "border-zinc-200/90 bg-white hover:border-zinc-300 text-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? "bg-[#F59E0B] text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="text-xs md:text-sm font-medium">
                      {opt.text}
                    </span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="size-4 text-amber-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Previous & Next Controls matching Image 1 */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={handlePrev}
            className={`h-10 px-4 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              currentIdx === 0
                ? "border-zinc-200 bg-white text-zinc-300 cursor-not-allowed"
                : "border-zinc-200/90 bg-white text-zinc-700 hover:bg-zinc-50 shadow-2xs cursor-pointer"
            }`}
          >
            <ChevronLeft className="size-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIdx >= questions.length - 1}
            className={`h-10 px-5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              currentIdx >= questions.length - 1
                ? "border-zinc-200 bg-white text-zinc-400 cursor-not-allowed"
                : "border-zinc-200/90 bg-white text-zinc-800 hover:bg-zinc-50 shadow-2xs cursor-pointer"
            }`}
          >
            <span>Next</span>
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </main>
    </div>
  )
}
