"use client"

import * as React from "react"
import {
  GripVertical,
  Plus,
  Trash2,
  MoreHorizontal,
  Eye,
  ChevronLeft,
  Copy,
} from "lucide-react"
import { CourseExamData } from "../../types/course.types"
import { QuizQuestion, QuizOption } from "@/features/dashboard/lesson/types/lesson.types"
import { ExamPreviewModal } from "@/features/dashboard/lesson/components/add/ExamPreviewModal"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface CourseExamBuilderProps {
  courseTitle: string
  courseLevel: string
  initialExam?: CourseExamData | null
  onSaveDraft: (exam: CourseExamData) => void
  onPublish: (exam: CourseExamData) => void
  onBack: () => void
}

export function CourseExamBuilder({
  courseTitle,
  courseLevel,
  initialExam,
  onSaveDraft,
  onPublish,
  onBack,
}: CourseExamBuilderProps) {
  const [title, setTitle] = React.useState(initialExam?.title || "Final Mathematics Exam")
  const [description, setDescription] = React.useState(initialExam?.description || "")
  const [timeLimit, setTimeLimit] = React.useState(initialExam?.timeLimit || 30)
  const [attemptsAllowed, setAttemptsAllowed] = React.useState(
    initialExam?.attemptsAllowed || 1
  )
  const [passingScore, setPassingScore] = React.useState(initialExam?.passingScore || 60)
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)

  const [questions, setQuestions] = React.useState<QuizQuestion[]>(
    initialExam?.questions && initialExam.questions.length > 0
      ? initialExam.questions
      : [
          {
            id: "q-1",
            text: "",
            type: "Multiple Choice",
            points: 2,
            required: true,
            options: [
              { id: "opt-1-1", text: "Option 1", isCorrect: true },
              { id: "opt-1-2", text: "Option 2", isCorrect: false },
            ],
          },
          {
            id: "q-2",
            text: "",
            type: "Multiple Choice",
            points: 2,
            required: true,
            options: [
              { id: "opt-2-1", text: "Option 1", isCorrect: true },
              { id: "opt-2-2", text: "Option 2", isCorrect: false },
            ],
          },
        ]
  )

  const totalQuestions = questions.length
  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0)

  const getExamData = (isPublished: boolean): CourseExamData => ({
    title: title.trim() || "Course Final Exam",
    description: description.trim(),
    timeLimit: Number(timeLimit) || 30,
    attemptsAllowed: Number(attemptsAllowed) || 1,
    passingScore: Number(passingScore) || 60,
    courseLevel,
    isPublished,
    questions,
  })

  const handlePublish = () => {
    if (!title.trim()) {
      toast.error("Please enter an exam title")
      return
    }
    const data = getExamData(true)
    onPublish(data)
  }

  const handleDraft = () => {
    const data = getExamData(false)
    onSaveDraft(data)
  }

  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      text: "",
      type: "Multiple Choice",
      points: 2,
      required: true,
      options: [
        { id: `opt-${Date.now()}-1`, text: "Option 1", isCorrect: true },
        { id: `opt-${Date.now()}-2`, text: "Option 2", isCorrect: false },
      ],
    }
    setQuestions((prev) => [...prev, newQ])
  }

  const handleDuplicateQuestion = (idx: number) => {
    const target = questions[idx]
    if (!target) return
    const dup: QuizQuestion = {
      ...target,
      id: `q-${Date.now()}`,
      options: target.options.map((o, i) => ({
        ...o,
        id: `opt-${Date.now()}-${i}`,
      })),
    }
    setQuestions((prev) => {
      const copy = [...prev]
      copy.splice(idx + 1, 0, dup)
      return copy
    })
    toast.success("Question duplicated")
  }

  const handleDeleteQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddOption = (qIdx: number) => {
    setQuestions((prev) => {
      const copy = [...prev]
      const target = copy[qIdx]
      if (!target) return prev
      target.options = [
        ...target.options,
        {
          id: `opt-${Date.now()}`,
          text: `Option ${target.options.length + 1}`,
          isCorrect: false,
        },
      ]
      return copy
    })
  }

  const handleOptionTextChange = (qIdx: number, optIdx: number, val: string) => {
    setQuestions((prev) => {
      const copy = [...prev]
      const target = copy[qIdx]
      if (!target || !target.options[optIdx]) return prev
      target.options[optIdx].text = val
      return copy
    })
  }

  const handleSelectCorrectOption = (qIdx: number, optId: string) => {
    setQuestions((prev) => {
      const copy = [...prev]
      const target = copy[qIdx]
      if (!target) return prev
      target.options = target.options.map((opt) => ({
        ...opt,
        isCorrect: opt.id === optId,
      }))
      return copy
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Top Header matching Image 1 */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-4 text-zinc-500" />
          <span>Back to Course</span>
        </button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Course Exam Builder
          </h1>
          <span className="text-xs text-zinc-500 font-medium">
            {courseTitle}
          </span>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#0284C7] border border-sky-200/60 shadow-2xs">
              {courseLevel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] shadow-2xs">
              <span className="size-1.5 rounded-full bg-[#D97706]" />
              Exam Status: Draft
            </span>
          </div>
        </div>

        {/* Action Buttons: Save Draft, Preview, Publish Exam */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDraft}
            className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Eye className="size-3.5 text-zinc-500" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="h-9 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
          >
            Publish Exam
          </button>
        </div>
      </div>

      {/* Card 1: Exam Settings matching Image 1 */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col gap-5">
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
          Exam Settings
        </h3>

        {/* Exam Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
            EXAM TITLE *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Final Mathematics Exam"
            className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            dir="auto"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
            DESCRIPTION
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Briefly describe this final assessment..."
            className="w-full p-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs resize-none"
            dir="auto"
          />
        </div>

        {/* 3 Columns: Time Limit, Attempts Allowed, Passing Score matching Image 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              TIME LIMIT · <span className="normal-case font-normal text-zinc-400">minutes</span>
            </label>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value) || 0)}
              className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              ATTEMPTS ALLOWED
            </label>
            <input
              type="number"
              value={attemptsAllowed}
              onChange={(e) => setAttemptsAllowed(Number(e.target.value) || 0)}
              className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              PASSING SCORE
            </label>
            <div className="flex items-center h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50/80 text-xs font-semibold text-zinc-800 shadow-2xs">
              {passingScore}%
            </div>
            <span className="text-[11px] text-zinc-400 font-normal">
              Based on Course Level: {courseLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Questions matching Image 1 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Questions
            </h3>
            <span className="text-xs text-zinc-400 font-normal">
              {totalQuestions} questions · {totalPoints} points · drag to reorder
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddQuestion}
            className="h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Question</span>
          </button>
        </div>

        {/* Question Cards */}
        {questions.map((q, qIdx) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5 hover:border-zinc-300 transition-all"
          >
            {/* Header: Drag Handle, Number, Text Input, Delete */}
            <div className="flex items-center gap-3">
              <div className="cursor-grab text-zinc-400 hover:text-zinc-600 shrink-0">
                <GripVertical className="size-4" />
              </div>

              <div className="size-6 rounded-md bg-amber-50 text-[#F59E0B] font-bold text-xs flex items-center justify-center shrink-0">
                {qIdx + 1}
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => {
                    const copy = [...questions]
                    copy[qIdx].text = e.target.value
                    setQuestions(copy)
                  }}
                  placeholder="Enter the question text..."
                  className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  dir="auto"
                />
              </div>

              <button
                type="button"
                onClick={() => handleDuplicateQuestion(qIdx)}
                className="size-8 rounded-lg border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer shrink-0"
                title="Duplicate"
              >
                <Copy className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteQuestion(qIdx)}
                className="size-8 rounded-lg border border-zinc-200 hover:bg-rose-50 flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer shrink-0"
                title="Delete"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            {/* Row: Type & Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  QUESTION TYPE
                </label>
                <Select
                  value={q.type}
                  onValueChange={(val: any) => {
                    const copy = [...questions]
                    copy[qIdx].type = val
                    setQuestions(copy)
                  }}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Multiple Choice" className="text-xs">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="True / False" className="text-xs">
                      True / False
                    </SelectItem>
                    <SelectItem value="Short Answer" className="text-xs">
                      Short Answer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  POINTS
                </label>
                <input
                  type="number"
                  value={q.points}
                  onChange={(e) => {
                    const copy = [...questions]
                    copy[qIdx].points = Number(e.target.value) || 0
                    setQuestions(copy)
                  }}
                  className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                OPTIONS · SELECT THE CORRECT ANSWER
              </label>

              <div className="flex flex-col gap-2.5">
                {q.options.map((opt, optIdx) => (
                  <div key={opt.id} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectCorrectOption(qIdx, opt.id)}
                      className="size-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all border-zinc-300 hover:border-[#F59E0B]"
                      style={{
                        borderColor: opt.isCorrect ? "#F59E0B" : undefined,
                      }}
                    >
                      {opt.isCorrect && (
                        <span className="size-2.5 rounded-full bg-[#F59E0B]" />
                      )}
                    </button>

                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) =>
                        handleOptionTextChange(qIdx, optIdx, e.target.value)
                      }
                      placeholder={`Option ${optIdx + 1}`}
                      className="w-full h-9 px-3 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                      dir="auto"
                    />
                  </div>
                ))}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleAddOption(qIdx)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B] hover:text-amber-600 transition-colors cursor-pointer pt-1"
                >
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Add option</span>
                </button>
              </div>
            </div>

            {/* Bottom Required Toggle */}
            <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const copy = [...questions]
                  copy[qIdx].required = !copy[qIdx].required
                  setQuestions(copy)
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  q.required ? "bg-[#F59E0B]" : "bg-zinc-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    q.required ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-zinc-700">Required</span>
            </div>
          </div>
        ))}
      </div>

      {/* Student Preview Modal */}
      <ExamPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        quiz={{
          title,
          description,
          timeLimit,
          passingScore,
          courseLevel,
          questions,
        }}
        subjectName={courseTitle}
      />
    </div>
  )
}
