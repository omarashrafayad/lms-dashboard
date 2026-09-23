"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Lock,
  Trash2,
  FileText,
  UploadCloud,
  ArrowUpDown,
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { AddLessonStepper } from "../components/add/AddLessonStepper"
import { AddVideoModal } from "../components/add/AddVideoModal"
import { Step5LessonQuiz } from "../components/add/Step5LessonQuiz"
import { Step6AccessOffline } from "../components/add/Step6AccessOffline"
import { Step7ReviewPublish } from "../components/add/Step7ReviewPublish"
import {
  VideoContentItem,
  LessonStatus,
  LessonFormValues,
} from "../types/lesson.types"
import { useCreateLesson } from "../hooks/useLessons"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LessonAddPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const createMutation = useCreateLesson()

  // Initialize React Hook Form with default values matching the designs
  const { register, control, watch, setValue, getValues, handleSubmit } =
    useForm<LessonFormValues>({
      defaultValues: {
        stage: "Primary",
        year: "Grade 4",
        system: "National",
        term: "Term 1",
        subject: "Arabic",
        chapter: "Chapter 1 — Numbers",
        unit: "Unit 1 — Place Value",
        title: "",
        description: "",
        order: "1",
        duration: "30 min",
        thumbnailFile: null,
        thumbnailPreview: null,
        videos: [
          {
            id: "vid-1",
            order: 1,
            title: "Video 1 — Introduction",
            duration: "06:00",
            access: "Free",
            offlineAvailable: true,
          },
        ],
        hasPdf: true,
        pdfTitle: "Worksheet.pdf",
        pdfOffline: true,
        pdfFile: null,
        quiz: {
          title: "Final Mathematics Exam",
          description: "",
          timeLimit: 30,
          passingScore: 60,
          courseLevel: "Beginner",
          isPublished: false,
          questions: [
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
          ],
        },
        allowVideoDownload: true,
        allowPdfDownload: false,
        status: "Published",
      },
    })

  // Watch key values for reactivity
  const stage = watch("stage")
  const year = watch("year")
  const system = watch("system")
  const term = watch("term")
  const subject = watch("subject")
  const chapter = watch("chapter")
  const unit = watch("unit")
  const title = watch("title")
  const description = watch("description")
  const order = watch("order")
  const duration = watch("duration")
  const thumbnailPreview = watch("thumbnailPreview")
  const videos = watch("videos") || []
  const hasPdf = watch("hasPdf")
  const pdfTitle = watch("pdfTitle")
  const pdfOffline = watch("pdfOffline")
  const pdfFile = watch("pdfFile")

  const thumbnailInputRef = React.useRef<HTMLInputElement>(null)
  const pdfInputRef = React.useRef<HTMLInputElement>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false)

  // --- Thumbnail handler ---
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setValue("thumbnailFile", file)
      setValue("thumbnailPreview", URL.createObjectURL(file))
    }
  }

  // --- Video list handlers ---
  const handleAddVideo = (newVideo: VideoContentItem) => {
    const updated = [...videos, newVideo]
    setValue("videos", updated)
    toast.success(`"${newVideo.title}" added`)
  }

  const handleDeleteVideo = (id: string) => {
    const filtered = videos.filter((v) => v.id !== id)
    const updated = filtered.map((v, i) => ({
      ...v,
      order: i + 1,
      access: (i === 0 ? "Free" : "Premium") as "Free" | "Premium",
    }))
    setValue("videos", updated)
  }

  // --- PDF handler ---
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setValue("pdfFile", file)
      if (!pdfTitle) {
        setValue("pdfTitle", file.name.replace(/\.[^/.]+$/, ""))
      }
      setValue("hasPdf", true)
    }
  }

  // --- Step Navigation Validation ---
  const handleNext = () => {
    if (currentStep === 1) {
      if (!stage || !year) {
        toast.error("Please select Education Stage and Academic Year")
        return
      }
    } else if (currentStep === 2) {
      if (!title?.trim()) {
        toast.error("Please enter a Lesson Title")
        return
      }
    } else if (currentStep === 3) {
      if (videos.length === 0) {
        toast.error("Please add at least one video")
        return
      }
    }
    setCurrentStep((prev) => Math.min(7, prev + 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  // --- Final Submit / Save Draft ---
  const handleFinish = async (statusOverride?: LessonStatus) => {
    const values = getValues()
    const finalStatus = statusOverride || values.status || "Published"

    try {
      await createMutation.mutateAsync({
        stage: values.stage,
        year: values.year,
        system: values.system || "National",
        term: values.term || "Term 1",
        subject: values.subject || "Arabic",
        chapter: values.chapter || "Chapter 1 — Numbers",
        unit: values.unit || "Unit 1 — Place Value",
        title: values.title?.trim() || "Untitled Lesson",
        description: values.description?.trim() || "",
        order: Number(values.order) || 1,
        duration: values.duration?.trim() || "30 min",
        thumbnailUrl: values.thumbnailPreview || undefined,
        videos: values.videos || [],
        pdf: values.hasPdf
          ? {
              title: values.pdfTitle || "Worksheet.pdf",
              size: values.pdfFile
                ? `${(values.pdfFile.size / (1024 * 1024)).toFixed(1)} MB`
                : "2.4 MB",
              offlineAvailable: values.pdfOffline,
              file: values.pdfFile,
            }
          : null,
        quiz: values.quiz?.title
          ? {
              enabled: true,
              title: values.quiz.title,
              questionsCount: values.quiz.questions?.length || 0,
              passingScore: `${values.quiz.passingScore || 60}%`,
              timeLimit: `${values.quiz.timeLimit || 30} min`,
              data: values.quiz,
            }
          : null,
        settings: {
          freePlanFirstVideoOnly: true,
          premiumContent: true,
          videoOfflineDownload: values.allowVideoDownload,
          pdfOfflineDownload: values.allowPdfDownload,
        },
        status: finalStatus,
      })

      toast.success(
        finalStatus === "Published"
          ? "Lesson published successfully!"
          : "Lesson saved as draft!"
      )
      router.push("/lessons")
    } catch (err: any) {
      toast.error(err?.message || "Failed to create lesson")
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Page Header */}
      <PageHeader
        title="Add Lesson"
        description="Create a new lesson and its content step by step."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1200px] w-full mx-auto pb-20">
        {/* Back link */}
        <div>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to Lessons</span>
          </Link>
        </div>

        {/* 7-Step Stepper */}
        <AddLessonStepper
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* ========================================================================= */}
        {/* STEP 1: Curriculum Placement */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-zinc-100 pb-5">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Step 1 — Curriculum Placement
              </h2>
              <p className="text-xs text-zinc-400 font-normal">
                Each selection unlocks the next field.
              </p>
            </div>

            {/* Form Fields: 2-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Education Stage */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Education Stage
                </label>
                <Select
                  value={stage}
                  onValueChange={(val) => setValue("stage", val ?? "")}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Primary" className="text-xs">
                      Primary
                    </SelectItem>
                    <SelectItem value="Preparatory" className="text-xs">
                      Preparatory
                    </SelectItem>
                    <SelectItem value="Secondary" className="text-xs">
                      Secondary
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Academic Year */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Academic Year
                </label>
                <Select
                  value={year}
                  onValueChange={(val) => setValue("year", val ?? "")}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Grade 4" className="text-xs">
                      Grade 4
                    </SelectItem>
                    <SelectItem value="Grade 5" className="text-xs">
                      Grade 5
                    </SelectItem>
                    <SelectItem value="Grade 6" className="text-xs">
                      Grade 6
                    </SelectItem>
                    <SelectItem value="Prep 1" className="text-xs">
                      Prep 1
                    </SelectItem>
                    <SelectItem value="Prep 2" className="text-xs">
                      Prep 2
                    </SelectItem>
                    <SelectItem value="Sec 1" className="text-xs">
                      Sec 1
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Education System */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Education System
                </label>
                <Select
                  value={system}
                  onValueChange={(val) => setValue("system", val ?? "")}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="National" className="text-xs">
                      National
                    </SelectItem>
                    <SelectItem value="American" className="text-xs">
                      American
                    </SelectItem>
                    <SelectItem value="British" className="text-xs">
                      British
                    </SelectItem>
                    <SelectItem value="IGCSE" className="text-xs">
                      IGCSE
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Term */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Term
                </label>
                <Select
                  value={term}
                  onValueChange={(val) => setValue("term", val ?? "")}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Term 1" className="text-xs">
                      Term 1
                    </SelectItem>
                    <SelectItem value="Term 2" className="text-xs">
                      Term 2
                    </SelectItem>
                    <SelectItem value="Full Year" className="text-xs">
                      Full Year
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Subject
                </label>
                <Select
                  value={subject}
                  onValueChange={(val) => setValue("subject", val ?? "")}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Arabic" className="text-xs">
                      Arabic
                    </SelectItem>
                    <SelectItem value="English" className="text-xs">
                      English
                    </SelectItem>
                    <SelectItem value="Mathematics" className="text-xs">
                      Mathematics
                    </SelectItem>
                    <SelectItem value="Science" className="text-xs">
                      Science
                    </SelectItem>
                    <SelectItem value="Social Studies" className="text-xs">
                      Social Studies
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Chapter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Chapter
                </label>
                <Select
                  value={chapter}
                  onValueChange={(val) => setValue("chapter", val ?? "")}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Chapter 1 — Numbers" className="text-xs">
                      Chapter 1 — Numbers
                    </SelectItem>
                    <SelectItem value="Chapter 2 — Operations" className="text-xs">
                      Chapter 2 — Operations
                    </SelectItem>
                    <SelectItem value="Chapter 3 — Geometry" className="text-xs">
                      Chapter 3 — Geometry
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Unit */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-700">
                  Unit
                </label>
                <Select
                  value={unit}
                  onValueChange={(val) => setValue("unit", val ?? "")}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Unit 1 — Place Value" className="text-xs">
                      Unit 1 — Place Value
                    </SelectItem>
                    <SelectItem value="Unit 2 — Addition & Subtraction" className="text-xs">
                      Unit 2 — Addition & Subtraction
                    </SelectItem>
                    <SelectItem value="Unit 3 — Multiplication" className="text-xs">
                      Unit 3 — Multiplication
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => router.push("/lessons")}
                className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="size-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Lesson Information */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-zinc-100 pb-5">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Step 2 — Lesson Information
              </h2>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-5">
              {/* Lesson Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Lesson Title
                </label>
                <input
                  type="text"
                  {...register("title", { required: true })}
                  placeholder="e.g. Understanding Fractions"
                  className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  dir="auto"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Briefly describe what this lesson covers..."
                  className="w-full p-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs resize-none"
                  dir="auto"
                />
              </div>

              {/* Order & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Order */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Lesson Order
                  </label>
                  <input
                    type="number"
                    {...register("order")}
                    placeholder="1"
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    {...register("duration")}
                    placeholder="e.g. 45 min"
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                    dir="auto"
                  />
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Lesson Thumbnail
                </label>
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="w-full h-32 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group relative overflow-hidden"
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <UploadCloud className="size-6 text-zinc-400 group-hover:text-amber-500 transition-colors stroke-[1.5]" />
                      <span className="text-xs text-zinc-500 font-medium group-hover:text-zinc-700 transition-colors">
                        Click to upload or drag an image here
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => router.push("/lessons")}
                className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
                >
                  <ChevronLeft className="size-3.5 stroke-[2.5]" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="size-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Video Content */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-zinc-100 pb-5">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Step 3 — Video Content
              </h2>
            </div>

            {/* Warning / Lock Banner */}
            <div className="p-3.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] flex items-center gap-3 text-xs shadow-2xs">
              <Lock className="size-4 shrink-0 text-[#B45309]" />
              <span>
                The <strong className="font-semibold">first video is Free</strong> for all students. Every additional video is <strong className="font-semibold">Premium</strong>.
              </span>
            </div>

            {/* Video List */}
            <div className="flex flex-col gap-3">
              {videos.map((vid, idx) => (
                <div
                  key={vid.id}
                  className="rounded-xl border border-zinc-200/80 bg-white p-3.5 flex items-center justify-between gap-4 shadow-2xs hover:border-zinc-300 transition-colors"
                >
                  {/* Left: Reorder handles, index pill, title & badges */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      type="button"
                      className="text-zinc-300 hover:text-zinc-600 cursor-grab active:cursor-grabbing p-0.5"
                      title="Reorder"
                    >
                      <ArrowUpDown className="size-3.5" />
                    </button>

                    <div className="size-7 rounded-lg bg-zinc-100 text-zinc-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap min-w-0">
                      <span className="text-xs font-semibold text-zinc-900 truncate">
                        {vid.title}
                      </span>

                      {/* Free / Premium Badge */}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                          vid.access === "Free"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : "bg-amber-50 text-amber-700 border-amber-200/60"
                        }`}
                      >
                        {vid.access}
                      </span>

                      {/* Duration */}
                      <span className="text-xs text-zinc-400 font-normal">
                        {vid.duration}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(vid.id)}
                      className="size-8 rounded-lg border border-zinc-200 hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors flex items-center justify-center cursor-pointer"
                      title="Delete video"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* + Add Video dashed button */}
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="w-full py-3 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Plus className="size-4 stroke-[2.5]" />
                <span>Add Video</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => router.push("/lessons")}
                className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
                >
                  <ChevronLeft className="size-3.5 stroke-[2.5]" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="size-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: PDF Resource */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="flex flex-col gap-1 border-b border-zinc-100 pb-5">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Step 4 — PDF Resource
              </h2>
              <p className="text-xs text-zinc-400 font-normal">
                Attach downloadable notes or study guides for this lesson.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {/* PDF Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  PDF Document Title
                </label>
                <input
                  type="text"
                  {...register("pdfTitle")}
                  placeholder="e.g. Chapter 1 Reading Notes & Practice Sheets"
                  className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  dir="auto"
                />
              </div>

              {/* Upload Box */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Upload PDF File
                </label>
                <input
                  type="file"
                  ref={pdfInputRef}
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="w-full h-32 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                >
                  {pdfFile ? (
                    <div className="flex items-center gap-2.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/70">
                      <FileText className="size-4" />
                      <span>
                        {pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="size-6 text-zinc-400 group-hover:text-amber-500 transition-colors stroke-[1.5]" />
                      <span className="text-xs text-zinc-500 font-medium group-hover:text-zinc-700 transition-colors">
                        Click to upload PDF document
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Offline download toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-800">
                    PDF Offline Download
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Allow registered students to download this PDF for offline reading.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setValue("pdfOffline", !pdfOffline)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    pdfOffline ? "bg-[#F59E0B]" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      pdfOffline ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => router.push("/lessons")}
                className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
                >
                  <ChevronLeft className="size-3.5 stroke-[2.5]" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="size-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: Lesson Quiz (Images 1, 2, 3) */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <Step5LessonQuiz
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
            onNext={handleNext}
            onBack={handleBack}
            onCancel={() => router.push("/lessons")}
            onSaveDraft={() => handleFinish("Draft")}
          />
        )}

        {/* ========================================================================= */}
        {/* STEP 6: Access & Offline (Image 4) */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <Step6AccessOffline
            watch={watch}
            setValue={setValue}
            onNext={handleNext}
            onBack={handleBack}
            onCancel={() => router.push("/lessons")}
          />
        )}

        {/* ========================================================================= */}
        {/* STEP 7: Review & Publish (Image 5) */}
        {/* ========================================================================= */}
        {currentStep === 7 && (
          <Step7ReviewPublish
            watch={watch}
            onGoToStep={(step) => setCurrentStep(step)}
            onBack={handleBack}
            onCancel={() => router.push("/lessons")}
            onSubmit={(status) => handleFinish(status)}
            isSubmitting={createMutation.isPending}
          />
        )}
      </main>

      {/* Add Video Modal */}
      <AddVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onAddVideo={handleAddVideo}
        existingVideosCount={videos.length}
      />
    </div>
  )
}
