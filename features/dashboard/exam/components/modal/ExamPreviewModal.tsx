"use client"

import * as React from "react"
import { X, Clock, HelpCircle, Award, CheckCircle2 } from "lucide-react"
import { ExamItem } from "../../types/exam.types"
import { ExamLevelBadge, ExamTypeBadge } from "../common/ExamBadges"

interface ExamPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  exam: ExamItem
}

export function ExamPreviewModal({
  isOpen,
  onClose,
  exam,
}: ExamPreviewModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/80 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-zinc-900">
              Exam Preview (Student View)
            </h2>
            <ExamTypeBadge type={exam.type} />
            <ExamLevelBadge level={exam.level} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Exam Summary Header Banner */}
          <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-zinc-900">{exam.title}</h1>
              <p className="text-xs text-zinc-500">
                {exam.subject} · {exam.educationStage} · {exam.academicYear}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-700">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-zinc-200/80 shadow-2xs">
                <Clock className="size-3.5 text-amber-600" />
                <span>{exam.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-zinc-200/80 shadow-2xs">
                <HelpCircle className="size-3.5 text-amber-600" />
                <span>{exam.questionsCount} Questions</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-zinc-200/80 shadow-2xs">
                <Award className="size-3.5 text-amber-600" />
                <span>{exam.totalPoints} Points</span>
              </div>
            </div>
          </div>

          {/* Sample Questions List */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-bold text-zinc-900">
              Questions ({exam.questions.length || exam.questionsCount})
            </h3>

            {exam.questions.map((q) => (
              <div
                key={q.id}
                className="bg-zinc-50/60 rounded-xl border border-zinc-200/80 p-5 flex flex-col gap-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">
                    Question {q.number}
                  </span>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                    {q.points} Points
                  </span>
                </div>

                <p className="text-sm font-semibold text-zinc-900">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {q.options.map((opt) => {
                    const isCorrect = opt.key === q.correctAnswer
                    return (
                      <div
                        key={opt.key}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                          isCorrect
                            ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                            : "bg-white border-zinc-200 text-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-500">
                            {opt.key}.
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isCorrect && (
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
