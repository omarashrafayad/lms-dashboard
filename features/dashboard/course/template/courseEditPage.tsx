"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  FileQuestion,
  FileText,
  Play,
  HelpCircle,
  Clock,
  Check,
  Loader2,
  Pencil,
  Save,
} from "lucide-react"
import { AddCourseStepper } from "../components/add/AddCourseStepper"
import { CourseLessonItem, CourseExamData } from "../types/course.types"
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
  educationStage: string
  courseLevel: string
  subject: string
  description: string
  educationSystem: string
  academicYear: string
  term: string
  lessons: CourseLessonItem[]
  exam: CourseExamData | null
  allowVideoDownload: boolean
  allowPdfDownload: boolean
  certificateOnCompletion: boolean
}

export interface CourseEditPageProps {
  courseId: string
}

export default function CourseEditPage({ courseId }: CourseEditPageProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isExamBuilding, setIsExamBuilding] = React.useState(false)

  const { data: course, isLoading } = useCourseDetail(courseId)
  const updateCourseMutation = useUpdateCourse(courseId)

  const { register, watch, setValue, getValues, reset } =
    useForm<EditCourseFormValues>({
      defaultValues: {
        courseName: "",
        educationStage: "",
        courseLevel: "",
        subject: "",
        description: "",
        educationSystem: "",
        academicYear: "",
        term: "First Term",
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
        educationStage: course.stage || "Primary",
        courseLevel: course.level || "Beginner",
        subject: course.subject || "Mathematics",
        description:
          course.description ||
          "This course covers foundational mathematics concepts, problem solving, and analytical thinking through structured lessons and hands-on practice.",
        educationSystem: course.system || "National General Education",
        academicYear: course.academicYear || "Grade 1",
        term: course.term || "First Term",
        lessons: course.lessons && course.lessons.length > 0 ? course.lessons : [],
        exam: course.exam || {
          title: "Final Comprehensive Course Exam",
          timeLimit: 45,
          attemptsAllowed: 1,
          passingScore: 70,
          isPublished: true,
          questions: [
            {
              id: "q-1",
              text: "What is the sum of the interior angles of a quadrilateral?",
              type: "Multiple Choice",
              points: 1,
              required: true,
              options: [
                { id: "opt-1", text: "180 degrees", isCorrect: false },
                { id: "opt-2", text: "360 degrees", isCorrect: true },
                { id: "opt-3", text: "540 degrees", isCorrect: false },
                { id: "opt-4", text: "720 degrees", isCorrect: false },
              ],
            },
          ],
        },
        allowVideoDownload: true,
        allowPdfDownload: true,
        certificateOnCompletion: true,
      })
    }
  }, [course, courseId, reset])

  const formValues = watch()
  const stage = formValues.educationStage
  const courseLevel = formValues.courseLevel
  const subject = formValues.subject
  const lessons = formValues.lessons || []
  const exam = formValues.exam

  // Auto-calculate course level based on education stage
  React.useEffect(() => {
    if (stage === "Primary") {
      setValue("courseLevel", "Beginner")
    } else if (stage === "Preparatory") {
      setValue("courseLevel", "Intermediate")
    } else if (stage === "Secondary") {
      setValue("courseLevel", "Advanced")
    }
  }, [stage, setValue])

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formValues.courseName.trim()) {
        toast.error("Please enter a course name")
        return
      }
      if (!stage) {
        toast.error("Please select an education stage")
        return
      }
    }
    setCurrentStep((prev) => Math.min(6, prev + 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const handleQuickAddLesson = () => {
    const sampleLessons: CourseLessonItem[] = [
      {
        id: `c-les-${Date.now()}-1`,
        order: lessons.length + 1,
        title: "Mathematics: Advanced Application",
        type: "Video",
        duration: "28 min",
        offlineAvailable: true,
      },
      {
        id: `c-les-${Date.now()}-2`,
        order: lessons.length + 2,
        title: "Mathematics: Synthesis & Problems",
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

  const handleSaveExam = (examData: CourseExamData) => {
    setValue("exam", examData)
    setIsExamBuilding(false)
    toast.success("Exam details updated successfully")
  }

  const handleSaveCourse = async () => {
    try {
      await updateCourseMutation.mutateAsync({
        title: formValues.courseName,
        stage: formValues.educationStage as any,
        level: formValues.courseLevel as any,
        subject: formValues.subject,
        description: formValues.description,
        system: formValues.educationSystem,
        academicYear: formValues.academicYear,
        term: formValues.term,
        lessons: formValues.lessons,
        exam: formValues.exam || undefined,
      })

      toast.success("Course updated successfully!")
      router.push(`/courses/${courseId}`)
    } catch (err) {
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
              Update learning program, curriculum, and course settings across all 6 steps.
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
          {/* Vertical Stepper - in Edit mode, clicking any step jumps to it */}
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
                    Step 1 of 6
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

                {/* Education Stage */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Education Stage <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={stage}
                    onValueChange={(val) => setValue("educationStage", val)}
                  >
                    <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-800 bg-white focus:ring-2 focus:ring-amber-500/20">
                      <SelectValue placeholder="Select education stage" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-zinc-200">
                      <SelectItem value="Primary" className="text-xs cursor-pointer">
                        Primary
                      </SelectItem>
                      <SelectItem
                        value="Preparatory"
                        className="text-xs cursor-pointer"
                      >
                        Preparatory
                      </SelectItem>
                      <SelectItem
                        value="Secondary"
                        className="text-xs cursor-pointer"
                      >
                        Secondary
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Course Level (Auto-calculated) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-700">
                      Course Level
                    </label>
                    <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      Auto-calculated from stage
                    </span>
                  </div>
                  <input
                    type="text"
                    value={courseLevel}
                    readOnly
                    placeholder="Select an Education Stage above"
                    className="h-10 px-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-600 bg-zinc-50 cursor-not-allowed font-medium"
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Subject
                  </label>
                  <Select
                    value={subject}
                    onValueChange={(val) => setValue("subject", val)}
                  >
                    <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-800 bg-white focus:ring-2 focus:ring-amber-500/20">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-zinc-200">
                      <SelectItem
                        value="Mathematics"
                        className="text-xs cursor-pointer"
                      >
                        Mathematics
                      </SelectItem>
                      <SelectItem
                        value="Science"
                        className="text-xs cursor-pointer"
                      >
                        Science
                      </SelectItem>
                      <SelectItem
                        value="English"
                        className="text-xs cursor-pointer"
                      >
                        English
                      </SelectItem>
                      <SelectItem
                        value="Arabic"
                        className="text-xs cursor-pointer"
                      >
                        Arabic
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
            {/* STEP 2: Academic Mapping */}
            {/* ================================================================= */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Academic Mapping
                  </h2>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Step 2 of 6
                  </span>
                </div>

                {/* Education System */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Education System <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={formValues.educationSystem}
                    onValueChange={(val) => setValue("educationSystem", val)}
                  >
                    <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-800 bg-white focus:ring-2 focus:ring-amber-500/20">
                      <SelectValue placeholder="Select system" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-zinc-200">
                      <SelectItem
                        value="National General Education"
                        className="text-xs cursor-pointer"
                      >
                        National General Education
                      </SelectItem>
                      <SelectItem
                        value="Experimental Language Schools"
                        className="text-xs cursor-pointer"
                      >
                        Experimental Language Schools
                      </SelectItem>
                      <SelectItem
                        value="International Baccalaureate"
                        className="text-xs cursor-pointer"
                      >
                        International Baccalaureate
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Academic Year */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Academic Year <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={formValues.academicYear}
                    onValueChange={(val) => setValue("academicYear", val)}
                  >
                    <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-800 bg-white focus:ring-2 focus:ring-amber-500/20">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-zinc-200">
                      <SelectItem
                        value="Grade 1"
                        className="text-xs cursor-pointer"
                      >
                        Grade 1
                      </SelectItem>
                      <SelectItem
                        value="Grade 2"
                        className="text-xs cursor-pointer"
                      >
                        Grade 2
                      </SelectItem>
                      <SelectItem
                        value="Grade 3"
                        className="text-xs cursor-pointer"
                      >
                        Grade 3
                      </SelectItem>
                      <SelectItem
                        value="Grade 4"
                        className="text-xs cursor-pointer"
                      >
                        Grade 4
                      </SelectItem>
                      <SelectItem
                        value="Grade 5"
                        className="text-xs cursor-pointer"
                      >
                        Grade 5
                      </SelectItem>
                      <SelectItem
                        value="Grade 6"
                        className="text-xs cursor-pointer"
                      >
                        Grade 6
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Term */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Term <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={formValues.term}
                    onValueChange={(val) => setValue("term", val)}
                  >
                    <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-800 bg-white focus:ring-2 focus:ring-amber-500/20">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-zinc-200">
                      <SelectItem
                        value="First Term"
                        className="text-xs cursor-pointer"
                      >
                        First Term
                      </SelectItem>
                      <SelectItem
                        value="Second Term"
                        className="text-xs cursor-pointer"
                      >
                        Second Term
                      </SelectItem>
                      <SelectItem
                        value="Full Year"
                        className="text-xs cursor-pointer"
                      >
                        Full Year
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
            {/* STEP 3: Course Content */}
            {/* ================================================================= */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                      Course Content
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Organize, reorder, or add lessons to this course.
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

                {/* Lessons list */}
                {lessons.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-12 md:p-16 flex flex-col items-center justify-center text-center gap-1 bg-zinc-50/40">
                    <span className="text-sm font-bold text-zinc-900">
                      No lessons yet
                    </span>
                    <span className="text-xs text-zinc-400 font-normal">
                      Click the &ldquo;Add Lessons&rdquo; button above to add lessons.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="bg-white rounded-xl border border-zinc-200/80 p-3.5 flex items-center justify-between gap-4 shadow-2xs hover:border-zinc-300 transition-colors"
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
                              {lesson.offlineAvailable && " · Offline Ready"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(lesson.id)}
                            className="size-7 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                            title="Remove lesson"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
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
            {/* STEP 4: Course Exam */}
            {/* ================================================================= */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                      Final Course Exam
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Configure exam questions, passing score, and time duration.
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                    Required
                  </span>
                </div>

                {isExamBuilding ? (
                  <div className="pt-2">
                    <CourseExamBuilder
                      courseTitle={formValues.courseName || "Course Exam"}
                      courseLevel={formValues.courseLevel || "Beginner"}
                      initialExam={exam}
                      onSaveDraft={(savedExam) => {
                        setValue("exam", savedExam)
                        setIsExamBuilding(false)
                        toast.success("Exam draft saved")
                      }}
                      onPublish={(publishedExam) => {
                        setValue("exam", publishedExam)
                        setIsExamBuilding(false)
                        toast.success("Exam updated successfully")
                      }}
                      onBack={() => setIsExamBuilding(false)}
                    />
                  </div>
                ) : exam ? (
                  <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-amber-50 text-[#D97706] border border-amber-200/60 flex items-center justify-center shrink-0">
                          <FileQuestion className="size-5 stroke-[2]" />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-sm font-bold text-zinc-900">
                            {exam.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3 text-zinc-400" />
                              {exam.timeLimit} min
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <HelpCircle className="size-3 text-zinc-400" />
                              {exam.questions?.length ?? 0} Questions
                            </span>
                            <span>•</span>
                            <span>Passing: {exam.passingScore}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsExamBuilding(true)}
                          className="h-8 px-3 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Pencil className="size-3" />
                          <span>Edit Exam</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-12 flex flex-col items-center justify-center text-center gap-3 bg-zinc-50/40">
                    <FileQuestion className="size-8 text-zinc-400 stroke-[1.5]" />
                    <div>
                      <span className="text-sm font-bold text-zinc-900 block">
                        No Final Exam Configured
                      </span>
                      <span className="text-xs text-zinc-400 font-normal">
                        Create an exam to assess student competency upon course completion.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsExamBuilding(true)}
                      className="h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="size-3.5 stroke-[2.5]" />
                      <span>Create Final Exam</span>
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
            {/* STEP 5: Course Settings */}
            {/* ================================================================= */}
            {currentStep === 5 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Course Settings
                  </h2>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Step 5 of 6
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Allow Video Downloads */}
                  <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors cursor-pointer bg-white">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900">
                        Allow Video Downloads
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-0.5">
                        Students can download video lectures for offline viewing within the mobile app.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      {...register("allowVideoDownload")}
                      className="size-4 rounded-md border-zinc-300 text-amber-500 focus:ring-amber-500 cursor-pointer mt-0.5"
                    />
                  </label>

                  {/* Allow PDF Material Downloads */}
                  <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors cursor-pointer bg-white">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900">
                        Allow PDF Material Downloads
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-0.5">
                        Students can export and print attached study guides, reading sheets, and summaries.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      {...register("allowPdfDownload")}
                      className="size-4 rounded-md border-zinc-300 text-amber-500 focus:ring-amber-500 cursor-pointer mt-0.5"
                    />
                  </label>

                  {/* Certificate on Completion */}
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
            {/* STEP 6: Review & Save Changes */}
            {/* ================================================================= */}
            {currentStep === 6 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                      Review & Save Changes
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Verify all changes made across the 6 steps before saving.
                    </p>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Step 6 of 6
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
                        <span className="font-semibold">{formValues.educationStage}</span>
                        <span>•</span>
                        <span>Level: {formValues.courseLevel}</span>
                        <span>•</span>
                        <span>{formValues.subject}</span>
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

                  {/* Card 2: Academic Mapping */}
                  <div className="rounded-xl border border-zinc-200/80 p-4.5 flex items-start justify-between gap-4 bg-zinc-50/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Academic Mapping
                      </span>
                      <h4 className="text-sm font-bold text-zinc-900">
                        {formValues.educationSystem}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-600 mt-0.5">
                        <span>{formValues.academicYear}</span>
                        <span>•</span>
                        <span>{formValues.term}</span>
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

                  {/* Card 3: Content */}
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
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer shrink-0"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Card 4: Final Exam */}
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
                      onClick={() => setCurrentStep(4)}
                      className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer shrink-0"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Card 5: Settings */}
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
                            {formValues.certificateOnCompletion
                              ? "Enabled"
                              : "Disabled"}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Footer Save Action */}
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
                    className="h-10 px-7 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
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
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
