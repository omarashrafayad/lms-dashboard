"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Calendar,
  BookOpen,
  GraduationCap,
  Plus,
  Trash2,
  GripVertical,
  MoreHorizontal,
  Check,
} from "lucide-react"
import { toast } from "sonner"
import { useExamStore } from "@/stores/useExamStore"
import { ExamLevel, ExamStatus, ExamType } from "../types/exam.types"
import { cn } from "@/lib/utils"

interface QuestionDraft {
  id: string
  number: number
  question: string
  type: string
  points: number
  correctAnswerIndex: number
  options: { key: string; text: string }[]
  required: boolean
}

export default function ExamAddPage() {
  const router = useRouter()
  const { addExam } = useExamStore()

  // Wizard state
  const [currentStep, setCurrentStep] = React.useState<number>(1)

  // Step 1: Exam Type
  const [examType, setExamType] = React.useState<ExamType>("Monthly")

  // Step 2: Exam Information
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")

  // Step 3: Academic Mapping
  const [level, setLevel] = React.useState<ExamLevel>("Beginner")
  const [educationStage, setEducationStage] = React.useState("Primary")
  const [academicYear, setAcademicYear] = React.useState("2026 / 2027")
  const [term, setTerm] = React.useState("Term 1")
  const [month, setMonth] = React.useState("October")
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([
    "Mathematics",
  ])

  // Step 4: Questions
  const [questions, setQuestions] = React.useState<QuestionDraft[]>([
    {
      id: "q-1",
      number: 1,
      question: "",
      type: "Multiple Choice",
      points: 2,
      correctAnswerIndex: 0,
      options: [
        { key: "A", text: "Option 1" },
        { key: "B", text: "Option 2" },
      ],
      required: true,
    },
  ])

  // Step 5: Settings
  const [durationMinutes, setDurationMinutes] = React.useState(30)
  const [passingScorePercent, setPassingScorePercent] = React.useState(60)
  const [attemptsAllowed, setAttemptsAllowed] = React.useState(1)
  const [shuffleQuestions, setShuffleQuestions] = React.useState(false)
  const [showResultsImmediately, setShowResultsImmediately] =
    React.useState(true)

  // Available subjects for Step 3
  const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
  ]

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0)

  // Steps definition for the Stepper Bar
  const steps = [
    { number: 1, label: "Select Exam Type" },
    { number: 2, label: "Exam Information" },
    { number: 3, label: "Academic Mapping" },
    { number: 4, label: "Questions" },
    { number: 5, label: "Settings" },
    { number: 6, label: "Review" },
  ]

  // Handlers for Questions Step
  const handleAddQuestion = () => {
    const nextNumber = questions.length + 1
    const newQ: QuestionDraft = {
      id: `q-${Date.now()}`,
      number: nextNumber,
      question: "",
      type: "Multiple Choice",
      points: 2,
      correctAnswerIndex: 0,
      options: [
        { key: "A", text: "Option 1" },
        { key: "B", text: "Option 2" },
      ],
      required: true,
    }
    setQuestions((prev) => [...prev, newQ])
  }

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) {
      toast.error("An exam must have at least one question")
      return
    }
    setQuestions((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, idx) => ({ ...q, number: idx + 1 }))
    )
  }

  const handleUpdateQuestion = (
    id: string,
    updates: Partial<QuestionDraft>
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    )
  }

  const handleAddOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const nextKey = String.fromCharCode(65 + q.options.length)
          return {
            ...q,
            options: [
              ...q.options,
              { key: nextKey, text: `Option ${q.options.length + 1}` },
            ],
          }
        }
        return q
      })
    )
  }

  const handleToggleSubject = (sub: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    )
  }

  // Navigation handlers
  const handleContinue = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
      return
    }
    if (currentStep === 2) {
      if (!title.trim()) {
        toast.error("Please enter an Exam Title")
        return
      }
      setCurrentStep(3)
      return
    }
    if (currentStep === 3) {
      if (selectedSubjects.length === 0) {
        toast.error("Please select at least one subject")
        return
      }
      setCurrentStep(4)
      return
    }
    if (currentStep === 4) {
      setCurrentStep(5)
      return
    }
    if (currentStep === 5) {
      setCurrentStep(6)
      return
    }
    if (currentStep === 6) {
      handleFinalSave("Published")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleFinalSave = (status: ExamStatus = "Published") => {
    const primarySubject = selectedSubjects[0] || "Mathematics"
    const finalExam = addExam({
      title: title || `${primarySubject} — ${month} Monthly Exam`,
      type: examType,
      level,
      subject: primarySubject,
      educationStage,
      academicYear,
      term,
      month: examType === "Monthly" ? month : undefined,
      questionsCount: questions.length,
      totalPoints,
      duration: `${durationMinutes} min`,
      durationMinutes,
      attemptsAllowed,
      passingScore: `${passingScorePercent}%`,
      passingScorePercent,
      status,
      linkedTo: {
        type: examType === "Course" ? "Course" : "Subject",
        subject: primarySubject,
        stage: educationStage,
        term,
      },
      questions: questions.map((q) => ({
        id: q.id,
        number: q.number,
        question: q.question || `Sample question ${q.number}`,
        type: "Multiple Choice",
        options: q.options,
        correctAnswer: q.options[q.correctAnswerIndex]?.key || "A",
        points: q.points,
        difficulty: level,
      })),
    })

    toast.success(
      status === "Published"
        ? "Exam published successfully!"
        : "Exam saved as draft!"
    )
    router.push(`/academic/exams/${finalExam.slug || finalExam.id}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Header / Back Link matching Image 2 */}
      <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto pb-32 flex flex-col gap-6">
        <div>
          <button
            type="button"
            onClick={() => router.push("/academic/exams")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Exams</span>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Add Exam
        </h1>

        {/* Multi-step Stepper Bar matching Images 2, 3, 4, 5 */}
        <div className="flex flex-wrap items-center gap-2.5 py-1">
          {steps.map((st) => {
            const isCompleted = currentStep > st.number
            const isCurrent = currentStep === st.number

            return (
              <button
                key={st.number}
                type="button"
                onClick={() => {
                  if (st.number < currentStep) setCurrentStep(st.number)
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs transition-all shadow-2xs select-none",
                  isCurrent &&
                    "border border-[#F59E0B] bg-white text-zinc-900 font-semibold ring-2 ring-amber-100/60",
                  isCompleted &&
                    "bg-amber-50 text-amber-900 border border-amber-200/80 font-medium cursor-pointer hover:bg-amber-100/70",
                  !isCurrent &&
                    !isCompleted &&
                    "border border-zinc-200 bg-white text-zinc-400 font-normal cursor-not-allowed"
                )}
              >
                {isCompleted ? (
                  <span className="size-3.5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </span>
                ) : (
                  <span
                    className={cn(
                      "text-xs font-bold",
                      isCurrent ? "text-[#F59E0B]" : "text-zinc-400"
                    )}
                  >
                    {st.number}
                  </span>
                )}
                <span>{st.label}</span>
              </button>
            )
          })}
        </div>

        {/* ================= STEP 1: Select Exam Type (Image 2) ================= */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-6 mt-4 animate-in fade-in-50">
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                Select Exam Type
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Choose the kind of exam you want to create. This determines how it is mapped and used.
              </p>
            </div>

            {/* 3 Selectable Cards in a row matching Image 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Monthly Exam Card */}
              <div
                onClick={() => setExamType("Monthly")}
                className={cn(
                  "bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-2xs cursor-pointer transition-all hover:border-zinc-300",
                  examType === "Monthly"
                    ? "border-amber-500 ring-2 ring-amber-100 bg-amber-50/20"
                    : "border-zinc-200/90"
                )}
              >
                <div className="size-10 rounded-xl bg-zinc-100 border border-zinc-200/70 flex items-center justify-center text-zinc-600">
                  <Calendar className="size-5 text-zinc-600" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold text-zinc-900">
                    Monthly Exam
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    A recurring monthly assessment mapped to a term, month, and one or more subjects.
                  </p>
                </div>
              </div>

              {/* Subject Exam Card */}
              <div
                onClick={() => setExamType("Subject")}
                className={cn(
                  "bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-2xs cursor-pointer transition-all hover:border-zinc-300",
                  examType === "Subject"
                    ? "border-amber-500 ring-2 ring-amber-100 bg-amber-50/20"
                    : "border-zinc-200/90"
                )}
              >
                <div className="size-10 rounded-xl bg-zinc-100 border border-zinc-200/70 flex items-center justify-center text-zinc-600">
                  <BookOpen className="size-5 text-zinc-600" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold text-zinc-900">
                    Subject Exam
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    A subject-level exam mapped to a level, stage, academic year, and term.
                  </p>
                </div>
              </div>

              {/* Course Exam Card */}
              <div
                onClick={() => setExamType("Course")}
                className={cn(
                  "bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-2xs cursor-pointer transition-all hover:border-zinc-300",
                  examType === "Course"
                    ? "border-amber-500 ring-2 ring-amber-100 bg-amber-50/20"
                    : "border-zinc-200/90"
                )}
              >
                <div className="size-10 rounded-xl bg-zinc-100 border border-zinc-200/70 flex items-center justify-center text-zinc-600">
                  <GraduationCap className="size-5 text-zinc-600" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold text-zinc-900">
                    Course Exam
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    A final course exam linked to a specific course. Level and stage follow the course.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Exam Information (Image 3) ================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 max-w-3xl flex flex-col gap-6 mt-4 animate-in fade-in-50">
            <h2 className="text-base font-bold text-zinc-900">
              Exam Information
            </h2>

            {/* Exam Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                EXAM TITLE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Algebra — Final Exam"
                className="w-full h-11 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                DESCRIPTION
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add an optional description for this exam."
                className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs resize-none"
              />
            </div>

            {/* Exam Type (Read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                EXAM TYPE
              </label>
              <input
                type="text"
                disabled
                value={
                  examType === "Monthly"
                    ? "Monthly Exam"
                    : examType === "Subject"
                    ? "Subject Exam"
                    : "Course Exam"
                }
                className="w-full h-11 px-3.5 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs font-semibold text-zinc-700 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* ================= STEP 3: Academic Mapping (Image 4) ================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 max-w-3xl flex flex-col gap-6 mt-4 animate-in fade-in-50">
            <h2 className="text-base font-bold text-zinc-900">
              Academic Mapping
            </h2>

            {/* Row 1: Level & Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  LEVEL *
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as ExamLevel)}
                  className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  EDUCATION STAGE *
                </label>
                <select
                  value={educationStage}
                  onChange={(e) => setEducationStage(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
                >
                  <option value="Primary">Primary</option>
                  <option value="Preparatory">Preparatory</option>
                  <option value="Secondary">Secondary</option>
                </select>
              </div>
            </div>

            {/* Row 2: Year & Term */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  ACADEMIC YEAR *
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
                >
                  <option value="2026 / 2027">2026 / 2027</option>
                  <option value="2025 / 2026">2025 / 2026</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  TERM *
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                </select>
              </div>
            </div>

            {/* Row 3: Month */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                MONTH *
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
              >
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
              </select>
            </div>

            {/* Row 4: Subject(s) pills matching Image 4 */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  SUBJECT(S) *
                </label>
                <span className="text-xs text-zinc-400">
                  · select one or more
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {availableSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub)
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleToggleSubject(sub)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs transition-all border shadow-2xs cursor-pointer",
                        isSelected
                          ? "bg-amber-50 text-amber-900 border-amber-300 font-semibold ring-1 ring-amber-300"
                          : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      {sub}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: Questions (Image 5) ================= */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-6 mt-4 max-w-4xl animate-in fade-in-50">
            {/* Header: Questions stats & Add Question button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-900">Questions</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {questions.length} questions · {totalPoints} points · drag to reorder
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="h-10 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Plus className="size-4 stroke-[2.5]" />
                <span>Add Question</span>
              </button>
            </div>

            {/* Questions Cards List */}
            <div className="flex flex-col gap-5">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-6 flex flex-col gap-5"
                >
                  {/* Top Row: Grip handle, Number badge, Question input, 3 dots */}
                  <div className="flex items-center gap-3">
                    <GripVertical className="size-4 text-zinc-400 cursor-grab shrink-0" />

                    <span className="size-6 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold text-xs flex items-center justify-center shrink-0">
                      {q.number}
                    </span>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) =>
                        handleUpdateQuestion(q.id, { question: e.target.value })
                      }
                      placeholder="Enter the question text..."
                      className="flex-1 h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete question"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* Second Row: Question Type & Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                        QUESTION TYPE
                      </label>
                      <select
                        value={q.type}
                        onChange={(e) =>
                          handleUpdateQuestion(q.id, { type: e.target.value })
                        }
                        className="h-10 px-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
                      >
                        <option value="Multiple Choice">Multiple Choice</option>
                        <option value="True / False">True / False</option>
                        <option value="Short Answer">Short Answer</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                        POINTS
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={q.points}
                        onChange={(e) =>
                          handleUpdateQuestion(q.id, {
                            points: parseInt(e.target.value) || 1,
                          })
                        }
                        className="h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Third Section: Options & Select correct answer matching Image 5 */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                      OPTIONS · SELECT THE CORRECT ANSWER
                    </span>

                    <div className="flex flex-col gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswerIndex === optIdx

                        return (
                          <div
                            key={opt.key}
                            className="flex items-center gap-3"
                          >
                            {/* Radio Circle */}
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuestion(q.id, {
                                  correctAnswerIndex: optIdx,
                                })
                              }
                              className={cn(
                                "size-5 rounded-full border flex items-center justify-center cursor-pointer transition-colors shrink-0",
                                isCorrect
                                  ? "border-amber-500 bg-white"
                                  : "border-zinc-300 hover:border-zinc-400 bg-white"
                              )}
                            >
                              {isCorrect && (
                                <span className="size-2.5 rounded-full bg-[#F59E0B]" />
                              )}
                            </button>

                            {/* Option Input */}
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                const newOpts = [...q.options]
                                newOpts[optIdx].text = e.target.value
                                handleUpdateQuestion(q.id, { options: newOpts })
                              }}
                              className="flex-1 h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                            />
                          </div>
                        )
                      })}
                    </div>

                    {/* + Add Option button */}
                    <button
                      type="button"
                      onClick={() => handleAddOption(q.id)}
                      className="self-start text-xs font-semibold text-[#D97706] hover:text-amber-700 flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Add option</span>
                    </button>
                  </div>

                  <div className="h-px bg-zinc-100 my-1" />

                  {/* Required Switch matching Image 5 */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuestion(q.id, { required: !q.required })
                      }
                      className={cn(
                        "w-10 h-5.5 rounded-full transition-colors relative cursor-pointer",
                        q.required ? "bg-[#F59E0B]" : "bg-zinc-200"
                      )}
                    >
                      <span
                        className={cn(
                          "size-4 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs",
                          q.required ? "left-5.5" : "left-0.5"
                        )}
                      />
                    </button>
                    <span className="text-xs font-semibold text-zinc-800">
                      Required
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 5: Settings ================= */}
        {currentStep === 5 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 max-w-3xl flex flex-col gap-6 mt-4 animate-in fade-in-50">
            <h2 className="text-base font-bold text-zinc-900">Exam Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  DURATION (MINUTES)
                </label>
                <input
                  type="number"
                  min={5}
                  value={durationMinutes}
                  onChange={(e) =>
                    setDurationMinutes(parseInt(e.target.value) || 30)
                  }
                  className="w-full h-11 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  PASSING SCORE (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={passingScorePercent}
                  onChange={(e) =>
                    setPassingScorePercent(parseInt(e.target.value) || 60)
                  }
                  className="w-full h-11 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  ATTEMPTS ALLOWED
                </label>
                <input
                  type="number"
                  min={1}
                  value={attemptsAllowed}
                  onChange={(e) =>
                    setAttemptsAllowed(parseInt(e.target.value) || 1)
                  }
                  className="w-full h-11 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="h-px bg-zinc-100 my-2" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-800">
                    Shuffle Questions
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Randomize the order of questions for each student.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShuffleQuestions(!shuffleQuestions)}
                  className={cn(
                    "w-10 h-5.5 rounded-full transition-colors relative cursor-pointer",
                    shuffleQuestions ? "bg-[#F59E0B]" : "bg-zinc-200"
                  )}
                >
                  <span
                    className={cn(
                      "size-4 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs",
                      shuffleQuestions ? "left-5.5" : "left-0.5"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-800">
                    Show Results Immediately
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Students will see their score immediately upon completion.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setShowResultsImmediately(!showResultsImmediately)
                  }
                  className={cn(
                    "w-10 h-5.5 rounded-full transition-colors relative cursor-pointer",
                    showResultsImmediately ? "bg-[#F59E0B]" : "bg-zinc-200"
                  )}
                >
                  <span
                    className={cn(
                      "size-4 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs",
                      showResultsImmediately ? "left-5.5" : "left-0.5"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 6: Review ================= */}
        {currentStep === 6 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 max-w-3xl flex flex-col gap-6 mt-4 animate-in fade-in-50">
            <h2 className="text-base font-bold text-zinc-900">Review Exam</h2>

            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-0.5">
                  TITLE
                </span>
                <span className="font-bold text-zinc-900">
                  {title || `${selectedSubjects[0]} — ${month} Monthly Exam`}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-0.5">
                  TYPE
                </span>
                <span className="font-bold text-zinc-900">{examType} Exam</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-0.5">
                  SUBJECT & LEVEL
                </span>
                <span className="font-bold text-zinc-900">
                  {selectedSubjects.join(", ")} · {level}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-0.5">
                  STAGE & TERM
                </span>
                <span className="font-bold text-zinc-900">
                  {educationStage} · {term} ({academicYear})
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-0.5">
                  QUESTIONS & POINTS
                </span>
                <span className="font-bold text-zinc-900">
                  {questions.length} Questions · {totalPoints} Points
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-0.5">
                  DURATION & PASS SCORE
                </span>
                <span className="font-bold text-zinc-900">
                  {durationMinutes} min · {passingScorePercent}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Footer matching Images 2, 3, 4, 5 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xs border-t border-zinc-200/80 px-8 py-4 z-30 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/academic/exams")}
          className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
              <span>Back</span>
            </button>
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleContinue}
              className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <span>Continue</span>
              <ChevronRight className="size-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFinalSave("Draft")}
                className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-2xs cursor-pointer"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleFinalSave("Published")}
                className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Check className="size-4" />
                <span>Publish Exam</span>
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}
