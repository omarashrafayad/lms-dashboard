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
import { useAcademicStages } from "@/features/dashboard/reference-data/hooks/useReferenceData"
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

  // 1. Fetch dynamic courses
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses({ pageSize: 100 })
  const courses = Array.isArray(coursesData) ? coursesData : coursesData?.items || []
  const courseOptions = React.useMemo(() => {
    if (!Array.isArray(courses)) return []
    return courses.map((c: any) => ({
      label: c.name || c.title || "Untitled Course",
      value: c.id,
    }))
  }, [courses])

  // 2. Fetch dynamic academic stages
  const { data: academicStages = [], isLoading: isLoadingStages } = useAcademicStages()
  const stageOptions = React.useMemo(() => {
    if (!Array.isArray(academicStages) || academicStages.length === 0) {
      return [
        { label: "Primary", value: "Primary" },
        { label: "Preparatory", value: "Preparatory" },
        { label: "Secondary", value: "Secondary" },
      ]
    }
    return academicStages.map((st: any) => ({
      label: st.name,
      value: st.name,
    }))
  }, [academicStages])

  // 3. Fetch dynamic curriculum subjects
  const { data: curriculumSubjectsData, isLoading: isLoadingSubjects } = useCurriculumSubjects({ pageSize: 100 })
  const curriculumSubjects = Array.isArray(curriculumSubjectsData) ? curriculumSubjectsData : curriculumSubjectsData?.items || []

  // Question drafts state
  const [questions, setQuestions] = React.useState<QuestionDraft[]>([
    {
      id: "q-1",
      number: 1,
      questionText: "",
      questionType: "Multiple Choice",
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
      educationStage: "Primary",
      academicYear: "2026 / 2027",
      term: "Term 1",
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
          questionType: "Multiple Choice",
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

  // Set default educationStage when dynamic stages load
  React.useEffect(() => {
    if (academicStages.length > 0 && !getValues("educationStage")) {
      setValue("educationStage", academicStages[0].name)
    }
  }, [academicStages, setValue, getValues])

  // Handlers for Questions Step
  const handleAddQuestion = () => {
    const nextNumber = questions.length + 1
    const newQ: QuestionDraft = {
      id: `q-${Date.now()}`,
      number: nextNumber,
      questionText: "",
      questionType: "Multiple Choice",
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
      const optionsStr = q.options.map((opt) => `${opt.key}: ${opt.text}`).join(", ")
      const correctOpt = q.options[q.correctAnswerIndex]
      return {
        questionText: q.questionText.trim(),
        questionType: q.questionType,
        points: Number(q.points) || 1,
        options: optionsStr,
        correctAnswer: correctOpt?.key || "A",
        isRequired: !!q.required,
      }
    })

    const payload = {
      title: watchTitle.trim(),
      description: watchDescription?.trim() || "",
      examType: watchExamType,
      level: watchLevel || "Beginner",
      educationStage: watchEducationStage || "Primary",
      academicYear: watchAcademicYear || "2026 / 2027",
      term: watchTerm || "Term 1",
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
                  <div className="space-y-1 animate-in fade-in-50 duration-200">
                    <UniSelect
                      control={control}
                      name="courseId"
                      label="SELECT COURSE *"
                      placeholder={
                        isLoadingCourses ? "Loading courses..." : "Choose an existing course"
                      }
                      options={courseOptions}
                      isLoading={isLoadingCourses}
                      required
                      helperText="Choose the course this exam belongs to. Students enrolled in this course will take this assessment."
                      onChangeCallback={(val) => {
                        const selectedCourse = courses.find((c: any) => c.id === val)
                        if (selectedCourse) {
                          setValue(
                            "courseName",
                            selectedCourse.name || selectedCourse.title || ""
                          )
                        }
                      }}
                    />
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

                {/* Row 1: Level & Dynamic Stage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <UniSelect
                    control={control}
                    name="level"
                    label="LEVEL *"
                    placeholder="Select Level"
                    options={LEVEL_OPTIONS}
                    required
                  />

                  {/* Dynamic Education Stage loaded from reference-data API */}
                  <UniSelect
                    control={control}
                    name="educationStage"
                    label="EDUCATION STAGE *"
                    placeholder={
                      isLoadingStages ? "Loading stages..." : "Select Stage"
                    }
                    options={stageOptions}
                    isLoading={isLoadingStages}
                    required
                  />
                </div>

                {/* Row 2: Year & Term */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <UniInput
                    control={control}
                    name="academicYear"
                    label="ACADEMIC YEAR *"
                    placeholder="2026 / 2027"
                    required
                  />

                  <UniSelect
                    control={control}
                    name="term"
                    label="TERM *"
                    placeholder="Select Term"
                    options={TERM_OPTIONS}
                    required
                  />
                </div>

                {/* Row 3: Month - ONLY when Monthly Exam is selected */}
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

                {/* Row 4: Dynamic Subject(s) - ONLY when Subject Exam is selected */}
                {watchExamType === "Subject" && (
                  <div className="flex flex-col gap-2.5 animate-in fade-in-50 duration-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                        SUBJECT(S) *
                      </label>
                      <span className="text-xs text-zinc-400">
                        {watchSubjects.length} selected · select one or more
                      </span>
                    </div>

                    {isLoadingSubjects ? (
                      <div className="flex items-center gap-2 py-3 text-xs text-zinc-400">
                        <Loader2 className="size-4 animate-spin text-amber-500" />
                        <span>Loading curriculum subjects...</span>
                      </div>
                    ) : curriculumSubjects.length === 0 ? (
                      <p className="text-xs text-zinc-400 py-2">
                        No subjects found in curriculum.
                      </p>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {curriculumSubjects.map((sub: any) => {
                          const isSelected = watchSubjects.includes(sub.id)
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleToggleSubject(sub.id)}
                              className={cn(
                                "px-4 py-1.5 rounded-full text-xs transition-all border shadow-2xs cursor-pointer select-none",
                                isSelected
                                  ? "bg-amber-50 text-amber-900 border-amber-300 font-semibold ring-1 ring-amber-300"
                                  : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                              )}
                            >
                              {sub.name}
                            </button>
                          )
                        })}
                      </div>
                    )}
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
                                points: Math.max(1, parseInt(e.target.value) || 1),
                              })
                            }
                            className="h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Third Section: Options & Select correct answer */}
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
                                    handleUpdateQuestion(q.id, {
                                      options: newOpts,
                                    })
                                  }}
                                  className="flex-1 h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                                />

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
                        STAGE & TERM
                      </span>
                      <span className="font-bold text-zinc-900">
                        {watchEducationStage} · {watchTerm} ({watchAcademicYear})
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
