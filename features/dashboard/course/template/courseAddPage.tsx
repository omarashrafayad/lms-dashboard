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
} from "lucide-react"
import { AddCourseStepper } from "../components/add/AddCourseStepper"
import {
  CourseLessonItem,
  CourseExamData,
  CourseCategory,
  CourseLevel,
} from "../types/course.types"
import { CourseExamBuilder } from "../components/detail/CourseExamBuilder"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface AddCourseFormValues {
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

export default function CourseAddPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isExamBuilding, setIsExamBuilding] = React.useState(false)

  const { register, watch, setValue } =
    useForm<AddCourseFormValues>({
      defaultValues: {
        courseName: "",
        category: "Computer Science",
        courseLevel: "Beginner",
        instructor: "Dr. Sarah Jenkins",
        duration: "10 Hours",
        language: "English",
        description: "",
        prerequisites: "None",
        targetAudience: "Open to all learners",
        lessons: [],
        exam: null,
        allowVideoDownload: true,
        allowPdfDownload: false,
        certificateOnCompletion: true,
      },
    })

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
      if (!courseLevel) {
        toast.error("Please select a course level")
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
        title: "Introduction & Core Concepts",
        type: "Video",
        duration: "25 min",
        offlineAvailable: true,
      },
      {
        id: `c-les-${Date.now()}-2`,
        order: lessons.length + 2,
        title: "Detailed Deep Dive & Exercises",
        type: "Reading",
        duration: "32 min",
        offlineAvailable: true,
      },
      {
        id: `c-les-${Date.now()}-3`,
        order: lessons.length + 3,
        title: "Hands-on Practical Assessment",
        type: "Quiz",
        duration: "35 min",
        offlineAvailable: false,
      },
    ]

    setValue("lessons", [...lessons, ...sampleLessons])
    toast.success("Lessons added to course content")
  }

  const handleRemoveLesson = (id: string) => {
    const filtered = lessons.filter((l) => l.id !== id)
    setValue(
      "lessons",
      filtered.map((l, i) => ({ ...l, order: i + 1 }))
    )
    toast.success("Lesson removed")
  }

  const handleFinish = async (status: "Published" | "Draft") => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success(
        status === "Published"
          ? "Course published successfully!"
          : "Course saved as draft!"
      )
      router.push("/courses")
    }, 600)
  }

  // Builder mode for Course Exam
  if (isExamBuilding) {
    return (
      <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto">
        <CourseExamBuilder
          courseTitle={formValues.courseName || "New Course"}
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
            toast.success("Course exam created and ready")
          }}
          onBack={() => setIsExamBuilding(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1200px] w-full mx-auto pb-20 animate-in fade-in duration-200">
        {/* Top Back Link */}
        <div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to Courses</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Add Course
            </h1>
            <p className="text-xs text-zinc-400 font-normal">
              Create a new learning program in five steps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/courses")}
              className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleFinish("Draft")}
              className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              Save Draft
            </button>
          </div>
        </div>

        {/* 2-Column Stepper & Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start pt-2">
          {/* Left Column: Vertical Stepper */}
          <div className="md:col-span-1">
            <AddCourseStepper
              currentStep={currentStep}
              onStepClick={(s) => setCurrentStep(s)}
            />
          </div>

          {/* Right Column: Main Step Content Card */}
          <div className="md:col-span-3 flex flex-col gap-6">
            {/* ================================================================= */}
            {/* STEP 1: Course Information */}
            {/* ================================================================= */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Course Information
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Enter general course details, domain category, instructor, and learning expectations.
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Course Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      COURSE NAME
                    </label>
                    <input
                      type="text"
                      {...register("courseName")}
                      placeholder="e.g. Modern Web Development Fundamentals"
                      className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                      dir="auto"
                    />
                  </div>

                  {/* Category & Course Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                        CATEGORY / TRACK
                      </label>
                      <Select
                        value={category}
                        onValueChange={(val) =>
                          setValue("category", (val as CourseCategory) ?? "Computer Science")
                        }
                      >
                        <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat} className="text-xs">
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                        DIFFICULTY LEVEL
                      </label>
                      <Select
                        value={courseLevel}
                        onValueChange={(val) =>
                          setValue("courseLevel", (val as CourseLevel) ?? "Beginner")
                        }
                      >
                        <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {LEVELS.map((lvl) => (
                            <SelectItem key={lvl} value={lvl} className="text-xs">
                              {lvl}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Instructor & Estimated Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                        LEAD INSTRUCTOR
                      </label>
                      <input
                        type="text"
                        {...register("instructor")}
                        placeholder="e.g. Dr. Sarah Jenkins"
                        className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                        ESTIMATED DURATION
                      </label>
                      <input
                        type="text"
                        {...register("duration")}
                        placeholder="e.g. 12 Hours or 6 Weeks"
                        className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Language & Target Audience */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                        INSTRUCTION LANGUAGE
                      </label>
                      <Select
                        value={formValues.language}
                        onValueChange={(val) => setValue("language", val ?? "English")}
                      >
                        <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang} value={lang} className="text-xs">
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                        TARGET AUDIENCE
                      </label>
                      <input
                        type="text"
                        {...register("targetAudience")}
                        placeholder="e.g. High schoolers, self-taught learners"
                        className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      PREREQUISITES
                    </label>
                    <input
                      type="text"
                      {...register("prerequisites")}
                      placeholder="e.g. Basic algebra knowledge, familiarity with web browsing"
                      className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      DESCRIPTION
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      placeholder="Describe what students will learn, outcomes, syllabus summary..."
                      className="w-full p-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs resize-none"
                      dir="auto"
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    disabled
                    className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-400 opacity-50 cursor-not-allowed shadow-2xs"
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
            {/* STEP 2: Course Content */}
            {/* ================================================================= */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                      Course Content
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Add video lessons, readings, quizzes, and learning materials.
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

                {/* Content Box */}
                {lessons.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-12 md:p-16 flex flex-col items-center justify-center text-center gap-1 bg-zinc-50/40">
                    <span className="text-sm font-bold text-zinc-900">
                      No lessons yet
                    </span>
                    <span className="text-xs text-zinc-400 font-normal">
                      Click the button above to add lesson modules to this course.
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
                    <p className="text-xs text-zinc-400 mt-1">
                      Design an exam that learners must pass to earn certification.
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                    Required
                  </span>
                </div>

                {/* 2 Auto Info Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      DIFFICULTY LEVEL
                    </label>
                    <div className="flex items-center h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-2xs">
                      {courseLevel || "Beginner"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      PASSING SCORE
                    </label>
                    <div className="flex items-center h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-2xs">
                      60%
                    </div>
                  </div>
                </div>

                {/* Inner Exam Box */}
                {isExamBuilding ? (
                  <div className="pt-2">
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
                        toast.success("Exam published")
                      }}
                      onBack={() => setIsExamBuilding(false)}
                    />
                  </div>
                ) : !exam ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-12 md:p-16 flex flex-col items-center justify-center text-center gap-3 bg-zinc-50/40">
                    <div className="size-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center">
                      <FileQuestion className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-zinc-900">
                        No Course Exam Created
                      </span>
                      <span className="text-xs text-zinc-400 font-normal">
                        Attach a final exam before publishing the course.
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
                          {exam.questions?.length || 2} questions · {exam.passingScore || 60}% pass · {exam.timeLimit || 30} min
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
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Course Settings
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Configure download permissions and certificate issuance.
                  </p>
                </div>

                <div className="flex flex-col divide-y divide-zinc-100">
                  {/* Video Download */}
                  <div className="py-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-zinc-900">
                        Allow Video Download
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Students can download course videos for offline study.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setValue("allowVideoDownload", !formValues.allowVideoDownload)
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formValues.allowVideoDownload ? "bg-[#F59E0B]" : "bg-zinc-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          formValues.allowVideoDownload ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* PDF Download */}
                  <div className="py-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-zinc-900">
                        Allow PDF Resource Download
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Allow downloading supplementary course files & cheatsheets.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setValue("allowPdfDownload", !formValues.allowPdfDownload)
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formValues.allowPdfDownload ? "bg-[#F59E0B]" : "bg-zinc-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          formValues.allowPdfDownload ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Certificate */}
                  <div className="py-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-zinc-900">
                        Certificate upon Completion
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Automatically issue a verified digital certificate when the course exam is passed.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "certificateOnCompletion",
                          !formValues.certificateOnCompletion
                        )
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formValues.certificateOnCompletion
                          ? "bg-[#F59E0B]"
                          : "bg-zinc-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          formValues.certificateOnCompletion
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
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
                    onClick={handleNext}
                    className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* STEP 5: Review & Publish */}
            {/* ================================================================= */}
            {currentStep === 5 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Review & Publish Course
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Review your complete course profile before making it available to students.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Card 1: Course Info */}
                  <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-zinc-900">
                      <span>Course Overview</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-[#D97706] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-zinc-600">
                      <span className="font-semibold text-zinc-900">
                        {formValues.courseName || "Untitled Course"}
                      </span>{" "}
                      · Track: <span className="font-medium text-zinc-800">{category}</span>{" "}
                      · Level: <span className="font-medium text-zinc-800">{courseLevel}</span>{" "}
                      · Instructor: <span className="font-medium text-zinc-800">{formValues.instructor || "Not specified"}</span>{" "}
                      · Duration: <span className="font-medium text-zinc-800">{formValues.duration || "Self-paced"}</span>
                    </div>
                    {formValues.prerequisites && (
                      <div className="text-[11px] text-zinc-500">
                        Prerequisites: {formValues.prerequisites}
                      </div>
                    )}
                  </div>

                  {/* Card 2: Content */}
                  <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-zinc-900">
                      <span>Course Content</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-[#D97706] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-zinc-600">
                      {lessons.length} lessons attached to curriculum
                    </div>
                  </div>

                  {/* Card 3: Final Exam */}
                  <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-zinc-900">
                      <span>Final Exam</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-[#D97706] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-zinc-600">
                      {exam
                        ? `${exam.title} (${exam.passingScore || 60}% passing score, ${exam.questions?.length || 0} questions)`
                        : "No exam attached yet"}
                    </div>
                  </div>

                  {/* Card 4: Settings */}
                  <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-zinc-900">
                      <span>Settings & Certification</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="text-[#D97706] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-zinc-600">
                      Video Download: {formValues.allowVideoDownload ? "Enabled" : "Disabled"} ·{" "}
                      PDF Download: {formValues.allowPdfDownload ? "Enabled" : "Disabled"} ·{" "}
                      Certificate: {formValues.certificateOnCompletion ? "Yes, Issued" : "None"}
                    </div>
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

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleFinish("Draft")}
                      disabled={isSubmitting}
                      className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
                    >
                      Save Draft
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFinish("Published")}
                      disabled={isSubmitting}
                      className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Check className="size-3.5 stroke-[3]" />
                      )}
                      <span>Publish Course</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
