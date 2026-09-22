"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Lock,
  Eye,
  Pencil,
  Trash2,
  FileText,
  UploadCloud,
  Check,
  Loader2,
  ArrowUpDown,
  Sparkles,
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { AddLessonStepper } from "../components/add/AddLessonStepper"
import { AddVideoModal } from "../components/add/AddVideoModal"
import { VideoContentItem, LessonStatus } from "../types/lesson.types"
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

  // --- Step 1: Curriculum Placement State ---
  const [stage, setStage] = React.useState("Primary")
  const [year, setYear] = React.useState("Grade 4")
  const [system, setSystem] = React.useState("")
  const [term, setTerm] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [chapter, setChapter] = React.useState("")
  const [unit, setUnit] = React.useState("")

  // --- Step 2: Lesson Information State ---
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [order, setOrder] = React.useState("1")
  const [duration, setDuration] = React.useState("")
  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(null)
  const thumbnailInputRef = React.useRef<HTMLInputElement>(null)

  // --- Step 3: Video Content State ---
  const [videos, setVideos] = React.useState<VideoContentItem[]>([
    {
      id: "vid-1",
      order: 1,
      title: "Video 1 — Introduction",
      duration: "06:00",
      access: "Free",
      offlineAvailable: true,
    },
  ])
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false)

  // --- Step 4: PDF State ---
  const [hasPdf, setHasPdf] = React.useState(false)
  const [pdfTitle, setPdfTitle] = React.useState("")
  const [pdfOffline, setPdfOffline] = React.useState(true)
  const [pdfFile, setPdfFile] = React.useState<File | null>(null)
  const pdfInputRef = React.useRef<HTMLInputElement>(null)

  // --- Step 5: Quiz State ---
  const [quizEnabled, setQuizEnabled] = React.useState(true)
  const [quizTitle, setQuizTitle] = React.useState("Lesson Comprehension Quiz")
  const [quizQuestionsCount, setQuizQuestionsCount] = React.useState("10")
  const [quizPassingScore, setQuizPassingScore] = React.useState("70%")
  const [quizTimeLimit, setQuizTimeLimit] = React.useState("15 min")

  // --- Step 6: Access & Offline State ---
  const [freePlanFirstVideoOnly, setFreePlanFirstVideoOnly] = React.useState(true)
  const [premiumContent, setPremiumContent] = React.useState(true)
  const [videoOfflineDownload, setVideoOfflineDownload] = React.useState(false)
  const [pdfOfflineDownload, setPdfOfflineDownload] = React.useState(false)

  // --- Step 7: Publish Status ---
  const [publishStatus, setPublishStatus] = React.useState<LessonStatus>("Published")

  // --- Thumbnail handler ---
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  // --- Video list handlers ---
  const handleAddVideo = (newVideo: VideoContentItem) => {
    setVideos((prev) => [...prev, newVideo])
    toast.success(`"${newVideo.title}" added`)
  }

  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => {
      const filtered = prev.filter((v) => v.id !== id)
      // Re-assign Free status to the first remaining video
      return filtered.map((v, i) => ({
        ...v,
        order: i + 1,
        access: i === 0 ? "Free" : "Premium",
      }))
    })
  }

  // --- PDF handler ---
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPdfFile(file)
      if (!pdfTitle) {
        setPdfTitle(file.name.replace(/\.[^/.]+$/, ""))
      }
      setHasPdf(true)
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
      if (!title.trim()) {
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

  // --- Final Submit ---
  const handleFinish = async (statusOverride?: LessonStatus) => {
    const finalStatus = statusOverride || publishStatus

    try {
      await createMutation.mutateAsync({
        stage,
        year,
        system: system || "National",
        term: term || "Term 1",
        subject: subject || "English",
        chapter: chapter || "Chapter 1",
        unit: unit || "Unit 1",
        title: title.trim() || "Untitled Lesson",
        description: description.trim(),
        order: Number(order) || 1,
        duration: duration.trim() || "30 min",
        thumbnailUrl: thumbnailPreview || undefined,
        videos,
        pdf: hasPdf
          ? {
              title: pdfTitle || "Lesson Notes.pdf",
              size: pdfFile ? `${(pdfFile.size / (1024 * 1024)).toFixed(1)} MB` : "1.2 MB",
              offlineAvailable: pdfOffline,
              file: pdfFile,
            }
          : null,
        quiz: quizEnabled
          ? {
              enabled: true,
              title: quizTitle,
              questionsCount: Number(quizQuestionsCount) || 5,
              passingScore: quizPassingScore,
              timeLimit: quizTimeLimit,
            }
          : null,
        settings: {
          freePlanFirstVideoOnly,
          premiumContent,
          videoOfflineDownload,
          pdfOfflineDownload,
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
      {/* Top Page Header matching Image 2 */}
      <PageHeader
        title="Add Lesson"
        description="Create a new lesson and its content step by step."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1200px] w-full mx-auto pb-20">
        {/* Back link matching Image 2 */}
        <div>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to Lessons</span>
          </Link>
        </div>

        {/* 7-Step Stepper matching Images 2, 3, 4 */}
        <AddLessonStepper
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* ========================================================================= */}
        {/* STEP 1: Curriculum Placement (Image 2) */}
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

            {/* Form Fields: 2-Column Grid matching Image 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Education Stage */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Education Stage
                </label>
                <Select value={stage} onValueChange={(val) => setStage(val ?? "")}>
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Primary" className="text-xs">Primary</SelectItem>
                    <SelectItem value="Preparatory" className="text-xs">Preparatory</SelectItem>
                    <SelectItem value="Secondary" className="text-xs">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Academic Year */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Academic Year
                </label>
                <Select value={year} onValueChange={(val) => setYear(val ?? "")}>
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Grade 4" className="text-xs">Grade 4</SelectItem>
                    <SelectItem value="Grade 5" className="text-xs">Grade 5</SelectItem>
                    <SelectItem value="Grade 6" className="text-xs">Grade 6</SelectItem>
                    <SelectItem value="Prep 1" className="text-xs">Prep 1</SelectItem>
                    <SelectItem value="Prep 2" className="text-xs">Prep 2</SelectItem>
                    <SelectItem value="Sec 1" className="text-xs">Sec 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Education System */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Education System
                </label>
                <Select value={system} onValueChange={(val) => setSystem(val ?? "")}>
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="National" className="text-xs">National</SelectItem>
                    <SelectItem value="American" className="text-xs">American</SelectItem>
                    <SelectItem value="British" className="text-xs">British</SelectItem>
                    <SelectItem value="IGCSE" className="text-xs">IGCSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Term */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Term
                </label>
                <Select value={term} onValueChange={(val) => setTerm(val ?? "")}>
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Term 1" className="text-xs">Term 1</SelectItem>
                    <SelectItem value="Term 2" className="text-xs">Term 2</SelectItem>
                    <SelectItem value="Full Year" className="text-xs">Full Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Subject
                </label>
                <Select value={subject} onValueChange={(val) => setSubject(val ?? "")}>
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="English" className="text-xs">English</SelectItem>
                    <SelectItem value="Mathematics" className="text-xs">Mathematics</SelectItem>
                    <SelectItem value="Science" className="text-xs">Science</SelectItem>
                    <SelectItem value="Arabic" className="text-xs">Arabic</SelectItem>
                    <SelectItem value="Social Studies" className="text-xs">Social Studies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Chapter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Chapter
                </label>
                <Select value={chapter} onValueChange={(val) => setChapter(val ?? "")}>
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Chapter 1 — Reading" className="text-xs">
                      Chapter 1 — Reading
                    </SelectItem>
                    <SelectItem value="Chapter 2 — Grammar" className="text-xs">
                      Chapter 2 — Grammar
                    </SelectItem>
                    <SelectItem value="Chapter 3 — Writing" className="text-xs">
                      Chapter 3 — Writing
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Unit */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-700">
                  Unit
                </label>
                <Select value={unit} onValueChange={(val) => setUnit(val ?? "")}>
                  <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 bg-white text-zinc-800 shadow-2xs font-normal">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Unit 1 — Short Stories" className="text-xs">
                      Unit 1 — Short Stories
                    </SelectItem>
                    <SelectItem value="Unit 2 — Non-Fiction" className="text-xs">
                      Unit 2 — Non-Fiction
                    </SelectItem>
                    <SelectItem value="Unit 3 — Poetry" className="text-xs">
                      Unit 3 — Poetry
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bottom Actions matching Image 2 */}
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
        {/* STEP 2: Lesson Information (Image 3) */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-zinc-100 pb-5">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Step 2 — Lesson Information
              </h2>
            </div>

            {/* Form Fields matching Image 3 */}
            <div className="flex flex-col gap-5">
              {/* Lesson Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Understanding Fractions"
                  className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of what students will learn."
                  className="w-full p-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs resize-none"
                />
              </div>

              {/* Lesson Order & Estimated Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Lesson Order
                  </label>
                  <input
                    type="text"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="1"
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 35 min"
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Lesson Thumbnail Dropzone matching Image 3 */}
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
                  className="w-full h-32 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-colors group"
                >
                  {thumbnailPreview ? (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        className="h-16 w-24 object-cover rounded-lg border border-zinc-200 shadow-2xs"
                      />
                      <span className="text-xs text-emerald-700 font-medium">
                        Thumbnail selected (Click to change)
                      </span>
                    </div>
                  ) : (
                    <>
                      <FileText className="size-6 text-zinc-400 group-hover:text-amber-500 transition-colors stroke-[1.5]" />
                      <span className="text-xs text-zinc-500 font-medium group-hover:text-zinc-700 transition-colors">
                        Click to upload or drag an image here
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions matching Image 3 */}
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
        {/* STEP 3: Video Content (Images 4 & 5) */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-zinc-100 pb-5">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Step 3 — Video Content
              </h2>
            </div>

            {/* Warning / Lock Banner matching Image 4 */}
            <div className="p-3.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] flex items-center gap-3 text-xs shadow-2xs">
              <Lock className="size-4 shrink-0 text-[#B45309]" />
              <span>
                The <strong className="font-semibold">first video is Free</strong> for all students. Every additional video is <strong className="font-semibold">Premium</strong>.
              </span>
            </div>

            {/* Video List matching Image 4 */}
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

                      {/* Offline status */}
                      <span className="text-xs text-zinc-400 font-normal">
                        · Offline {vid.offlineAvailable ? "on" : "off"}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions: Preview, Edit, Delete matching Image 4 */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => alert(`Previewing ${vid.title}`)}
                      className="h-8 px-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="size-3.5 text-zinc-400" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => alert(`Edit video ${vid.title}`)}
                      className="h-8 px-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Pencil className="size-3.5 text-zinc-400" />
                      <span>Edit</span>
                    </button>

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

              {/* + Add Video dashed button matching Image 4 */}
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
        {/* STEP 4: PDF */}
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
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="e.g. Chapter 1 Reading Notes & Practice Sheets"
                  className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
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
                      <span>{pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
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
                  onClick={() => setPdfOffline(!pdfOffline)}
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
        {/* STEP 5: Lesson Quiz */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="flex flex-col gap-1 border-b border-zinc-100 pb-5">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Step 5 — Lesson Quiz
              </h2>
              <p className="text-xs text-zinc-400 font-normal">
                Attach a quiz to test student comprehension for this lesson.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {/* Enable Quiz Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white shadow-2xs">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-800">
                    Enable Quiz for this Lesson
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Students will be required to pass this quiz before proceeding.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuizEnabled(!quizEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    quizEnabled ? "bg-[#F59E0B]" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      quizEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {quizEnabled && (
                <div className="flex flex-col gap-5 p-5 rounded-2xl border border-zinc-100 bg-zinc-50/50">
                  {/* Quiz Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      placeholder="e.g. Reading Comprehension Quiz"
                      className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                    />
                  </div>

                  {/* 3 Columns: Questions, Passing Score, Time Limit */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-700">
                        Total Questions
                      </label>
                      <input
                        type="text"
                        value={quizQuestionsCount}
                        onChange={(e) => setQuizQuestionsCount(e.target.value)}
                        placeholder="10"
                        className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-700">
                        Passing Score
                      </label>
                      <input
                        type="text"
                        value={quizPassingScore}
                        onChange={(e) => setQuizPassingScore(e.target.value)}
                        placeholder="70%"
                        className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-700">
                        Time Limit
                      </label>
                      <input
                        type="text"
                        value={quizTimeLimit}
                        onChange={(e) => setQuizTimeLimit(e.target.value)}
                        placeholder="15 min"
                        className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              )}
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
        {/* STEP 6: Access & Offline Settings */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="flex flex-col gap-1 border-b border-zinc-100 pb-5">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Step 6 — Access & Offline Settings
              </h2>
              <p className="text-xs text-zinc-400 font-normal">
                Control who can access this lesson and what content can be downloaded.
              </p>
            </div>

            {/* 4 Setting Toggle Cards matching LessonSettingsCard & Image 1 background */}
            <div className="flex flex-col divide-y divide-zinc-100">
              {/* Free Plan: First Video Only */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-900">
                    Free Plan: First Video Only
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Free students can view the first video only.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFreePlanFirstVideoOnly(!freePlanFirstVideoOnly)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    freePlanFirstVideoOnly ? "bg-[#F59E0B]" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      freePlanFirstVideoOnly ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Premium Content */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-900">
                    Premium Content
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Premium students get full lesson content.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPremiumContent(!premiumContent)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    premiumContent ? "bg-[#F59E0B]" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      premiumContent ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Video Offline Download */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-900">
                    Video Offline Download
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Students can save videos for offline viewing.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoOfflineDownload(!videoOfflineDownload)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    videoOfflineDownload ? "bg-[#F59E0B]" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      videoOfflineDownload ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* PDF Offline Download */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-900">
                    PDF Offline Download
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Students can download the lesson PDF.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfOfflineDownload(!pdfOfflineDownload)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    pdfOfflineDownload ? "bg-[#F59E0B]" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      pdfOfflineDownload ? "translate-x-5" : "translate-x-0"
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
        {/* STEP 7: Review & Publish */}
        {/* ========================================================================= */}
        {currentStep === 7 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="flex flex-col gap-1 border-b border-zinc-100 pb-5">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Step 7 — Review & Publish
              </h2>
              <p className="text-xs text-zinc-400 font-normal">
                Double-check all lesson details and content before making it available.
              </p>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Curriculum Placement Summary */}
              <div className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex flex-col gap-3">
                <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  Curriculum Placement
                </span>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Stage & Year:</span>
                    <span className="font-semibold text-zinc-900">{stage} • {year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subject:</span>
                    <span className="font-semibold text-zinc-900">{subject || "English"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Chapter & Unit:</span>
                    <span className="font-semibold text-zinc-900 truncate max-w-[200px]">
                      {chapter || "Chapter 1"} • {unit || "Unit 1"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lesson Overview Summary */}
              <div className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex flex-col gap-3">
                <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  Lesson Information
                </span>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Title:</span>
                    <span className="font-semibold text-zinc-900 truncate max-w-[200px]">{title || "Untitled"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Order & Duration:</span>
                    <span className="font-semibold text-zinc-900">Lesson {order} • {duration || "30 min"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Videos:</span>
                    <span className="font-semibold text-zinc-900">{videos.length} videos</span>
                  </div>
                </div>
              </div>

              {/* Resources Summary */}
              <div className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex flex-col gap-3">
                <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  Resources & Quiz
                </span>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">PDF Document:</span>
                    <span className="font-semibold text-zinc-900">{hasPdf ? pdfTitle || "Attached" : "None"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Quiz:</span>
                    <span className="font-semibold text-zinc-900">{quizEnabled ? `${quizQuestionsCount} questions` : "Disabled"}</span>
                  </div>
                </div>
              </div>

              {/* Status Setting */}
              <div className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex flex-col gap-3">
                <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  Publishing Status
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPublishStatus("Published")}
                    className={`flex-1 h-9 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                      publishStatus === "Published"
                        ? "bg-[#FEF3C7] text-zinc-900 border-[#FDE68A] shadow-2xs"
                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    Published
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublishStatus("Draft")}
                    className={`flex-1 h-9 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                      publishStatus === "Draft"
                        ? "bg-[#FEF3C7] text-zinc-900 border-[#FDE68A] shadow-2xs"
                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    Draft
                  </button>
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
                  disabled={createMutation.isPending}
                  className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
                >
                  <ChevronLeft className="size-3.5 stroke-[2.5]" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFinish("Draft")}
                  disabled={createMutation.isPending}
                  className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleFinish("Published")}
                  disabled={createMutation.isPending}
                  className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5 stroke-[3]" />
                  )}
                  <span>Publish Lesson</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Video Modal matching Image 5 */}
      <AddVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onAddVideo={handleAddVideo}
        existingVideosCount={videos.length}
      />
    </div>
  )
}
