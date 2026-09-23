"use client"

import * as React from "react"
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form"
import {
  GripVertical,
  Plus,
  Trash2,
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react"
import { LessonFormValues, QuizQuestion, QuizOption } from "../../types/lesson.types"
import { ExamPreviewModal } from "./ExamPreviewModal"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function QuestionActionMenu({
  onDuplicate,
  onDelete,
}: {
  onDuplicate: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="size-8 rounded-lg border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer shrink-0"
        aria-label="Question actions"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl bg-white border border-zinc-200/80 shadow-lg py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onDuplicate()
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left cursor-pointer"
          >
            <Copy className="size-3.5 text-zinc-400" />
            <span>Duplicate</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onDelete()
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
          >
            <Trash2 className="size-3.5 text-rose-500" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}

export interface Step5LessonQuizProps {
  control: Control<LessonFormValues>
  register: UseFormRegister<LessonFormValues>
  setValue: UseFormSetValue<LessonFormValues>
  watch: UseFormWatch<LessonFormValues>
  onNext: () => void
  onBack: () => void
  onCancel: () => void
  onSaveDraft: () => void
}

export function Step5LessonQuiz({
  control,
  register,
  setValue,
  watch,
  onNext,
  onBack,
  onCancel,
  onSaveDraft,
}: Step5LessonQuizProps) {
  const quiz = watch("quiz")
  const isPublished = quiz?.isPublished || false
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "quiz.questions",
  })

  // Calculate totals
  const totalQuestions = fields.length
  const totalPoints = (quiz?.questions || []).reduce(
    (sum, q) => sum + (Number(q.points) || 0),
    0
  )

  const handlePublishExam = () => {
    if (!quiz?.title?.trim()) {
      toast.error("Please enter an Exam Title")
      return
    }
    if (fields.length === 0) {
      toast.error("Please add at least one question")
      return
    }
    setValue("quiz.isPublished", true, { shouldValidate: true })
    toast.success("Exam published successfully")
  }

  const handleEditExam = () => {
    setValue("quiz.isPublished", false)
  }

  const handleDeleteExam = () => {
    setValue("quiz.title", "")
    setValue("quiz.description", "")
    setValue("quiz.isPublished", false)
    setValue("quiz.questions", [])
    toast.success("Exam deleted")
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
    append(newQ)
  }

  const handleDuplicateQuestion = (index: number) => {
    const target = quiz.questions[index]
    if (!target) return
    const duplicated: QuizQuestion = {
      ...target,
      id: `q-${Date.now()}`,
      options: target.options.map((opt, oIdx) => ({
        ...opt,
        id: `opt-${Date.now()}-${oIdx}`,
      })),
    }
    insert(index + 1, duplicated)
    toast.success("Question duplicated")
  }

  const handleAddOption = (questionIndex: number) => {
    const currentQuestions = [...(watch("quiz.questions") || [])]
    const currentOptions = currentQuestions[questionIndex]?.options || []
    const newOption: QuizOption = {
      id: `opt-${Date.now()}`,
      text: `Option ${currentOptions.length + 1}`,
      isCorrect: false,
    }
    currentQuestions[questionIndex].options = [...currentOptions, newOption]
    setValue("quiz.questions", currentQuestions)
  }

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const currentQuestions = [...(watch("quiz.questions") || [])]
    const currentOptions = currentQuestions[questionIndex]?.options || []
    if (currentOptions.length <= 2) {
      toast.error("At least 2 options are required")
      return
    }
    const filteredOptions = currentOptions.filter((_, idx) => idx !== optionIndex)
    // If the removed option was the correct one, make the first remaining option correct
    if (currentOptions[optionIndex]?.isCorrect && filteredOptions.length > 0) {
      filteredOptions[0].isCorrect = true
    }
    currentQuestions[questionIndex].options = filteredOptions
    setValue("quiz.questions", currentQuestions)
  }

  const handleSelectCorrectOption = (questionIndex: number, optionId: string) => {
    const currentQuestions = [...(watch("quiz.questions") || [])]
    const targetQ = currentQuestions[questionIndex]
    if (!targetQ) return
    targetQ.options = targetQ.options.map((opt) => ({
      ...opt,
      isCorrect: opt.id === optionId,
    }))
    setValue("quiz.questions", currentQuestions)
  }

  // =========================================================================
  // VIEW: Published Exam Card State (Matching Image 2)
  // =========================================================================
  if (isPublished) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-200">
        {/* Step Header matching Image 2 */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">
            Step 5 — Lesson Quiz
          </h2>
          <p className="text-xs text-zinc-400 font-normal">
            Final quiz for the complete lesson — separate from lesson quizzes.
          </p>
        </div>

        {/* Published Exam Card matching Image 2 */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-zinc-900" dir="auto">
                {quiz.title || "Lesson Quiz"}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#16A34A] border border-emerald-200/60 shadow-2xs">
                <span className="size-1.5 rounded-full bg-[#16A34A]" />
                Published
              </span>
            </div>

            {/* Action Buttons: Delete Exam, Preview Exam, Edit Exam */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleDeleteExam}
                className="h-9 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Exam</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="h-9 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="size-3.5 text-zinc-500" />
                <span>Preview Exam</span>
              </button>

              <button
                type="button"
                onClick={handleEditExam}
                className="h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Pencil className="size-3.5" />
                <span>Edit Exam</span>
              </button>
            </div>
          </div>

          {/* Stats Row in 4 Columns matching Image 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                TOTAL QUESTIONS
              </span>
              <span className="text-xl font-bold text-zinc-900 tracking-tight">
                {totalQuestions}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                TOTAL POINTS
              </span>
              <span className="text-xl font-bold text-zinc-900 tracking-tight">
                {totalPoints}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                PASSING SCORE
              </span>
              <span className="text-xl font-bold text-zinc-900 tracking-tight">
                {quiz.passingScore || 60}%
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                TIME LIMIT
              </span>
              <span className="text-xl font-bold text-zinc-900 tracking-tight">
                {quiz.timeLimit || 30} min
              </span>
            </div>
          </div>

          {/* Info Banner at bottom matching Image 2 */}
          <div className="bg-zinc-50 border border-zinc-100/90 rounded-xl p-3.5 text-xs text-zinc-600 font-medium">
            Passing Score: <span className="font-bold text-zinc-800">{quiz.passingScore || 60}%</span> · Based on Course Level: {quiz.courseLevel || "Beginner"}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
            >
              <ChevronLeft className="size-3.5 stroke-[2.5]" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={onNext}
              className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ChevronRight className="size-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Student Preview Modal */}
        <ExamPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          quiz={quiz}
          subjectName={watch("subject")}
        />
      </div>
    )
  }

  // =========================================================================
  // VIEW: Exam Edit / Form State (Matching Image 1)
  // =========================================================================
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Step Header matching Image 1 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">
            Step 5 — Lesson Quiz
          </h2>
          <p className="text-xs text-zinc-400 font-normal">
            Create or attach a quiz to this lesson.
          </p>
        </div>

        {/* Right Action Buttons: Save Draft & Publish Exam */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={handlePublishExam}
            className="h-9 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
          >
            <span>Publish Exam</span>
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
            {...register("quiz.title", { required: true })}
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
            {...register("quiz.description")}
            rows={3}
            placeholder="Briefly describe this final assessment..."
            className="w-full p-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs resize-none"
            dir="auto"
          />
        </div>

        {/* Row: Time Limit & Passing Score */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Time Limit */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              TIME LIMIT · <span className="normal-case font-normal text-zinc-400">minutes</span>
            </label>
            <input
              type="number"
              {...register("quiz.timeLimit", { valueAsNumber: true })}
              placeholder="30"
              className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          {/* Passing Score */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              PASSING SCORE
            </label>
            <div className="flex items-center h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50/80 text-xs font-semibold text-zinc-800 shadow-2xs">
              {quiz.passingScore || 60}%
            </div>
            <span className="text-[11px] text-zinc-400 font-normal">
              Based on Course Level: {quiz.courseLevel || "Beginner"}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Questions matching Image 1 */}
      <div className="flex flex-col gap-4">
        {/* Questions Header */}
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

        {/* Questions List */}
        {fields.map((field, qIndex) => {
          const questionItem = watch(`quiz.questions.${qIndex}`)
          const options = questionItem?.options || []

          return (
            <div
              key={field.id}
              className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5 transition-all hover:border-zinc-300"
            >
              {/* Question Header: Drag Handle + Number + Input + More Menu */}
              <div className="flex items-center gap-3">
                <div className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 transition-colors shrink-0">
                  <GripVertical className="size-4" />
                </div>

                <div className="size-6 rounded-md bg-amber-50 text-[#F59E0B] font-bold text-xs flex items-center justify-center shrink-0">
                  {qIndex + 1}
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    {...register(`quiz.questions.${qIndex}.text` as const)}
                    placeholder="Enter the question text..."
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                    dir="auto"
                  />
                </div>

                {/* More Menu: Duplicate / Delete */}
                <QuestionActionMenu
                  onDuplicate={() => handleDuplicateQuestion(qIndex)}
                  onDelete={() => remove(qIndex)}
                />
              </div>

              {/* Row: Question Type & Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                    QUESTION TYPE
                  </label>
                  <Select
                    value={questionItem?.type || "Multiple Choice"}
                    onValueChange={(val: any) =>
                      setValue(`quiz.questions.${qIndex}.type`, val)
                    }
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
                    {...register(`quiz.questions.${qIndex}.points` as const, {
                      valueAsNumber: true,
                    })}
                    placeholder="2"
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Options Section matching Image 1 */}
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  OPTIONS · SELECT THE CORRECT ANSWER
                </label>

                <div className="flex flex-col gap-2.5">
                  {options.map((opt, optIdx) => {
                    const isCorrect = opt.isCorrect

                    return (
                      <div key={opt.id} className="flex items-center gap-3">
                        {/* Radio Button for selecting correct answer */}
                        <button
                          type="button"
                          onClick={() => handleSelectCorrectOption(qIndex, opt.id)}
                          className="size-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all border-zinc-300 hover:border-[#F59E0B]"
                          style={{
                            borderColor: isCorrect ? "#F59E0B" : undefined,
                          }}
                        >
                          {isCorrect && (
                            <span className="size-2.5 rounded-full bg-[#F59E0B]" />
                          )}
                        </button>

                        {/* Option Input */}
                        <div className="flex-1">
                          <input
                            type="text"
                            {...register(
                              `quiz.questions.${qIndex}.options.${optIdx}.text` as const
                            )}
                            placeholder={`Option ${optIdx + 1}`}
                            className="w-full h-9 px-3 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                            dir="auto"
                          />
                        </div>

                        {/* Delete option if > 2 */}
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(qIndex, optIdx)}
                            className="size-7 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* + Add option button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleAddOption(qIndex)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B] hover:text-amber-600 transition-colors cursor-pointer pt-1"
                  >
                    <Plus className="size-3.5 stroke-[2.5]" />
                    <span>Add option</span>
                  </button>
                </div>
              </div>

              {/* Divider and Required toggle */}
              <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      `quiz.questions.${qIndex}.required`,
                      !questionItem?.required
                    )
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    questionItem?.required ? "bg-[#F59E0B]" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      questionItem?.required ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-medium text-zinc-700">Required</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
          >
            <ChevronLeft className="size-3.5 stroke-[2.5]" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
          >
            <span>Continue</span>
            <ChevronRight className="size-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  )
}
