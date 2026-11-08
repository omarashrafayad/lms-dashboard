"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Play, FileText, Video, Clock, Loader2 } from "lucide-react"
import { useCourseDetail } from "../hooks/useCourses"
import { useLessonDetail, useLessonVideos } from "@/features/dashboard/curriculum/hooks/useCurriculum"
import { LessonVideosCard } from "@/features/dashboard/curriculum/components/lesson/LessonVideosCard"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

export interface CourseLessonViewPageProps {
  courseId: string
  lessonId: string
}

export default function CourseLessonViewPage({
  courseId,
  lessonId,
}: CourseLessonViewPageProps) {
  const { data: course } = useCourseDetail(courseId)
  const { data: rawLesson, isLoading: isLessonLoading } = useLessonDetail(
    courseId,
    lessonId
  )
  const { data: serverVideos = [], isLoading: isVideosLoading } =
    useLessonVideos(lessonId)

  const lesson = React.useMemo(() => {
    return {
      id: rawLesson?.id || lessonId,
      order: rawLesson?.lessonOrder || 1,
      title: rawLesson?.name || rawLesson?.title || "Course Lesson",
      type: serverVideos.length > 0 ? "Video" : "Reading",
      duration: rawLesson?.duration ? `${rawLesson.duration} min` : "30 min",
      offlineAvailable: true,
      description:
        rawLesson?.description ||
        "This lesson covers course concepts through guided explanation and materials.",
      status: rawLesson?.status || "Active",
    }
  }, [rawLesson, lessonId, serverVideos])

  const [activeVideoUrl, setActiveVideoUrl] = React.useState<string | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)

  React.useEffect(() => {
    if (serverVideos.length > 0 && !activeVideoUrl) {
      const firstWithUrl = serverVideos.find((v: any) => v.url || v.filePath)
      if (firstWithUrl) {
        setActiveVideoUrl(firstWithUrl.url || firstWithUrl.filePath || null)
      }
    }
  }, [serverVideos, activeVideoUrl])

  if (isLessonLoading) {
    return (
      <div className="flex-1 p-12 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner title="Loading lesson..." />
      </div>
    )
  }

  // Calculate total duration from videos
  const totalDurationMinutes = serverVideos.reduce((acc: number, curr: any) => {
    const dur = typeof curr.duration === "number" ? curr.duration : 0
    return acc + Math.round(dur / 60)
  }, 0)

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20 animate-in fade-in duration-200">
        {/* Top Back Link */}
        <div>
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to Course Content</span>
          </Link>
        </div>

        {/* Lesson Header */}
        <div className="flex items-center gap-3.5">
          <div className="size-11 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
            <FileText className="size-5 stroke-[2]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                {lesson.title}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {lesson.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-normal mt-0.5">
              <span>{course?.category || "Course"}</span>
              <span>·</span>
              <span>Lesson {lesson.order}</span>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="size-3 text-zinc-400" />
                <span>{lesson.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Media / Video Player Card */}
            <div className="w-full bg-[#18181B] rounded-2xl border border-zinc-200/80 shadow-2xs aspect-video min-h-[360px] flex items-center justify-center relative overflow-hidden group">
              {activeVideoUrl && isPlaying ? (
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white relative">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="size-16 rounded-full bg-[#F59E0B] hover:bg-amber-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Play video"
                  >
                    <Play className="size-7 fill-white text-white ml-1" />
                  </button>
                  <span className="mt-3 text-xs text-zinc-300 font-medium">
                    {serverVideos.length > 0
                      ? serverVideos[0]?.title || "Play Lesson Video"
                      : "No video uploaded yet"}
                  </span>
                </div>
              )}
            </div>

            {/* About this lesson Card */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                About this lesson
              </h3>
              <p className="text-xs text-zinc-600 font-normal leading-relaxed">
                {lesson.description}
              </p>
            </div>

            {/* Lesson Videos Card (Matching lessondetails) */}
            <LessonVideosCard lessonId={lessonId} />
          </div>

          {/* Right Column (Span 1: Stat Cards) */}
          <div className="flex flex-col gap-4">
            {/* Card 1: Videos */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4 transition-all hover:border-zinc-300">
              <div className="size-11 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                <Video className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                  {serverVideos.length}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  {serverVideos.length === 1 ? "Video" : "Videos"}
                </span>
              </div>
            </div>

            {/* Card 2: Duration */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4 transition-all hover:border-zinc-300">
              <div className="size-11 rounded-xl bg-[#FEF9C3] text-[#CA8A04] flex items-center justify-center shrink-0">
                <Clock className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                  {totalDurationMinutes > 0 ? `${totalDurationMinutes}m` : lesson.duration}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  Duration
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
