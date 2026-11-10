"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
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
  Check,
  Loader2,
  Search,
  X,
} from "lucide-react"

import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import {
  createExamSchema,
  CreateExamFormData,
} from "../schema/exam.schema"
import { useCreateExam } from "../hooks/useExams"
import { useCourses } from "@/features/dashboard/course/hooks/useCourses"
import { useCurriculumSubjects } from "@/features/dashboard/curriculum/hooks/useCurriculum"
import { useTeachingLevels } from "@/features/dashboard/reference-data/hooks/useReferenceData"
import { useDebounce } from "@/hooks/useDebounce"
import { ExamStatus } from "../types/exam.types"
import { cn } from "@/lib/utils"

interface QuestionOption {
  key: string
  text: string
}

interface QuestionDraft {
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

const LEVEL_OPTIONS = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
]

const TERM_OPTIONS = [
  { label: "Term 1", value: "Term 1" },
  { label: "Term 2", value: "Term 2" },
]

const MONTH_OPTIONS = [
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
]

const AVAILABILITY_OPTIONS = [
  { label: "Always available", value: "Always available" },
  { label: "Scheduled", value: "Scheduled" },
]

const STEPS = [
  { number: 1, label: "Select Exam Type" },
  { number: 2, label: "Exam Information" },
  { number: 3, label: "Academic Mapping" },
  { number: 4, label: "Questions" },
  { number: 5, label: "Settings & Review" },
]

export default function ExamAddPage() {
  const router = useRouter()
  const createExamMutation = useCreateExam()

  // Stepper state
  const [currentStep, setCurrentStep] = React.useState<number>(1)

  // 1. Fetch dynamic courses with backend search (page 1, pageSize 10)
  const [courseSearch, setCourseSearch] = React.useState("")
  const debouncedCourseSearch = useDebounce(courseSearch, 400)
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses({
    search: debouncedCourseSearch.trim() || undefined,
    page: 1,
    pageSize: 10,
  })
  const courses = Array.isArray(coursesData) ? coursesData : coursesData?.items || []

  // 2. Fetch dynamic teaching levels
  const { data: teachingLevels = [], isLoading: isLoadingLevels } = useTeachingLevels()
  const levelOptions = React.useMemo(() => {
    if (!teachingLevels || teachingLevels.length === 0) return LEVEL_OPTIONS
    return teachingLevels.map((l: any) => ({
      label: l.name,
      value: l.name,
    }))
  }, [teachingLevels])

  // 3. Fetch dynamic curriculum subjects with backend search (page 1, pageSize 10)
  const [subjectSearch, setSubjectSearch] = React.useState("")
  const debouncedSubjectSearch = useDebounce(subjectSearch, 400)
  const { data: curriculumSubjectsData, isLoading: isLoadingSubjects } = useCurriculumSubjects({
    search: debouncedSubjectSearch.trim() || undefined,
    page: 1,
    pageSize: 10,
  })
  const curriculumSubjects = Array.isArray(curriculumSubjectsData) ? curriculumSubjectsData : curriculumSubjectsData?.items || []

  // Question drafts state
  const [questions, setQuestions] = React.useState<QuestionDraft[]>([
    {
      id: "q-1",
      number: 1,
      questionText: "",
      questionType: "multichoise",
      points: 2,
      correctAnswerIndex: 0,
      options: [
        { key: "A", text: "Option 1" },
        { key: "B", text: "Option 2" },
      ],
      required: true,
    },
  ])

  // Extra local settings for UI
  const [shuffleQuestions, setShuffleQuestions] = React.useState(false)
  const [showResultsImmediately, setShowResultsImmediately] = React.useState(true)

  // React Hook Form
  const form = useForm<CreateExamFormData>({
    resolver: zodResolver(createExamSchema) as any,
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      examType: "Monthly",
      level: "Beginner",
      educationStage: "",
      academicYear: "",
      term: "",
      month: "October",
      subjects: [],
      courseId: "",
      courseName: "",
      durationMinutes: 30,
      attemptsAllowed: 1,
      passingScore: 60,
      availability: "Always available",
      availableFrom: new Date().toISOString(),
      availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Published",
      questions: [
        {
          questionText: "Sample question",
          questionType: "multichoise",
          points: 2,
          options: "A: Option 1, B: Option 2",
          correctAnswer: "A",
          isRequired: true,
        },
      ],
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = form

  const watchExamType = watch("examType")
  const watchCourseId = watch("courseId")
  const watchCourseName = watch("courseName")
  const watchTitle = watch("title")
  const watchDescription = watch("description")
  const watchLevel = watch("level")
  const watchEducationStage = watch("educationStage")
  const watchAcademicYear = watch("academicYear")
  const watchTerm = watch("term")
  const watchMonth = watch("month")
  const watchSubjects = watch("subjects") || []
  const watchDuration = watch("durationMinutes")
  const watchPassingScore = watch("passingScore")
  const watchAttemptsAllowed = watch("attemptsAllowed")

  // Handlers for Questions Step
  const handleAddQuestion = () => {
    const nextNumber = questions.length + 1
    const newQ: QuestionDraft = {
      id: `q-${Date.now()}`,
      number: nextNumber,
      questionText: "",
      questionType: "multichoise",
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

  const handleDeleteOption = (questionId: string, optKey: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          if (q.options.length <= 2) {
            toast.error("Question must have at least 2 options")
            return q
          }
          const filtered = q.options.filter((o) => o.key !== optKey)
          const rekeyed = filtered.map((o, idx) => ({
            ...o,
            key: String.fromCharCode(65 + idx),
          }))
          const newCorrectIndex =
            q.correctAnswerIndex < rekeyed.length ? q.correctAnswerIndex : 0
          return {
            ...q,
            options: rekeyed,
            correctAnswerIndex: newCorrectIndex,
          }
        }
        return q
      })
    )
  }

  // Toggle Subject ID
  const handleToggleSubject = (subjectId: string) => {
    const current = watchSubjects
    const next = current.includes(subjectId)
      ? current.filter((id) => id !== subjectId)
      : [...current, subjectId]
    setValue("subjects", next, { shouldValidate: true })
  }

  // Stepper Navigation handlers
  const handleContinue = () => {
    if (currentStep === 1) {
      // Step 1: Just choose exam type (course selection moved to step 2)
      setCurrentStep(2)
      return
    }
    if (currentStep === 2) {
      if (!watchTitle?.trim()) {
        toast.error("Please enter an Exam Title")
        return
      }
      if (watchExamType === "Course" && !watchCourseId) {
        toast.error("Please select a course for Course Exam")
        return
      }
      setCurrentStep(3)
      return
    }
    if (currentStep === 3) {
      if (watchExamType === "Subject" && watchSubjects.length === 0) {
        toast.error("Please select at least one subject")
        return
      }
      if (watchExamType === "Monthly" && !watchMonth) {
        toast.error("Please select a month")
        return
      }
      setCurrentStep(4)
      return
    }
    if (currentStep === 4) {
      for (let i = 0; i < questions.length; i++) {
        if (!questions[i].questionText.trim()) {
          toast.error(`Please enter question text for Question ${i + 1}`)
          return
        }
      }
      setCurrentStep(5)
      return
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Final submit handler
  const handleFinalSave = async (status: ExamStatus = "Published") => {
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        toast.error(`Please enter question text for Question ${i + 1}`)
        return
      }
    }

    const serializedQuestions = questions.map((q) => {
      const isMultichoice =
        q.questionType === "multichoise" ||
        q.questionType === "Multiple Choice" ||
        !q.questionType

      let optionsStr = ""
      let correctAns = ""

      if (isMultichoice) {
        optionsStr = q.options.map((opt) => `${opt.key}: ${opt.text}`).join(", ")
        const correctOpt = q.options[q.correctAnswerIndex]
        correctAns = correctOpt ? correctOpt.key : (q.options[0]?.key || "A")
      } else if (q.questionType === "True / False") {
        optionsStr = "True, False"
        correctAns = q.correctAnswerText || "True"
      } else {
        optionsStr = ""
        correctAns = q.correctAnswerText || ""
      }

      return {
        questionText: q.questionText.trim(),
        questionType: isMultichoice ? "multichoise" : q.questionType,
        points: Number(q.points) || 1,
        options: optionsStr,
        correctAnswer: correctAns,
        isRequired: !!q.required,
      }
    })

    const payload = {
      title: watchTitle.trim(),
      description: watchDescription?.trim() || "",
      examType: watchExamType,
      level: watchLevel || "Beginner",
      educationStage: "",
      academicYear: "",
      term: "",
      month: watchExamType === "Monthly" ? watchMonth || "October" : "",
      subjects: watchExamType === "Subject" ? watchSubjects : [],
      courseId: watchExamType === "Course" ? watchCourseId || null : null,
      courseName: watchExamType === "Course" ? watchCourseName || null : null,
      durationMinutes: Number(watchDuration) || 30,
      attemptsAllowed: Number(watchAttemptsAllowed) || 1,
      passingScore: Number(watchPassingScore) || 60,
      availability: watch("availability") || "Always available",
      availableFrom: watch("availableFrom") || new Date().toISOString(),
      availableTo:
        watch("availableTo") ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status,
      questions: serializedQuestions,
    }

    try {
      await createExamMutation.mutateAsync(payload)
      toast.success(
        status === "Published"
          ? "Exam published successfully!"
          : "Exam saved as draft!"
      )
      router.push("/academic/exams")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const isPending = isSubmitting || createExamMutation.isPending
  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0)

  // Map selected subject IDs to names for review display
  const selectedSubjectNames = React.useMemo(() => {
    if (!Array.isArray(curriculumSubjects) || watchSubjects.length === 0) return []
    return curriculumSubjects
      .filter((s: any) => watchSubjects.includes(s.id))
      .map((s: any) => s.name)
  }, [curriculumSubjects, watchSubjects])

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto pb-16 flex flex-col gap-6">
        {/* Back Link */}
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

        {/* Multi-step Stepper Bar (5 steps) */}
        <div className="flex flex-wrap items-center gap-2.5 py-1">
          {STEPS.map((st) => {
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
                    "bg-amber-50 text-amber-900 border-amber-200/80 font-medium cursor-pointer hover:bg-amber-100/70",
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

        <Form {...form}>
          <form onSubmit={handleSubmit(() => handleFinalSave("Published"))} className="flex flex-col gap-6">
            {/* ================= STEP 1: Select Exam Type ================= */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-6 mt-2 animate-in fade-in-50">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">
                    Select Exam Type
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Choose the kind of exam you want to create. This determines how it is mapped and used.
                  </p>
                </div>

                {/* 3 Selectable Cards in a row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Monthly Exam Card */}
                  <div
                    onClick={() => {
                      setValue("examType", "Monthly")
                      setValue("courseId", "")
                      setValue("courseName", "")
                      setValue("subjects", [])
                      setValue("month", "October")
                    }}
                    className={cn(
                      "bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-2xs cursor-pointer transition-all hover:border-zinc-300",
                      watchExamType === "Monthly"
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
                        A recurring monthly assessment mapped to a specific term and month.
                      </p>
                    </div>
                  </div>

                  {/* Subject Exam Card */}
                  <div
                    onClick={() => {
                      setValue("examType", "Subject")
                      setValue("courseId", "")
                      setValue("courseName", "")
                      setValue("month", "")
                    }}
                    className={cn(
                      "bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-2xs cursor-pointer transition-all hover:border-zinc-300",
                      watchExamType === "Subject"
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
                        A subject-level exam mapped to a level, stage, and one or more target subjects.
                      </p>
                    </div>
                  </div>

                  {/* Course Exam Card */}
                  <div
                    onClick={() => {
                      setValue("examType", "Course")
                      setValue("month", "")
                      setValue("subjects", [])
                    }}
                    className={cn(
                      "bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-2xs cursor-pointer transition-all hover:border-zinc-300",
                      watchExamType === "Course"
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
                        A final course exam linked to a specific academic course in the curriculum.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 2: Exam Information ================= */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 max-w-3xl flex flex-col gap-6 mt-2 animate-in fade-in-50">
                <h2 className="text-base font-bold text-zinc-900">
                  Exam Information
                </h2>

                {/* Exam Title */}
                <UniInput
                  control={control}
                  name="title"
                  label="EXAM TITLE *"
                  placeholder="e.g. Algebra — Final Exam"
                  required
                />

                {/* Description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                        DESCRIPTION
                      </FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={4}
                          placeholder="Add an optional description for this exam."
                          className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Course Selection Field - Placed in Step 2 for Course Exam */}
                {watchExamType === "Course" && (
                  <div className="flex flex-col gap-2.5 animate-in fade-in-50 duration-200">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      SELECT COURSE *
                    </label>

                    {watchCourseId ? (
                      <div className="flex items-center justify-between p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <GraduationCap className="size-4 text-amber-600 shrink-0" />
                          <span className="text-xs font-bold text-zinc-900 truncate">
                            {watchCourseName || "Selected Course"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setValue("courseId", "", { shouldValidate: true })
                            setValue("courseName", "")
                          }}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer shrink-0 ml-3"
                        >
                          Change Course
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {/* Course search input */}
                        <div className="relative">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                          <input
                            type="text"
                            value={courseSearch}
                            onChange={(e) => setCourseSearch(e.target.value)}
                            placeholder="Search courses from backend (page 1, 10 items)..."
                            className="w-full h-10 pl-10 pr-10 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                          />
                          {isLoadingCourses && (
                            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-500 animate-spin" />
                          )}
                        </div>

                        {/* Search results list */}
                        <div className="border border-zinc-200 rounded-xl max-h-48 overflow-y-auto divide-y divide-zinc-100 bg-white shadow-2xs">
                          {isLoadingCourses ? (
                            <div className="flex items-center justify-center gap-2 py-4 text-zinc-400 text-xs">
                              <Loader2 className="size-4 animate-spin text-amber-500" />
                              <span>Searching courses...</span>
                            </div>
                          ) : courses.length === 0 ? (
                            <div className="py-4 px-3 text-center text-xs text-zinc-400">
                              {courseSearch ? `No courses found for "${courseSearch}"` : "No courses available."}
                            </div>
                          ) : (
                            courses.map((c: any) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  setValue("courseId", c.id, { shouldValidate: true })
                                  setValue("courseName", c.name || c.title || "Untitled Course")
                                }}
                                className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-amber-50/50 text-left transition-colors cursor-pointer group"
                              >
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-semibold text-zinc-900 group-hover:text-amber-700 truncate">
                                    {c.name || c.title || "Untitled Course"}
                                  </span>
                                  <span className="text-[11px] text-zinc-400">
                                    {[c.category, c.difficultyLevel].filter(Boolean).join(" · ") || "Course"}
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-amber-700 bg-amber-50 group-hover:bg-amber-100 px-2.5 py-1 rounded-lg shrink-0 ml-2">
                                  Select
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                    <p className="text-[11px] text-zinc-400">
                      Choose the course this exam belongs to. Students enrolled in this course will take this assessment.
                    </p>
                  </div>
                )}

                {/* Exam Type Indicator */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                    EXAM TYPE
                  </label>
                  <input
                    type="text"
                    disabled
                    value={
                      watchExamType === "Monthly"
                        ? "Monthly Exam"
                        : watchExamType === "Subject"
                        ? "Subject Exam"
                        : `Course Exam${watchCourseName ? ` (${watchCourseName})` : ""}`
                    }
                    className="w-full h-11 px-3.5 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs font-semibold text-zinc-700 cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {/* ================= STEP 3: Academic Mapping ================= */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 max-w-3xl flex flex-col gap-6 mt-2 animate-in fade-in-50">
                <h2 className="text-base font-bold text-zinc-900">
                  Academic Mapping
                </h2>

                {/* Level (Dynamic from teaching-levels) */}
                <div className="grid grid-cols-1 gap-5">
                  <UniSelect
                    control={control}
                    name="level"
                    label="LEVEL *"
                    placeholder={isLoadingLevels ? "Loading levels..." : "Select Level"}
                    options={levelOptions}
                    isLoading={isLoadingLevels}
                    required
                  />
                </div>

                {/* Month - ONLY when Monthly Exam is selected */}
                {watchExamType === "Monthly" && (
                  <div className="animate-in fade-in-50 duration-200">
                    <UniSelect
                      control={control}
                      name="month"
                      label="MONTH *"
                      placeholder="Select Month"
                      options={MONTH_OPTIONS}
                      required
                    />
                  </div>
                )}

                {/* Dynamic Subject(s) with Backend Search (page 1, pageSize 10) - ONLY when Subject Exam is selected */}
                {watchExamType === "Subject" && (
                  <div className="flex flex-col gap-3 animate-in fade-in-50 duration-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                        SUBJECT(S) *
                      </label>
                      <span className="text-xs text-zinc-400">
                        {watchSubjects.length} selected
                      </span>
                    </div>

                    {/* Selected subjects list tags */}
                    {watchSubjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                        {watchSubjects.map((subId) => {
                          const foundSub = curriculumSubjects.find((s: any) => s.id === subId)
                          return (
                            <span
                              key={subId}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-zinc-900 border border-[#FDE68A]"
                            >
                              <span>{foundSub?.name || subId}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleSubject(subId)}
                                className="hover:text-rose-600 cursor-pointer"
                                title="Remove subject"
                              >
                                <X className="size-3" />
                              </button>
                            </span>
                          )
                        })}
                      </div>
                    )}

                    {/* Subject backend search input */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                      <input
                        type="text"
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                        placeholder="Search subjects from backend (page 1, 10 items)..."
                        className="w-full h-10 pl-10 pr-10 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                      />
                      {isLoadingSubjects && (
                        <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-500 animate-spin" />
                      )}
                    </div>

                    {/* Search results list */}
                    <div className="border border-zinc-200 rounded-xl max-h-48 overflow-y-auto divide-y divide-zinc-100 bg-white shadow-2xs">
                      {isLoadingSubjects ? (
                        <div className="flex items-center justify-center gap-2 py-4 text-zinc-400 text-xs">
                          <Loader2 className="size-4 animate-spin text-amber-500" />
                          <span>Searching subjects...</span>
                        </div>
                      ) : curriculumSubjects.length === 0 ? (
                        <div className="py-4 px-3 text-center text-xs text-zinc-400">
                          {subjectSearch ? `No subjects found for "${subjectSearch}"` : "No curriculum subjects available."}
                        </div>
                      ) : (
                        curriculumSubjects.map((sub: any) => {
                          const isSelected = watchSubjects.includes(sub.id)
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleToggleSubject(sub.id)}
                              className={cn(
                                "w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors cursor-pointer group",
                                isSelected ? "bg-amber-50/70" : "hover:bg-zinc-50"
                              )}
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold text-zinc-900 truncate">
                                  {sub.name}
                                </span>
                                <span className="text-[11px] text-zinc-400">
                                  {[sub.educationStage, sub.term].filter(Boolean).join(" · ") || "Subject"}
                                </span>
                              </div>
                              <span
                                className={cn(
                                  "text-xs font-semibold px-2.5 py-1 rounded-lg",
                                  isSelected
                                    ? "text-rose-600 bg-rose-50"
                                    : "text-amber-700 bg-amber-50 group-hover:bg-amber-100"
                                )}
                              >
                                {isSelected ? "Remove" : "+ Add"}
                              </span>
                            </button>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* When Course Exam is selected: neither subjects nor month is shown */}
                {watchExamType === "Course" && (
                  <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/70 text-xs text-zinc-600">
                    Linked to Course: <strong className="font-semibold text-zinc-900">{watchCourseName || "Selected Course"}</strong>. Subjects and Month are managed automatically through the course structure.
                  </div>
                )}
              </div>
            )}

            {/* ================= STEP 4: Questions ================= */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-6 mt-2 max-w-4xl animate-in fade-in-50">
                {/* Header: Questions stats & Add Question button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">Questions</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {questions.length} questions · {totalPoints} points
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
                      {/* Top Row: Grip handle, Number badge, Question input, delete */}
                      <div className="flex items-center gap-3">
                        <GripVertical className="size-4 text-zinc-400 cursor-grab shrink-0" />

                        <span className="size-6 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold text-xs flex items-center justify-center shrink-0">
                          {q.number}
                        </span>

                        <input
                          type="text"
                          value={q.questionText}
                          onChange={(e) =>
                            handleUpdateQuestion(q.id, {
                              questionText: e.target.value,
                            })
                          }
                          placeholder="Enter the question text..."
                          className="flex-1 h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                        />

                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete question"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>

                      {/* Second Row: Question Type & Points */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                            QUESTION TYPE
                          </label>
                          <select
                            value={q.questionType}
                            onChange={(e) =>
                              handleUpdateQuestion(q.id, {
                                questionType: e.target.value,
                              })
                            }
                            className="h-10 px-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
                          >
                            <option value="multichoise">Multiple Choice (multichoise)</option>
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
                                points: Math.max(1, parseInt(e.target.value) || 1),
                              })
                            }
                            className="h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Third Section: Options & Select correct answer when multichoise */}
                      {(q.questionType === "multichoise" || q.questionType === "Multiple Choice") && (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                              OPTIONS · SELECT THE CORRECT ANSWER
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600">
                              Correct: Option {q.options[q.correctAnswerIndex]?.key || "A"}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            {q.options.map((opt, optIdx) => {
                              const isCorrect = q.correctAnswerIndex === optIdx

                              return (
                                <div
                                  key={opt.key}
                                  className={cn(
                                    "flex items-center gap-3 p-2 rounded-xl transition-colors border",
                                    isCorrect
                                      ? "bg-emerald-50/40 border-emerald-300"
                                      : "border-transparent"
                                  )}
                                >
                                  {/* Radio Circle */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateQuestion(q.id, {
                                        correctAnswerIndex: optIdx,
                                      })
                                    }
                                    title="Mark as correct answer"
                                    className={cn(
                                      "size-5 rounded-full border flex items-center justify-center cursor-pointer transition-colors shrink-0",
                                      isCorrect
                                        ? "border-emerald-500 bg-white"
                                        : "border-zinc-300 hover:border-zinc-400 bg-white"
                                    )}
                                  >
                                    {isCorrect && (
                                      <span className="size-2.5 rounded-full bg-emerald-500" />
                                    )}
                                  </button>

                                  <span className="text-xs font-bold text-zinc-500 w-5 shrink-0">
                                    {opt.key}.
                                  </span>

                                  {/* Option Input */}
                                  <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) => {
                                      const newOpts = [...q.options]
                                      newOpts[optIdx].text = e.target.value
                                      handleUpdateQuestion(q.id, {
                                        options: newOpts,
                                      })
                                    }}
                                    placeholder={`Option ${opt.key} text...`}
                                    className="flex-1 h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                                  />

                                  {isCorrect && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md shrink-0">
                                      Correct Answer
                                    </span>
                                  )}

                                  {q.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteOption(q.id, opt.key)
                                      }
                                      className="p-1 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                                      title="Remove option"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  )}
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
                      )}

                      {/* When True / False */}
                      {q.questionType === "True / False" && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                            CORRECT ANSWER
                          </span>
                          <div className="flex items-center gap-4">
                            {["True", "False"].map((val) => {
                              const isSelected = (q.correctAnswerText || "True") === val
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() =>
                                    handleUpdateQuestion(q.id, {
                                      correctAnswerText: val,
                                    })
                                  }
                                  className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all",
                                    isSelected
                                      ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                                      : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                                  )}
                                >
                                  {val}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* When Short Answer */}
                      {q.questionType === "Short Answer" && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                            MODEL / EXPECTED ANSWER
                          </label>
                          <input
                            type="text"
                            value={q.correctAnswerText || ""}
                            onChange={(e) =>
                              handleUpdateQuestion(q.id, {
                                correctAnswerText: e.target.value,
                              })
                            }
                            placeholder="Enter expected answer..."
                            className="h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                          />
                        </div>
                      )}

                      <div className="h-px bg-zinc-100 my-1" />

                      {/* Required Switch */}
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

            {/* ================= STEP 5: Settings & Review ================= */}
            {currentStep === 5 && (
              <div className="flex flex-col gap-6 mt-2 max-w-3xl animate-in fade-in-50">
                {/* Settings Card */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6">
                  <h2 className="text-base font-bold text-zinc-900">
                    Exam Settings
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <UniInput
                      control={control}
                      name="durationMinutes"
                      label="DURATION (MINUTES)"
                      type="number"
                      placeholder="30"
                      required
                    />

                    <UniInput
                      control={control}
                      name="passingScore"
                      label="PASSING SCORE (%)"
                      type="number"
                      placeholder="60"
                      required
                    />

                    <UniInput
                      control={control}
                      name="attemptsAllowed"
                      label="ATTEMPTS ALLOWED"
                      type="number"
                      placeholder="1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <UniSelect
                      control={control}
                      name="availability"
                      label="AVAILABILITY"
                      placeholder="Select Availability"
                      options={AVAILABILITY_OPTIONS}
                      required
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                        DEFAULT STATUS
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Published"
                        className="w-full h-11 px-3.5 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs font-semibold text-zinc-700 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-zinc-100 my-1" />

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

                {/* Review Summary Card */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-5">
                  <h3 className="text-base font-bold text-zinc-900">
                    Review Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-0.5">
                        TITLE
                      </span>
                      <span className="font-bold text-zinc-900">
                        {watchTitle || "Untitled Exam"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-0.5">
                        TYPE
                      </span>
                      <span className="font-bold text-zinc-900">
                        {watchExamType} Exam
                        {watchExamType === "Course" && watchCourseName ? ` (${watchCourseName})` : ""}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-0.5">
                        SUBJECT / TARGET
                      </span>
                      <span className="font-bold text-zinc-900">
                        {watchExamType === "Monthly"
                          ? `Month: ${watchMonth || "October"}`
                          : watchExamType === "Subject"
                          ? selectedSubjectNames.length > 0
                            ? selectedSubjectNames.join(", ")
                            : "No subjects selected"
                          : `Course: ${watchCourseName || "Selected Course"}`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-0.5">
                        DIFFICULTY LEVEL
                      </span>
                      <span className="font-bold text-zinc-900">
                        {watchLevel || "Beginner"}
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
                        {watchDuration} min · {watchPassingScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= Section Footer Actions (Constrained to the section) ================= */}
            <div className="pt-6 border-t border-zinc-200/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push("/academic/exams")}
                disabled={isPending}
                className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isPending}
                    className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>Back</span>
                  </button>
                )}

                {currentStep < 5 ? (
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
                      disabled={isPending}
                      className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      Save Draft
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFinalSave("Published")}
                      disabled={isPending}
                      className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Check className="size-4" />
                          <span>Publish Exam</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
