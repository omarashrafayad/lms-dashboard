"use client"

import * as React from "react"
import { Plus, Trash2, GripVertical, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuestionOption {
  key: string
  text: string
}

export interface QuestionDraft {
  id: string
  number: number
  questionText: string
  questionType: string
  points: number
  correctAnswerIndex: number
  correctAnswerText?: string
  options: QuestionOption[]
  required: boolean
}

export interface ExamQuestionsStepProps {
  questions: QuestionDraft[]
  onAddQuestion: () => void
  onDeleteQuestion: (id: string) => void
  onUpdateQuestion: (id: string, updates: Partial<QuestionDraft>) => void
  onAddOption: (questionId: string) => void
  onDeleteOption: (questionId: string, optKey: string) => void
}

export function ExamQuestionsStep({
  questions,
  onAddQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
  onAddOption,
  onDeleteOption,
}: ExamQuestionsStepProps) {
  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0)

  return (
    <div className="flex flex-col gap-6 mt-2 max-w-4xl animate-in fade-in-50">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-zinc-900">Questions</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              {questions.length} {questions.length === 1 ? "Question" : "Questions"}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {totalPoints} Total Points
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Build the assessment items. Currently supporting Multiple Choice questions with designated correct answers.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddQuestion}
          className="h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="size-3.5 stroke-[2.5]" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Questions list */}
      <div className="flex flex-col gap-5">
        {questions.map((q, qIndex) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5 transition-all hover:border-zinc-300"
          >
            {/* Top row */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <GripVertical className="size-4 text-zinc-300 cursor-grab" />
                <span className="text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg">
                  Question {qIndex + 1}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  Multiple Choice
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase">
                    Points:
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={q.points}
                    onChange={(e) =>
                      onUpdateQuestion(q.id, {
                        points: Math.max(1, parseInt(e.target.value, 10) || 1),
                      })
                    }
                    className="w-16 h-8 px-2 text-center text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteQuestion(q.id)}
                  className="size-8 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                  title="Delete question"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                QUESTION TEXT *
              </label>
              <textarea
                rows={2}
                value={q.questionText}
                onChange={(e) =>
                  onUpdateQuestion(q.id, { questionText: e.target.value })
                }
                placeholder="Type your question prompt here..."
                className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs resize-none"
              />
            </div>

            {/* Options list */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                OPTIONS & CORRECT ANSWER (CLICK CIRCLE TO MARK AS CORRECT) *
              </label>

              <div className="flex flex-col gap-2">
                {q.options.map((opt, optIndex) => {
                  const isCorrect = q.correctAnswerIndex === optIndex
                  return (
                    <div
                      key={opt.key}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-xl border transition-all",
                        isCorrect
                          ? "bg-emerald-50/50 border-emerald-200 ring-1 ring-emerald-300"
                          : "bg-white border-zinc-200"
                      )}
                    >
                      {/* Radio button to mark as correct answer */}
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuestion(q.id, {
                            correctAnswerIndex: optIndex,
                            correctAnswerText: opt.text,
                          })
                        }
                        className={cn(
                          "size-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0",
                          isCorrect
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-zinc-300 hover:border-emerald-500"
                        )}
                        title="Mark as correct answer"
                      >
                        {isCorrect && <Check className="size-3.5 stroke-[3]" />}
                      </button>

                      {/* Option letter */}
                      <span className="text-xs font-bold text-zinc-600 w-5 text-center shrink-0">
                        {opt.key}
                      </span>

                      {/* Option text input */}
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const newText = e.target.value
                          const updatedOpts = q.options.map((o) =>
                            o.key === opt.key ? { ...o, text: newText } : o
                          )
                          onUpdateQuestion(q.id, {
                            options: updatedOpts,
                            correctAnswerText:
                              isCorrect ? newText : q.correctAnswerText,
                          })
                        }}
                        placeholder={`Option ${optIndex + 1} text`}
                        className="flex-1 h-8 px-2.5 bg-transparent border-0 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                      />

                      {/* Correct label badge */}
                      {isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                          Correct Answer
                        </span>
                      )}

                      {/* Delete option */}
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => onDeleteOption(q.id, opt.key)}
                          className="size-7 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          title="Remove option"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Add option button */}
              {q.options.length < 6 && (
                <button
                  type="button"
                  onClick={() => onAddOption(q.id)}
                  className="self-start text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-amber-50/70 transition-colors cursor-pointer mt-1"
                >
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Add another option</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
