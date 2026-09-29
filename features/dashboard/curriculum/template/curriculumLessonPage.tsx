"use client"

import * as React from "react"
import Link from "next/link"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Pencil, Archive, ChevronRight, Loader2, ArrowLeft } from "lucide-react"
import { LessonOverviewCard } from "../components/lesson/LessonOverviewCard"
import { LessonVideosCard } from "../components/lesson/LessonVideosCard"
import { LessonPdfCard } from "../components/lesson/LessonPdfCard"
import { LessonQuizCard } from "../components/lesson/LessonQuizCard"
import { LessonSettingsCard } from "../components/lesson/LessonSettingsCard"
import { LessonContentModelCard } from "../components/lesson/LessonContentModelCard"
import { useLessonDetail } from "../hooks/useCurriculum"
import { LessonVideo, LessonPdf } from "../types/curriculum.types"

export interface CurriculumLessonPageProps {
  subjectId: string
  lessonId: string
}

export default function CurriculumLessonPage({
  subjectId,
  lessonId,
}: CurriculumLessonPageProps) {
  const { data: lesson, isLoading, isError } = useLessonDetail(subjectId, lessonId)
  const [currentVideos, setCurrentVideos] = React.useState<LessonVideo[]>(lesson?.videos || [])
  const [currentPdf, setCurrentPdf] = React.useState<LessonPdf | null>(lesson?.pdf || null)

  React.useEffect(() => {
    if (lesson) {
      setCurrentVideos(lesson.videos || [])
      setCurrentPdf(lesson.pdf || null)
    }
  }, [lesson])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader title="Lesson" description="Loading content..." />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="size-6 text-brand-orange animate-spin" />
        </main>
      </div>
    )
  }

  if (isError || !lesson) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader title="Lesson Not Found" description="Could not load lesson details." />
        <main className="flex-1 p-8 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-zinc-500">
            The requested lesson could not be found or failed to load.
          </p>
          <Link
            href={`/curriculum/${subjectId}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Subject</span>
          </Link>
        </main>
      </div>
    )
  }

  const lessonTitle = lesson.title || lesson.name || "Lesson"
  const lessonOrder = lesson.order ?? lesson.lessonOrder ?? 1

  return (
    <div className="flex flex-col min-h-full">
      {/* Header matching Screenshots 1 and 5 */}
      <PageHeader
        title={lessonTitle}
        description={
          lesson.id === "les-1"
            ? "Lesson content, videos, PDF, quiz, and access settings for this lesson."
            : "Lesson content, videos, PDF, quiz, access, and history."
        }
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
            href={`/curriculum/${subjectId}`}
            className="hover:text-zinc-700 transition-colors"
          >
            {lesson.subjectName || "Subject"}
          </Link>
          {lesson.chapterTitle && (
            <>
              <ChevronRight className="size-3 text-zinc-300" />
              <span className="text-zinc-500">{lesson.chapterTitle}</span>
            </>
          )}
          {lesson.unitTitle && (
            <>
              <ChevronRight className="size-3 text-zinc-300" />
              <span className="text-zinc-500">{lesson.unitTitle}</span>
            </>
          )}
          <ChevronRight className="size-3 text-zinc-300" />
          <span className="font-semibold text-zinc-800">{lessonTitle}</span>
        </div>

        {/* Lesson Top Card with Meta & Action buttons */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
          {/* Top Row: Title, Published/Active Badge, Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                Lesson {lessonOrder} — {lessonTitle}
              </h2>

              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium border text-brand-green bg-emerald-50/80 border-emerald-200/60">
                <span className="size-1.5 rounded-full bg-brand-green" />
                {lesson.id === "les-1" ? "Active" : lesson.status || "Active"}
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

          {/* Bottom Meta Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-400 font-normal pt-1 border-t border-zinc-100">
            {lesson.stage && (
              <div>
                Stage: <span className="font-medium text-zinc-700">{lesson.stage}</span>
              </div>
            )}
            {lesson.year && (
              <div>
                Year: <span className="font-medium text-zinc-700">{lesson.year}</span>
              </div>
            )}
            {lesson.system && (
              <div>
                System: <span className="font-medium text-zinc-700">{lesson.system}</span>
              </div>
            )}
            {lesson.term && (
              <div>
                Term: <span className="font-medium text-zinc-700">{lesson.term}</span>
              </div>
            )}
            <div>
              Subject:{" "}
              <span className="font-medium text-zinc-700">
                {lesson.subjectName || "Curriculum"}
              </span>
            </div>
            {lesson.chapterTitle && (
              <div>
                Chapter:{" "}
                <span className="font-medium text-zinc-700">{lesson.chapterTitle}</span>
              </div>
            )}
            {lesson.unitTitle && (
              <div>
                Unit: <span className="font-medium text-zinc-700">{lesson.unitTitle}</span>
              </div>
            )}
            <div>
              Lesson order:{" "}
              <span className="font-medium text-zinc-700">{lessonOrder}</span>
            </div>
            {lesson.accessType && (
              <div>
                Access:{" "}
                <span className="font-medium text-zinc-700">{lesson.accessType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout matching Screenshot 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Overview, Video Content, PDF, Lesson Quiz */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <LessonOverviewCard
              description={lesson.description || lesson.overview?.description || "No description provided."}
              order={lessonOrder}
              duration={lesson.duration || lesson.overview?.duration || "30 min"}
              access={lesson.access || lesson.accessType || lesson.overview?.access || "Premium"}
            />

            <LessonVideosCard
              lessonId={lessonId}
              videos={currentVideos}
              onVideosChange={setCurrentVideos}
            />

            <LessonPdfCard
              lessonId={lessonId}
              pdf={currentPdf}
              initialOfflineAvailability={lesson.pdfOfflineAvailability ?? false}
              onPdfChange={setCurrentPdf}
              onRemovePdf={() => setCurrentPdf(null)}
            />

            <LessonQuizCard lessonId={lessonId} quiz={lesson.quiz} />
          </div>

          {/* Right Column (4 cols): Access & Offline Settings, Lesson Content Model */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <LessonSettingsCard
              settings={
                lesson.settings || {
                  freePlanFirstVideoOnly: false,
                  premiumContent: true,
                  videoOfflineDownload: true,
                  pdfOfflineDownload: true,
                }
              }
            />

            <LessonContentModelCard
              videosCount={currentVideos?.length ?? 0}
              pdfCount={currentPdf ? 1 : 0}
              quizCount={lesson.quiz ? 1 : 0}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
