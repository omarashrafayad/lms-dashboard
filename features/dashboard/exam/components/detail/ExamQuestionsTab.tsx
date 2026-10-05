"use client"

import * as React from "react"
import { Plus, CheckCircle2, Search, HelpCircle } from "lucide-react"
import { ExamItem, ExamQuestionItem } from "../../types/exam.types"
import { ExamLevelBadge } from "../common/ExamBadges"

interface ExamQuestionsTabProps {
  exam: ExamItem
  onAddQuestion?: () => void
}

export function ExamQuestionsTab({
  exam,
  onAddQuestion,
}: ExamQuestionsTabProps) {
  const [search, setSearch] = React.useState("")
  const questions = exam.questions || []

  const filteredQuestions = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.number.toString().includes(search)
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 px-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              TOTAL QUESTIONS
            </span>
            <span className="text-xl font-bold text-zinc-900">
              {exam.questionsCount || questions.length}
            </span>
          </div>

          <div className="h-8 w-px bg-zinc-200" />

          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              TOTAL POINTS
            </span>
            <span className="text-xl font-bold text-zinc-900">
              {exam.totalPoints}
            </span>
          </div>

          <div className="h-8 w-px bg-zinc-200" />

          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              PASSING CRITERIA
            </span>
            <span className="text-xl font-bold text-zinc-900">
              {exam.passingScore}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full h-9 pl-8 pr-3 text-xs bg-zinc-50/70 border border-zinc-200 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={onAddQuestion}
            className="h-9 px-3.5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-12 text-center text-xs text-zinc-500">
            No questions found.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col gap-4 shadow-2xs"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="size-7 rounded-lg bg-amber-50 text-[#D97706] font-bold text-xs flex items-center justify-center border border-amber-200/60">
                    Q{q.number}
                  </span>
                  <ExamLevelBadge level={q.difficulty} />
                  <span className="text-xs text-zinc-500 font-medium">
                    {q.type}
                  </span>
                </div>

                <span className="text-xs font-semibold text-zinc-700 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200/60">
                  {q.points} {q.points === 1 ? "Point" : "Points"}
                </span>
              </div>

              {/* Question Content */}
              <p className="text-sm font-semibold text-zinc-900 leading-relaxed">
                {q.question}
              </p>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((opt) => {
                  const isCorrect = opt.key === q.correctAnswer
                  return (
                    <div
                      key={opt.key}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs transition-colors ${
                        isCorrect
                          ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 font-medium"
                          : "bg-zinc-50/50 border-zinc-200/80 text-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`size-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            isCorrect
                              ? "bg-emerald-600 text-white"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {isCorrect && (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="size-4 text-emerald-600" />
                          <span>Correct</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
