"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { LessonQuizData } from "../../types/lesson.types"

export interface ExamPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  quiz: LessonQuizData
  subjectName?: string
}

export function ExamPreviewModal({
  isOpen,
  onClose,
  quiz,
  subjectName = "Mathematics Fundamentals",
}: ExamPreviewModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null)

  if (!isOpen) return null

  const questions =
    quiz.questions && quiz.questions.length > 0
      ? quiz.questions
      : [
          {
            id: "q-default",
            text: "عندك كام سنه؟",
            type: "Multiple Choice" as const,
            points: 2,
            required: true,
            options: [
              { id: "opt-1", text: "34", isCorrect: true },
              { id: "opt-2", text: "23", isCorrect: false },
              { id: "opt-3", text: "22", isCorrect: false },
            ],
          },
        ]

  const currentQ = questions[Math.min(currentIndex, questions.length - 1)]
  const totalQuestions = questions.length
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100)

  const optionLetters = ["A", "B", "C", "D", "E", "F"]

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="min-h-screen w-full flex flex-col bg-[#F8F9FA]">
        {/* Top Navbar matching Image 3 */}
        <div className="w-full bg-white border-b border-zinc-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4 text-zinc-500" />
            <span>Back</span>
          </button>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200/60 shadow-2xs">
            Student Preview · Read-only
          </span>
        </div>

        {/* Content Container */}
        <div className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-10 flex flex-col gap-6">
          {/* Header section matching Image 3 */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-400">
              {subjectName || "Mathematics Fundamentals"}
            </span>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight" dir="auto">
              {quiz.title || "الرياضه"}
            </h1>
            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
              <span>{totalQuestions} questions</span>
              <span>•</span>
              <span>{quiz.timeLimit || 30} min</span>
              <span>•</span>
              <span>Passing score {quiz.passingScore || 60}%</span>
            </div>
          </div>

          {/* Progress Bar matching Image 3 */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-600">
              <span>
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F59E0B] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Card matching Image 3 */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col gap-5">
            {/* Question Meta */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                {currentQ.type.toUpperCase()} · {currentQ.points} PTS
              </span>
              {currentQ.required && (
                <span className="text-xs text-zinc-400 font-medium">Required</span>
              )}
            </div>

            {/* Question Title */}
            <h2 className="text-lg font-bold text-zinc-900 leading-snug" dir="auto">
              {currentQ.text || "Untitled Question"}
            </h2>

            {/* Options List */}
            <div className="flex flex-col gap-3 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedOptionId === option.id
                const letter = optionLetters[optIdx] || `${optIdx + 1}`

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#F59E0B] bg-amber-50/40 ring-1 ring-[#F59E0B]/30"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <span
                      className={`size-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#F59E0B] text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {letter}
                    </span>
                    <span
                      className={`text-xs font-medium leading-relaxed ${
                        isSelected ? "text-zinc-900 font-semibold" : "text-zinc-700"
                      }`}
                      dir="auto"
                    >
                      {option.text || `Option ${optIdx + 1}`}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Stepper Navigation Footer matching Image 3 */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex((prev) => Math.max(0, prev - 1))
                setSelectedOptionId(null)
              }}
              className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <ChevronLeft className="size-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={currentIndex === totalQuestions - 1}
              onClick={() => {
                setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                setSelectedOptionId(null)
              }}
              className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <span>Next</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
