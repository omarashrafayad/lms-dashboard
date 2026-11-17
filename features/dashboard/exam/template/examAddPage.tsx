"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"

import { Form } from "@/components/ui/form"
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

import { ExamStepIndicator, EXAM_STEPS } from "../components/form/ExamStepIndicator"
import { ExamTypeStep } from "../components/form/ExamTypeStep"
import { ExamBasicInfoStep } from "../components/form/ExamBasicInfoStep"
import { ExamAcademicMappingStep } from "../components/form/ExamAcademicMappingStep"
import { ExamQuestionsStep, QuestionDraft } from "../components/form/ExamQuestionsStep"
import { ExamSettingsReviewStep } from "../components/form/ExamSettingsReviewStep"

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

export default function ExamAddPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const createExamMutation = useCreateExam()

  // Dynamic Teaching Levels from reference data
  const { data: teachingLevelsData } = useTeachingLevels()
  const teachingLevels = Array.isArray(teachingLevelsData) ? teachingLevelsData : []
  const dynamicLevelOptions = React.useMemo(() => {
    const list = teachingLevels
      .filter((l) => l.isActive !== false)
      .map((l) => ({ label: l.name, value: l.name }))
    if (list.length > 0) return list
    return [
      { label: "Beginner", value: "Beginner" },
      { label: "Intermediate", value: "Intermediate" },
      { label: "Advanced", value: "Advanced" },
    ]
  }, [teachingLevels])

  // Backend search for Courses (page 1, 10 items)
  const [courseSearch, setCourseSearch] = React.useState("")
  const debouncedCourseSearch = useDebounce(courseSearch, 400)
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses({
    page: 1,
    pageSize: 10,
    search: debouncedCourseSearch ? debouncedCourseSearch.trim() : undefined,
  })
  const courses = Array.isArray(coursesData) ? coursesData : (coursesData as any)?.items || []

  // Backend search for Subjects (page 1, 10 items)
  const [subjectSearch, setSubjectSearch] = React.useState("")
  const debouncedSubjectSearch = useDebounce(subjectSearch, 400)
  const { data: curriculumSubjectsData, isLoading: isLoadingSubjects } = useCurriculumSubjects({
    page: 1,
    pageSize: 10,
    search: debouncedSubjectSearch ? debouncedSubjectSearch.trim() : undefined,
  })
  const curriculumSubjects = Array.isArray(curriculumSubjectsData)
    ? curriculumSubjectsData
    : (curriculumSubjectsData as any)?.items || []

  // Question state
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
        { key: "C", text: "Option 3" },
        { key: "D", text: "Option 4" },
      ],
      required: true,
    },
  ])

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
      term: "Term 1",
      month: "October",
      subjects: [],
      courseId: "",
      courseName: "",
      durationMinutes: 60,
      attemptsAllowed: 1,
      passingScore: 50,
      availability: "Always available",
      status: "Published",
      questions: [
        {
          questionText: "Sample question",
          questionType: "multichoise",
          points: 1,
          options: "A: Option 1, B: Option 2",
          correctAnswer: "A",
          isRequired: true,
        },
      ],
    },
  })

  const { control, handleSubmit, watch, setValue, formState: { isSubmitting } } = form

  const watchExamType = watch("examType")
  const watchCourseId = watch("courseId")
  const watchCourseName = watch("courseName")
  const watchTitle = watch("title")
  const watchDescription = watch("description")
  const watchLevel = watch("level")
  const watchMonth = watch("month")
  const watchSubjects = watch("subjects") || []
  const watchDuration = watch("durationMinutes")
  const watchPassingScore = watch("passingScore")
  const watchAttemptsAllowed = watch("attemptsAllowed")

  // Handlers for Questions
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
      prev.filter((q) => q.id !== id).map((q, idx) => ({ ...q, number: idx + 1 }))
    )
  }

  const handleUpdateQuestion = (id: string, updates: Partial<QuestionDraft>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const handleAddOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const nextKey = String.fromCharCode(65 + q.options.length)
          return {
            ...q,
            options: [...q.options, { key: nextKey, text: `Option ${q.options.length + 1}` }],
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

  const handleToggleSubject = (subjectId: string) => {
    const current = watchSubjects
    const next = current.includes(subjectId)
      ? current.filter((id) => id !== subjectId)
      : [...current, subjectId]
    setValue("subjects", next, { shouldValidate: true })
  }

  // Stepper navigation
  const handleContinue = () => {
    if (currentStep === 1) {
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

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto pb-16 flex flex-col gap-6">
        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={() => router.push("/academic/exams")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Exams</span>
          </button>
        </div>

        {/* Page Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Create New Exam
          </h1>
          <p className="text-xs text-zinc-500">
            Design an assessment, define scoring criteria, and map it to academic modules.
          </p>
        </div>

        {/* Step Indicator */}
        <ExamStepIndicator
          steps={EXAM_STEPS}
          currentStep={currentStep}
          onStepClick={(st) => setCurrentStep(st)}
        />

        <Form {...form}>
          <form onSubmit={handleSubmit(() => handleFinalSave("Published"))} className="flex flex-col gap-6">
            {/* Step 1: Select Exam Type */}
            {currentStep === 1 && (
              <ExamTypeStep
                selectedType={watchExamType}
                onSelectType={(type) => {
                  setValue("examType", type)
                  if (type === "Monthly") {
                    setValue("courseId", "")
                    setValue("courseName", "")
                    setValue("subjects", [])
                    setValue("month", "October")
                  } else if (type === "Subject") {
                    setValue("courseId", "")
                    setValue("courseName", "")
                    setValue("month", "")
                  } else if (type === "Course") {
                    setValue("month", "")
                    setValue("subjects", [])
                  }
                }}
              />
            )}

            {/* Step 2: Exam Information */}
            {currentStep === 2 && (
              <ExamBasicInfoStep
                control={control as any}
                examType={watchExamType}
                courseId={watchCourseId || undefined}
                courseName={watchCourseName || undefined}
                onSelectCourse={(id, name) => {
                  setValue("courseId", id, { shouldValidate: true })
                  setValue("courseName", name)
                }}
                onClearCourse={() => {
                  setValue("courseId", "", { shouldValidate: true })
                  setValue("courseName", "")
                }}
                courses={courses}
                isLoadingCourses={isLoadingCourses}
                courseSearch={courseSearch}
                onCourseSearchChange={setCourseSearch}
              />
            )}

            {/* Step 3: Academic Mapping */}
            {currentStep === 3 && (
              <ExamAcademicMappingStep
                control={control as any}
                examType={watchExamType}
                levelOptions={dynamicLevelOptions}
                termOptions={TERM_OPTIONS}
                monthOptions={MONTH_OPTIONS}
                selectedSubjects={watchSubjects}
                onToggleSubject={handleToggleSubject}
                subjects={curriculumSubjects}
                isLoadingSubjects={isLoadingSubjects}
                subjectSearch={subjectSearch}
                onSubjectSearchChange={setSubjectSearch}
              />
            )}

            {/* Step 4: Questions */}
            {currentStep === 4 && (
              <ExamQuestionsStep
                questions={questions}
                onAddQuestion={handleAddQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onAddOption={handleAddOption}
                onDeleteOption={handleDeleteOption}
              />
            )}

            {/* Step 5: Settings & Review */}
            {currentStep === 5 && (
              <ExamSettingsReviewStep
                control={control as any}
                availabilityOptions={AVAILABILITY_OPTIONS}
                questionsCount={questions.length}
                totalPoints={totalPoints}
              />
            )}

            {/* Footer Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-200/80">
              <button
                type="button"
                onClick={() => router.push("/academic/exams")}
                className="h-10 px-5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                    <span>Back</span>
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Continue</span>
                    <ChevronRight className="size-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleFinalSave("Draft")}
                      className="h-10 px-4 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isPending && <Loader2 className="size-4 animate-spin text-zinc-500" />}
                      <span>Save as Draft</span>
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleFinalSave("Published")}
                      className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                    >
                      {isPending && <Loader2 className="size-4 animate-spin text-white" />}
                      <span>Publish Exam</span>
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
