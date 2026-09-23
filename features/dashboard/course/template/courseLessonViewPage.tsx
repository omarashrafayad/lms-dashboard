"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Play, FileText, Video, Clock } from "lucide-react"
import { useCourseDetail } from "../hooks/useCourses"
import { CourseLessonItem } from "../types/course.types"

export interface CourseLessonViewPageProps {
  courseId: string
  lessonId: string
}

export default function CourseLessonViewPage({
  courseId,
  lessonId,
}: CourseLessonViewPageProps) {
  const router = useRouter()
  const { data: course } = useCourseDetail(courseId)

  // Find targeted lesson or fallback to Mathematics: Core Concepts matching Image 1
  const lesson =
    course?.lessons.find((l: CourseLessonItem) => l.id === lessonId) || {
      id: "lesson-c-2",
      order: 2,
      title: "Mathematics: Core Concepts",
      type: "Reading" as const,
      duration: "32 min",
      offlineAvailable: true,
      description:
        "This lesson covers mathematics: core concepts through guided explanation and practice. Students work through core ideas step by step, then check understanding with a short activity.",
    }

  const [isPlaying, setIsPlaying] = React.useState(false)

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20 animate-in fade-in duration-200">
        {/* Top Back Link matching Image 1 */}
        <div>
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to Course Content</span>
          </Link>
        </div>

        {/* Lesson Header matching Image 1 */}
        <div className="flex items-center gap-3.5">
          <div className="size-11 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
            <FileText className="size-5 stroke-[2]" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              {lesson.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-normal mt-0.5">
              <span>{course?.subject || "Mathematics"}</span>
              <span>{lesson.type}</span>
              <div className="flex items-center gap-1">
                <Clock className="size-3 text-zinc-400" />
                <span>{lesson.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout matching Image 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Media / Video Player Card matching Image 1 */}
            <div className="w-full bg-[#F4F4F5]/70 rounded-2xl border border-zinc-200/80 shadow-2xs aspect-video min-h-[360px] flex items-center justify-center relative overflow-hidden group">
              {isPlaying ? (
                <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-white">
                  <div className="text-sm font-semibold animate-pulse">
                    Playing Video Content...
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(false)}
                    className="mt-4 px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer"
                  >
                    Pause Video
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="size-16 rounded-full bg-[#F59E0B] hover:bg-amber-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Play video"
                >
                  <Play className="size-7 fill-white text-white ml-1" />
                </button>
              )}
            </div>

            {/* About this lesson Card matching Image 1 */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                About this lesson
              </h3>
              <p className="text-xs text-zinc-600 font-normal leading-relaxed">
                {lesson.description ||
                  "This lesson covers mathematics: core concepts through guided explanation and practice. Students work through core ideas step by step, then check understanding with a short activity."}
              </p>
            </div>
          </div>

          {/* Right Column (Span 1: 2 Stat Cards) matching Image 1 */}
          <div className="flex flex-col gap-4">
            {/* Card 1: Videos */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4 transition-all hover:border-zinc-300">
              <div className="size-11 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                <Video className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                  3
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  Videos
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
                  32m
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
