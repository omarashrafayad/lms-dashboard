"use client"

import * as React from "react"
import Link from "next/link"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Pencil, Archive, ChevronRight, Loader2 } from "lucide-react"
import { LessonOverviewCard } from "@/features/dashboard/curriculum/components/lesson/LessonOverviewCard"
import { LessonVideosCard } from "@/features/dashboard/curriculum/components/lesson/LessonVideosCard"
import { LessonPdfCard } from "@/features/dashboard/curriculum/components/lesson/LessonPdfCard"
import { LessonQuizCard } from "@/features/dashboard/curriculum/components/lesson/LessonQuizCard"
import { LessonSettingsCard } from "@/features/dashboard/curriculum/components/lesson/LessonSettingsCard"
import { LessonContentModelCard } from "@/features/dashboard/curriculum/components/lesson/LessonContentModelCard"
import { LessonActivityHistoryCard } from "../components/detail/LessonActivityHistoryCard"
import { useLessonDetailById } from "../hooks/useLessons"

export interface LessonDetailPageProps {
  lessonId: string
}

export default function LessonDetailPage({ lessonId }: LessonDetailPageProps) {
  const { data: lesson, isLoading } = useLessonDetailById(lessonId)
  const [currentVideos, setCurrentVideos] = React.useState(lesson?.videos || [])
  const [currentPdf, setCurrentPdf] = React.useState(lesson?.pdf || null)

  React.useEffect(() => {
    if (lesson) {
      setCurrentVideos(lesson.videos)
      setCurrentPdf(lesson.pdf)
    }
  }, [lesson])

  if (isLoading || !lesson) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader title="Lesson" description="Loading content..." />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="size-6 text-brand-orange animate-spin" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header matching Screenshot 2 */}
      <PageHeader
        title={lesson.title}
        description="Lesson content, videos, PDF, quiz, access, and history."
      />

      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 text-xs font-normal text-zinc-400">
          <Link
            href="/curriculum"
            className="hover:text-zinc-700 transition-colors"
          >
            Curriculum
          </Link>
          <ChevronRight className="size-3 text-zinc-300" />
          <Link
            href="/curriculum"
            className="hover:text-zinc-700 transition-colors"
          >
            {lesson.subjectName}
          </Link>
          <ChevronRight className="size-3 text-zinc-300" />
          <span className="hover:text-zinc-700 transition-colors">
            {lesson.chapterTitle}
          </span>
          <ChevronRight className="size-3 text-zinc-300" />
          <span className="hover:text-zinc-700 transition-colors">
            {lesson.unitTitle}
          </span>
          <ChevronRight className="size-3 text-zinc-300" />
          <span className="font-semibold text-zinc-800">{lesson.title}</span>
        </div>

        {/* Top Lesson Card matching Screenshot 2 */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
          {/* Top Row: Title, Status Badge, Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                Lesson {lesson.order} — {lesson.title}
              </h2>

              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium border text-zinc-600 bg-zinc-100 border-zinc-200">
                <span className="size-1.5 rounded-full bg-zinc-400" />
                {lesson.status}
              </span>
            </div>

            {/* Right Action buttons */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-3.5 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
              >
                <Pencil className="size-3.5 text-zinc-500" />
                <span>Edit Lesson</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-9 px-3.5 rounded-xl border-zinc-200/80 bg-white text-red-600 hover:text-red-700 text-xs font-medium hover:bg-red-50 shadow-2xs gap-1.5 cursor-pointer"
              >
                <Archive className="size-3.5 text-red-500" />
                <span>Archive</span>
              </Button>
            </div>
          </div>

          {/* Bottom Meta Row matching Screenshot 2 */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-400 font-normal pt-1 border-t border-zinc-100">
            <div>
              Stage: <span className="font-medium text-zinc-700">{lesson.stage}</span>
            </div>
            <div>
              Year: <span className="font-medium text-zinc-700">{lesson.year}</span>
            </div>
            <div>
              System: <span className="font-medium text-zinc-700">{lesson.system}</span>
            </div>
            <div>
              Term: <span className="font-medium text-zinc-700">{lesson.term}</span>
            </div>
            <div>
              Subject:{" "}
              <span className="font-medium text-zinc-700">{lesson.subjectName}</span>
            </div>
            <div>
              Chapter:{" "}
              <span className="font-medium text-zinc-700">{lesson.chapterTitle}</span>
            </div>
            <div>
              Unit: <span className="font-medium text-zinc-700">{lesson.unitTitle}</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout matching Screenshot 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Overview, Video Content, PDF, Lesson Quiz, Activity History */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <LessonOverviewCard
              description={lesson.overview.description}
              order={lesson.overview.order}
              duration={lesson.overview.duration}
              access={lesson.overview.access}
            />

            <LessonVideosCard
              videos={currentVideos}
              onVideosChange={setCurrentVideos}
            />

            <LessonPdfCard
              pdf={currentPdf}
              initialOfflineAvailability={lesson.pdfOfflineAvailability}
              onPdfChange={setCurrentPdf}
              onRemovePdf={() => setCurrentPdf(null)}
            />

            <LessonQuizCard quiz={lesson.quiz} />

            <LessonActivityHistoryCard history={lesson.history} />
          </div>

          {/* Right Column (4 cols): Access & Offline Settings, Lesson Content Model */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <LessonSettingsCard settings={lesson.settings} />

            <LessonContentModelCard
              videosCount={currentVideos.length}
              pdfCount={currentPdf ? 1 : 0}
              quizCount={lesson.quiz ? 1 : 0}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
