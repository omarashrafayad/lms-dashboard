"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  ChevronLeft,
  Plus,
  Trash2,
  FileQuestion,
  Check,
  Loader2,
  Save,
} from "lucide-react"
import { AddCourseStepper } from "../components/add/AddCourseStepper"
import {
  CourseLessonItem,
  CourseExamData,
  CourseCategory,
  CourseLevel,
} from "../types/course.types"
import { CourseExamBuilder } from "../components/detail/CourseExamBuilder"
import { useCourseDetail, useUpdateCourse } from "../hooks/useCourses"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface EditCourseFormValues {
  courseName: string
  category: CourseCategory
  courseLevel: CourseLevel
  instructor: string
  duration: string
  language: string
  description: string
  prerequisites: string
  targetAudience: string
  lessons: CourseLessonItem[]
  exam: CourseExamData | null
  allowVideoDownload: boolean
  allowPdfDownload: boolean
  certificateOnCompletion: boolean
}

const CATEGORIES: CourseCategory[] = [
  "Computer Science",
  "Mathematics",
  "Sciences",
  "Languages",
  "Business & Management",
  "Design & Arts",
  "Other",
]

const LEVELS: CourseLevel[] = ["Beginner", "Intermediate", "Advanced"]

const LANGUAGES = ["English", "Arabic", "French", "German", "Spanish"]

export interface CourseEditPageProps {
  courseId: string
}

export default function CourseEditPage({ courseId }: CourseEditPageProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isExamBuilding, setIsExamBuilding] = React.useState(false)

  const { data: course, isLoading } = useCourseDetail(courseId)
  const updateCourseMutation = useUpdateCourse(courseId)

  const { register, watch, setValue, reset } =
    useForm<EditCourseFormValues>({
      defaultValues: {
        courseName: "",
        category: "Mathematics",
        courseLevel: "Intermediate",
        instructor: "Dr. Sarah Adams",
        duration: "14 Hours",
        language: "English",
        description: "",
        prerequisites: "Basic algebra and arithmetic",
        targetAudience: "Secondary & College students",
        lessons: [],
        exam: null,
        allowVideoDownload: true,
        allowPdfDownload: true,
        certificateOnCompletion: true,
      },
    })

  // Pre-fill form when course data loads
  React.useEffect(() => {
    if (course) {
      reset({
        courseName: course.title || "",
        category: (course.category as CourseCategory) || "Mathematics",
        courseLevel: course.level || "Intermediate",
        instructor: course.instructor || "Dr. Sarah Adams",
        duration: course.duration || "14 Hours",
        language: course.language || "English",
        description:
          course.description ||
          "Comprehensive course covering fundamental and advanced concepts through structured modules.",
        prerequisites: Array.isArray(course.prerequisites)
          ? course.prerequisites.join(", ")
          : course.prerequisites || "None",
        targetAudience: course.targetAudience || "All learners",
        lessons: course.lessons && course.lessons.length > 0 ? course.lessons : [],
        exam: course.exam || {
          title: "Course Comprehensive Final Exam",
          timeLimit: 45,
          attemptsAllowed: 1,
          passingScore: 60,
          isPublished: true,
          questions: [
            {
              id: "q-1",
              text: "Which of the following describes the key principle taught in Module 1?",
              type: "Multiple Choice",
              points: 1,
              required: true,
              options: [
                { id: "opt-1", text: "Iterative algorithmic synthesis", isCorrect: true },
                { id: "opt-2", text: "Linear sequential compilation", isCorrect: false },
                { id: "opt-3", text: "Direct memory mapping", isCorrect: false },
              ],
            },
          ],
        },
        allowVideoDownload: course.allowVideoDownload ?? true,
        allowPdfDownload: course.allowPdfDownload ?? true,
        certificateOnCompletion: course.certificateAvailable ?? true,
      })
    }
  }, [course, courseId, reset])

  const formValues = watch()
  const category = formValues.category
  const courseLevel = formValues.courseLevel
  const lessons = formValues.lessons || []
  const exam = formValues.exam

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formValues.courseName.trim()) {
        toast.error("Please enter a course name")
        return
      }
      if (!category) {
        toast.error("Please select a course category")
        return
      }
    }
    setCurrentStep((prev) => Math.min(5, prev + 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const handleQuickAddLesson = () => {
    const sampleLessons: CourseLessonItem[] = [
      {
        id: `c-les-${Date.now()}-1`,
        order: lessons.length + 1,
        title: "Module In-depth Applications",
        type: "Video",
        duration: "28 min",
        offlineAvailable: true,
      },
      {
        id: `c-les-${Date.now()}-2`,
        order: lessons.length + 2,
        title: "Synthesis & Case Studies",
        type: "Reading",
        duration: "35 min",
        offlineAvailable: true,
      },
    ]

    setValue("lessons", [...lessons, ...sampleLessons])
    toast.success("New lessons added to course content")
  }

  const handleRemoveLesson = (id: string) => {
    const filtered = lessons.filter((l) => l.id !== id)
    setValue(
      "lessons",
      filtered.map((l, i) => ({ ...l, order: i + 1 }))
    )
    toast.info("Lesson removed")
  }

  const handleSaveCourse = async () => {
    try {
      await updateCourseMutation.mutateAsync({
        title: formValues.courseName,
        category: formValues.category,
        level: formValues.courseLevel,
        instructor: formValues.instructor,
        duration: formValues.duration,
        language: formValues.language,
        description: formValues.description,
        targetAudience: formValues.targetAudience,
        prerequisites: formValues.prerequisites
          ? formValues.prerequisites.split(",").map((s) => s.trim())
          : [],
        lessons: formValues.lessons,
        exam: formValues.exam || undefined,
        allowVideoDownload: formValues.allowVideoDownload,
        allowPdfDownload: formValues.allowPdfDownload,
        certificateAvailable: formValues.certificateOnCompletion,
      })

      toast.success("Course updated successfully!")
      router.push(`/courses/${courseId}`)
    } catch {
      toast.error("Failed to update course. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 className="size-8 animate-spin text-[#F59E0B]" />
        <span className="text-xs text-zinc-500 font-medium">Loading course details...</span>
      </div>
    )
  }

  // Builder mode for Course Exam
  if (isExamBuilding) {
    return (
      <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto">
        <CourseExamBuilder
          courseTitle={formValues.courseName || "Course Exam"}
          courseLevel={courseLevel || "Beginner"}
          initialExam={exam}
          onSaveDraft={(savedExam) => {
            setValue("exam", savedExam)
            setIsExamBuilding(false)
            toast.success("Exam draft saved")
          }}
          onPublish={(publishedExam) => {
            setValue("exam", publishedExam)
            setIsExamBuilding(false)
            toast.success("Exam updated")
          }}
          onBack={() => setIsExamBuilding(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Main Container */}
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-24">
        {/* Top Back Link & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
            <span>Back to Course Details</span>
          </Link>

          <span className="text-xs text-zinc-400 font-medium">
            Course ID: <strong className="text-zinc-700">{courseId}</strong>
          </span>
        </div>

        {/* Page Title & Save Shortcut */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              Edit Course
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Update course curriculum, instructor info, exam, and configuration.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/courses/${courseId}`}
              className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleSaveCourse}
              disabled={updateCourseMutation.isPending}
              className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {updateCourseMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Wizard Layout: Stepper + Main Content */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Vertical Stepper */}
          <AddCourseStepper
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
          />

          {/* Form Step Cards */}
          <div className="flex-1 w-full min-w-0">
            {/* ================================================================= */}
            {/* STEP 1: Course Information */}
            {/* ================================================================= */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Course Information
                  </h2>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Step 1 of 5
                  </span>
                </div>

                {/* Course Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Course Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("courseName")}
                    placeholder="e.g. Mathematics Fundamentals"
                    className="h-10 px-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-zinc-400 bg-white"
                  />
                </div>

                {/* Category & Difficulty Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">
                      Category / Track <span className="text-rose-500">*</span>
                    </label>
                    <Select
                      value={category}
                      onValueChange={(val) =>
                        setValue("category", (val as CourseCategory) ?? "Mathematics")
                      }
                    >
                      <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-800 bg-white focus:ring-2 focus:ring-amber-500/20">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-zinc-200">
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-xs cursor-pointer">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">
                      Difficulty Level
                    </label>
                    <Select
                      value={courseLevel}
                      onValueChange={(val) =>
                        setValue("courseLevel", (val as CourseLevel) ?? "Intermediate")
                      }
                    >
                      <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-800 bg-white focus:ring-2 focus:ring-amber-500/20">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-zinc-200">
                        {LEVELS.map((lvl) => (
                          <SelectItem key={lvl} value={lvl} className="text-xs cursor-pointer">
                            {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Instructor & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">
                      Instructor
                    </label>
                    <input
                      type="text"
                      {...register("instructor")}
                      placeholder="e.g. Dr. Sarah Adams"
                      className="h-10 px-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-zinc-400 bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      {...register("duration")}
                      placeholder="e.g. 14 Hours"
                      className="h-10 px-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-zinc-400 bg-white"
                    />
                  </div>
                </div>

                {/* Language & Target Audience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">
                      Instruction Language
                    </label>
                    <Select
                      value={formValues.language}
                      onValueChange={(val) => setValue("language", val ?? "English")}
                    >
                      <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-800 bg-white focus:ring-2 focus:ring-amber-500/20">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-zinc-200">
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang} className="text-xs cursor-pointer">
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      {...register("targetAudience")}
                      placeholder="e.g. Secondary students"
                      className="h-10 px-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-zinc-400 bg-white"
                    />
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Prerequisites
                  </label>
                  <input
                    type="text"
                    {...register("prerequisites")}
                    placeholder="e.g. Basic arithmetic, pre-algebra"
                    className="h-10 px-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-zinc-400 bg-white"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    {...register("description")}
                    placeholder="Describe what students will learn in this course..."
                    className="p-3 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-zinc-400 bg-white resize-none"
                  />
                </div>

                {/* Footer Continue Action */}
                <div className="flex items-center justify-end pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* STEP 2: Course Content */}
            {/* ================================================================= */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                      Course Content
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Manage lessons and multimedia materials in this course.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickAddLesson}
                    className="h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <Plus className="size-3.5 stroke-[2.5]" />
                    <span>Add Lessons</span>
                  </button>
                </div>

                {/* Lessons List */}
                {lessons.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-12 flex flex-col items-center justify-center text-center gap-1 bg-zinc-50/40">
                    <span className="text-sm font-bold text-zinc-900">
                      No lessons attached
                    </span>
                    <span className="text-xs text-zinc-400 font-normal">
                      Click the button above to add lessons.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="bg-white rounded-xl border border-zinc-200/80 p-3.5 flex items-center justify-between gap-4 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-6 rounded-md bg-zinc-100 text-zinc-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-900">
                              {lesson.title}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {lesson.type} · {lesson.duration}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLesson(lesson.id)}
                          className="size-7 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* STEP 3: Course Exam */}
            {/* ================================================================= */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                      Final Course Exam
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Configure the exam required for course graduation.
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                    Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      DIFFICULTY LEVEL
                    </label>
                    <div className="flex items-center h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-2xs">
                      {courseLevel}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      PASSING SCORE
                    </label>
                    <div className="flex items-center h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-2xs">
                      {exam?.passingScore || 60}%
                    </div>
                  </div>
                </div>

                {/* Exam Details Card */}
                {!exam ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-12 flex flex-col items-center justify-center text-center gap-3 bg-zinc-50/40">
                    <div className="size-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center">
                      <FileQuestion className="size-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-zinc-900 block">
                        No Course Exam Configured
                      </span>
                      <span className="text-xs text-zinc-400">
                        Add an exam to test learner proficiency.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsExamBuilding(true)}
                      className="mt-2 h-9 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                    >
                      <Plus className="size-3.5 stroke-[2.5]" />
                      <span>Create Exam</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="size-4 stroke-[2.5]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-900">
                          {exam.title}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {exam.questions?.length || 1} questions · {exam.passingScore || 60}% pass · {exam.timeLimit || 45} min
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsExamBuilding(true)}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
                    >
                      Edit Exam
                    </button>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* STEP 4: Course Settings */}
            {/* ================================================================= */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Course Settings
                  </h2>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Step 4 of 5
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Video Download */}
                  <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors cursor-pointer bg-white">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900">
                        Allow Video Download
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-0.5">
                        Permit students to download video lectures locally for offline viewing.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      {...register("allowVideoDownload")}
                      className="size-4 rounded-md border-zinc-300 text-amber-500 focus:ring-amber-500 cursor-pointer mt-0.5"
                    />
                  </label>

                  {/* PDF Download */}
                  <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors cursor-pointer bg-white">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900">
                        Allow PDF Resource Download
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-0.5">
                        Allow downloading attached course notes, summaries, and formula sheets.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      {...register("allowPdfDownload")}
                      className="size-4 rounded-md border-zinc-300 text-amber-500 focus:ring-amber-500 cursor-pointer mt-0.5"
                    />
                  </label>

                  {/* Certificate */}
                  <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors cursor-pointer bg-white">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900">
                        Issue Certificate on Completion
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-0.5">
                        Automatically generate a verified digital completion certificate once the student passes the exam.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      {...register("certificateOnCompletion")}
                      className="size-4 rounded-md border-zinc-300 text-amber-500 focus:ring-amber-500 cursor-pointer mt-0.5"
                    />
                  </label>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* STEP 5: Review & Save Changes */}
            {/* ================================================================= */}
            {currentStep === 5 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                      Review & Save Changes
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Verify all changes made across the 5 steps before saving.
                    </p>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Step 5 of 5
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Card 1: Course Info */}
                  <div className="rounded-xl border border-zinc-200/80 p-4.5 flex items-start justify-between gap-4 bg-zinc-50/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Course Information
                      </span>
                      <h4 className="text-sm font-bold text-zinc-900">
                        {formValues.courseName || "Untitled Course"}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-600 mt-0.5">
                        <span className="font-semibold">{category}</span>
                        <span>•</span>
                        <span>Level: {courseLevel}</span>
                        <span>•</span>
                        <span>Instructor: {formValues.instructor || "—"}</span>
                        <span>•</span>
                        <span>Duration: {formValues.duration || "—"}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                        {formValues.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer shrink-0"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Card 2: Content */}
                  <div className="rounded-xl border border-zinc-200/80 p-4.5 flex items-start justify-between gap-4 bg-zinc-50/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Course Content
                      </span>
                      <h4 className="text-sm font-bold text-zinc-900">
                        {lessons.length} Lessons Configured
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                        <span>
                          {lessons.filter((l) => l.type === "Video").length} Videos
                        </span>
                        <span>•</span>
                        <span>
                          {lessons.filter((l) => l.type === "Reading").length} Readings
                        </span>
                        <span>•</span>
                        <span>
                          {lessons.filter((l) => l.type === "Quiz").length} Quizzes
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer shrink-0"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Card 3: Final Exam */}
                  <div className="rounded-xl border border-zinc-200/80 p-4.5 flex items-start justify-between gap-4 bg-zinc-50/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Final Course Exam
                      </span>
                      <h4 className="text-sm font-bold text-zinc-900">
                        {exam ? exam.title : "No exam configured"}
                      </h4>
                      {exam && (
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                          <span>{exam.questions?.length ?? 0} Questions</span>
                          <span>•</span>
                          <span>{exam.timeLimit} Minutes</span>
                          <span>•</span>
                          <span>Pass: {exam.passingScore}%</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer shrink-0"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Card 4: Settings */}
                  <div className="rounded-xl border border-zinc-200/80 p-4.5 flex items-start justify-between gap-4 bg-zinc-50/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Settings & Permissions
                      </span>
                      <div className="flex items-center gap-3 text-xs text-zinc-600 mt-1">
                        <span className="flex items-center gap-1.5">
                          <Check className="size-3.5 text-emerald-600" />
                          Video Download:{" "}
                          <strong>
                            {formValues.allowVideoDownload ? "Enabled" : "Disabled"}
                          </strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Check className="size-3.5 text-emerald-600" />
                          PDF Download:{" "}
                          <strong>
                            {formValues.allowPdfDownload ? "Enabled" : "Disabled"}
                          </strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Check className="size-3.5 text-emerald-600" />
                          Certificate:{" "}
                          <strong>
                            {formValues.certificateOnCompletion ? "Yes" : "None"}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCourse}
                    disabled={updateCourseMutation.isPending}
                    className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    {updateCourseMutation.isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Check className="size-3.5 stroke-[3]" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
