"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Mail,
  Phone,
  HelpCircle,
  PlayCircle,
  CheckCircle2,
  Award,
  ArrowRight,
  Loader2,
  AlertCircle,
  Layers,
  Lock,
  Eye,
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import {
  useStudentSubjectLessonDetail,
  useStudentLessonQuiz,
} from "../hooks/useStudentPortal"
import { StudentVideoPlayer } from "./StudentVideoPlayer"
import { StudentLessonMaterialsSection } from "./StudentLessonMaterialsSection"

interface StudentSubjectLessonViewProps {
  subjectId: string
  lessonId: string
}

export function StudentSubjectLessonView({
  subjectId,
  lessonId,
}: StudentSubjectLessonViewProps) {
  const router = useRouter()
  const { data, isLoading, isError, refetch } = useStudentSubjectLessonDetail(lessonId)
  const { data: lessonQuizData } = useStudentLessonQuiz(lessonId)

  const lesson = data?.lesson
  const placement = data?.placement
  const teacher = data?.teacher
  const videos = data?.videos || []
  const materials = data?.materials || []
  const quiz = data?.quiz
  const quizGroups = data?.quizGroups || lessonQuizData?.groups || []
  const nextLesson = data?.nextLesson

  const effectiveQuizId = quiz?.id || lessonQuizData?.id
  const effectiveQuizTitle = quiz?.title || lessonQuizData?.title

  const backToUnitHref =
    placement?.chapter?.id && placement?.unit?.id
      ? `/student/subjects/${subjectId}?chapterId=${placement.chapter.id}&unitId=${placement.unit.id}`
      : `/student/subjects/${subjectId}`

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={lesson?.name || "Subject Lesson"}
        description={
          placement
            ? `${placement.subject.name} • ${placement.chapter.name} • ${placement.unit.name}`
            : "Watch lecture, study materials, and complete lesson quiz"
        }
      />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 pb-16">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={backToUnitHref}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors"
            >
              <ChevronLeft className="size-4" />
              <span>Back to Unit Lessons</span>
            </Link>

            {placement && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-500 pl-2">
                <span className="font-semibold text-zinc-700">{placement.subject.name}</span>
                <ChevronRight className="size-3.5" />
                <span>{placement.chapter.name}</span>
                <ChevronRight className="size-3.5" />
                <span className="text-brand-orange font-bold">{placement.unit.name}</span>
              </div>
            )}
          </div>

          {nextLesson && (
            <button
              type="button"
              onClick={() =>
                router.push(`/student/subjects/${subjectId}/lessons/${nextLesson.id}`)
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              <span>Next Lesson: {nextLesson.name}</span>
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="p-16 rounded-3xl bg-white border border-zinc-200/80 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-brand-orange" />
            <p className="text-xs font-semibold text-zinc-500">
              Loading lesson video, materials, and quiz...
            </p>
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="p-10 rounded-3xl bg-white border border-rose-200 text-center flex flex-col items-center gap-3">
            <AlertCircle className="size-10 text-rose-500" />
            <h3 className="text-base font-bold text-zinc-900">Failed to load lesson</h3>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:brightness-105 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Real Video Player */}
              <StudentVideoPlayer videos={videos} lessonTitle={lesson?.name} />

              {/* Lesson Details */}
              <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-orange text-white">
                      Lesson {lesson?.lessonOrder || 1}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold capitalize bg-zinc-100 text-zinc-700">
                      {(data.status || "available").replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
                    <Clock className="size-3.5 text-brand-orange" />
                    {lesson?.durationMinutes || 0} Minutes
                  </span>
                </div>

                <h2 className="text-lg font-extrabold text-zinc-900">{lesson?.name}</h2>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {lesson?.description || "Lesson video, study notes, and assessment."}
                </p>
              </div>

              {/* Materials */}
              <StudentLessonMaterialsSection materials={materials} />

              {/* Lesson Quiz Card */}
              <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-2xs flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="p-3 rounded-2xl bg-brand-orange text-white shadow-2xs">
                      <HelpCircle className="size-5" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                        Step 4: Lesson Quiz & Evaluation
                      </span>
                      <h3 className="text-base font-extrabold text-zinc-900">
                        {effectiveQuizTitle || "Lesson Knowledge Quiz"}
                      </h3>
                    </div>
                  </div>

                  {effectiveQuizId && (
                    <div className="flex flex-wrap items-center gap-2">
                      {(quiz?.attempts ?? 0) > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/student/quizzes/${effectiveQuizId}?lessonId=${lessonId}&subjectId=${subjectId}&view=result`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                          <span>View Result</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/student/quizzes/${effectiveQuizId}?lessonId=${lessonId}&subjectId=${subjectId}`
                          )
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                      >
                        <PlayCircle className="size-4" />
                        <span>{(quiz?.attempts ?? 0) > 0 ? "Take / Continue Quiz" : "Start Quiz"}</span>
                      </button>
                    </div>
                  )}
                </div>

                {effectiveQuizId ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs">
                      <div>
                        <span className="text-[11px] text-zinc-400 block">Questions</span>
                        <span className="font-bold text-zinc-900">
                          {quiz?.questionsCount ?? lessonQuizData?.totalQuestions ?? 0} Questions
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-400 block">Time Limit</span>
                        <span className="font-bold text-zinc-900">
                          {quiz?.timeLimitMinutes ?? lessonQuizData?.timeLimitMinutes ?? 15} mins
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-400 block">Passing Score</span>
                        <span className="font-bold text-zinc-900">
                          {quiz?.passingScore ?? lessonQuizData?.passingScore ?? 50}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-400 block">Status</span>
                        <span
                          className={`font-bold flex items-center gap-1 ${
                            quiz?.hasPassed ? "text-emerald-600" : "text-amber-700"
                          }`}
                        >
                          {quiz?.hasPassed ? (
                            <>
                              <CheckCircle2 className="size-3.5" /> Passed
                            </>
                          ) : (
                            `${quiz?.attempts ?? 0} Attempts`
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Quiz Groups Progression */}
                    {quizGroups.length > 0 && (
                      <div className="flex flex-col gap-2.5">
                        <span className="text-xs font-bold text-zinc-700">
                          Quiz Question Groups ({quizGroups.length}):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {quizGroups.map((grp) => (
                            <div
                              key={grp.id}
                              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 text-xs ${
                                grp.hasPassed
                                  ? "bg-emerald-50/70 border-emerald-200"
                                  : grp.isOpen
                                  ? "bg-amber-50/60 border-amber-200"
                                  : "bg-zinc-50 border-zinc-200 opacity-70"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {grp.hasPassed ? (
                                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                                ) : grp.isOpen ? (
                                  <Award className="size-4 text-brand-orange shrink-0" />
                                ) : (
                                  <Lock className="size-4 text-zinc-400 shrink-0" />
                                )}
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-zinc-900 truncate">
                                    {grp.name}
                                  </span>
                                  <span className="text-[10px] text-zinc-500">
                                    {grp.questionsCount} Qs • {grp.attempts} attempts
                                  </span>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-zinc-200 text-zinc-800 shrink-0">
                                {grp.percentage ?? 0}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
                    No quiz is assigned to this lesson yet.
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-5">
              {/* Teacher Card */}
              <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-full bg-amber-50 border border-amber-200 text-brand-orange flex items-center justify-center shrink-0 overflow-hidden">
                    {teacher?.profilePhotoUrl ? (
                      <img
                        src={teacher.profilePhotoUrl}
                        alt={teacher.fullName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <User className="size-5" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                      Teacher
                    </span>
                    <h4 className="text-sm font-bold text-zinc-900 truncate">
                      {teacher?.fullName || "Subject Instructor"}
                    </h4>
                    <span className="text-[11px] text-zinc-500 truncate">
                      {teacher?.teachingLevelName || placement?.subject?.educationStageName}
                    </span>
                  </div>
                </div>

                {(teacher?.email || teacher?.phoneNumber) && (
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-zinc-100 text-xs text-zinc-600">
                    {teacher.email && (
                      <span className="flex items-center gap-2 truncate">
                        <Mail className="size-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{teacher.email}</span>
                      </span>
                    )}
                    {teacher.phoneNumber && (
                      <span className="flex items-center gap-2">
                        <Phone className="size-3.5 text-zinc-400 shrink-0" />
                        <span>{teacher.phoneNumber}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Placement Card */}
              {placement && (
                <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-zinc-900">
                    <Layers className="size-4 text-brand-orange" />
                    <span>Curriculum Placement</span>
                  </div>
                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
                    <div className="flex justify-between gap-2">
                      <span className="text-zinc-400">Subject</span>
                      <span className="font-bold text-zinc-800 text-right">
                        {placement.subject.name}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-zinc-400">Chapter</span>
                      <span className="font-bold text-zinc-800 text-right">
                        {placement.chapter.name}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-zinc-400">Unit</span>
                      <span className="font-bold text-zinc-800 text-right">
                        {placement.unit.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Lesson */}
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
                      router.push(`/student/subjects/${subjectId}/lessons/${nextLesson.id}`)
                    }
                    className="mt-1 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>Next Lesson</span>
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
