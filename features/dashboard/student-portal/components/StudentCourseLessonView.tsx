"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Clock,
  BookOpen,
  User,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Award,
  Loader2,
  AlertCircle,
  PlayCircle,
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { useStudentLessonDetail } from "../hooks/useStudentPortal"
import { StudentVideoPlayer } from "./StudentVideoPlayer"
import { StudentLessonMaterialsSection } from "./StudentLessonMaterialsSection"

interface StudentCourseLessonViewProps {
  courseId: string
  lessonId: string
}

export function StudentCourseLessonView({
  courseId,
  lessonId,
}: StudentCourseLessonViewProps) {
  const router = useRouter()
  const { data, isLoading, isError, refetch } = useStudentLessonDetail(lessonId)

  const course = data?.course
  const lesson = data?.lesson
  const videos = data?.videos || []
  const materials = data?.materials || []
  const quiz = data?.quiz
  const quizGroups = data?.quizGroups || []
  const nextLesson = data?.nextLesson

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={lesson?.name || "Course Lesson"}
        description={
          course
            ? `${course.name} • ${course.category || "Curriculum"}`
            : "Watch video lecture and review study materials"
        }
      />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 pb-16">
        {/* Back Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/student/courses"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors"
          >
            <ChevronLeft className="size-4" />
            <span>Back to My Courses</span>
          </Link>

          {nextLesson && (
            <button
              type="button"
              onClick={() =>
                router.push(`/student/courses/${courseId}/lessons/${nextLesson.id}`)
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              <span>Next Lesson: {nextLesson.name}</span>
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-16 rounded-3xl bg-white border border-zinc-200/80 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-brand-orange" />
            <p className="text-xs font-semibold text-zinc-500">
              Loading lesson video and curriculum materials...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="p-10 rounded-3xl bg-white border border-rose-200 text-center flex flex-col items-center gap-3">
            <AlertCircle className="size-10 text-rose-500" />
            <h3 className="text-base font-bold text-zinc-900">
              Could not load this lesson
            </h3>
            <p className="text-xs text-zinc-500 max-w-md">
              We encountered an error retrieving the lesson resources. Please try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:brightness-105 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Lesson Main Content */}
        {!isLoading && !isError && data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Video + Description + Materials + Quiz */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Video Player */}
              <StudentVideoPlayer videos={videos} lessonTitle={lesson?.name} />

              {/* About Lesson */}
              <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-orange text-white">
                      Lesson {lesson?.lessonOrder || 1}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold capitalize bg-zinc-100 text-zinc-700">
                      {(data.status || "not_started").replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
                    <Clock className="size-3.5 text-brand-orange" />
                    {lesson?.durationMinutes || 0} Minutes
                  </span>
                </div>

                <h2 className="text-lg font-extrabold text-zinc-900">
                  {lesson?.name}
                </h2>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {lesson?.description || "No additional lesson description provided."}
                </p>
              </div>

              {/* Study Materials */}
              <StudentLessonMaterialsSection materials={materials} />

              {/* Lesson Quiz Section (if present) */}
              {quiz && (
                <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-2xs flex flex-col gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
                        <HelpCircle className="size-5" />
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                          Lesson Assessment
                        </span>
                        <h3 className="text-base font-extrabold text-zinc-900">
                          {quiz.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/student/quizzes/${quiz.id}?lessonId=${lessonId}&courseId=${courseId}`
                        )
                      }
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                    >
                      <PlayCircle className="size-4" />
                      <span>{quiz.attempts > 0 ? "Continue / Review Quiz" : "Start Quiz"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs">
                    <div>
                      <span className="text-[11px] text-zinc-400 block">Questions</span>
                      <span className="font-bold text-zinc-900">{quiz.questionsCount} Questions</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-400 block">Time Limit</span>
                      <span className="font-bold text-zinc-900">{quiz.timeLimitMinutes} mins</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-400 block">Passing Score</span>
                      <span className="font-bold text-zinc-900">{quiz.passingScore}%</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-400 block">Status</span>
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          quiz.hasPassed ? "text-emerald-600" : "text-amber-700"
                        }`}
                      >
                        {quiz.hasPassed ? (
                          <>
                            <CheckCircle2 className="size-3.5" /> Passed
                          </>
                        ) : (
                          `${quiz.attempts} Attempts`
                        )}
                      </span>
                    </div>
                  </div>

                  {quizGroups.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {quizGroups.map((g) => (
                        <span
                          key={g.id}
                          className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 flex items-center gap-2"
                        >
                          <Award className="size-3.5 text-brand-orange" />
                          <span>{g.name}</span>
                          <span className="text-[10px] font-bold text-zinc-500">
                            ({g.questionsCount} Qs)
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-5">
              {/* Course Card */}
              <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60 flex items-center justify-center shrink-0">
                    <BookOpen className="size-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Course Context
                    </span>
                    <h4 className="text-sm font-bold text-zinc-900 truncate">
                      {course?.name}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-3 border-t border-zinc-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <User className="size-3.5 text-zinc-400" /> Instructor
                    </span>
                    <span className="font-bold text-zinc-800">
                      {course?.leadInstructor || "Instructor"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Category</span>
                    <span className="font-bold text-zinc-800">{course?.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Level</span>
                    <span className="font-bold text-zinc-800">{course?.difficultyLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Total Hours</span>
                    <span className="font-bold text-zinc-800">
                      {course?.estimatedDurationHours ?? 0} Hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Lesson Card */}
              {nextLesson && (
                <div className="p-5 rounded-3xl bg-zinc-900 text-white shadow-sm flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Up Next
                  </span>
                  <h4 className="text-sm font-bold leading-snug">
                    Lesson {nextLesson.lessonOrder}: {nextLesson.name}
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/student/courses/${courseId}/lessons/${nextLesson.id}`)
                    }
                    className="mt-1 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>Go to Next Lesson</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
