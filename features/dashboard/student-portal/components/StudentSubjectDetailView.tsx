"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  BookOpen,
  PlayCircle,
  Clock,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  FolderOpen,
  Sparkles,
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import {
  useStudentSubjectDetail,
  useStudentChapterUnits,
  useStudentUnitLessons,
} from "../hooks/useStudentPortal"
import { StudentLessonMaterialsSection } from "./StudentLessonMaterialsSection"

interface StudentSubjectDetailViewProps {
  subjectId: string
}

export function StudentSubjectDetailView({ subjectId }: StudentSubjectDetailViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const chapterId = searchParams.get("chapterId") || ""
  const unitId = searchParams.get("unitId") || ""

  const {
    data: subjectData,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
    refetch: refetchSubject,
  } = useStudentSubjectDetail(subjectId)

  const {
    data: unitsData,
    isLoading: isUnitsLoading,
    isError: isUnitsError,
  } = useStudentChapterUnits(subjectId, chapterId)

  const {
    data: lessonsData,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
  } = useStudentUnitLessons(subjectId, chapterId, unitId)

  const subject = subjectData?.subject
  const counts = subjectData?.counts
  const progress = subjectData?.progress
  const teacher = subjectData?.teacher
  const chapters = React.useMemo(
    () =>
      [...(subjectData?.chapters || [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      ),
    [subjectData?.chapters]
  )
  const subjectMaterials = subjectData?.materials || []

  const units = React.useMemo(
    () => [...(unitsData || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [unitsData]
  )

  const lessons = React.useMemo(
    () =>
      [...(lessonsData?.lessons || [])].sort(
        (a, b) => (a.lessonOrder ?? 0) - (b.lessonOrder ?? 0)
      ),
    [lessonsData?.lessons]
  )

  const activeChapter = chapters.find((c) => c.id === chapterId)
  const activeUnit = units.find((u) => u.id === unitId)

  const goToChapters = () => {
    router.push(`/student/subjects/${subjectId}`)
  }

  const goToUnits = (cId: string) => {
    router.push(`/student/subjects/${subjectId}?chapterId=${cId}`)
  }

  const goToLessons = (cId: string, uId: string) => {
    router.push(`/student/subjects/${subjectId}?chapterId=${cId}&unitId=${uId}`)
  }

  const currentStage: "chapters" | "units" | "lessons" = unitId
    ? "lessons"
    : chapterId
    ? "units"
    : "chapters"

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={subject?.name || "Subject Curriculum"}
        description={
          subject
            ? `${subject.educationStageName} • ${subject.gradeName} • ${subject.term}`
            : "Navigate sequentially through Chapters, Units, and Lessons"
        }
      />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 pb-16">
        {/* Top Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/student/subjects"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors"
          >
            <ChevronLeft className="size-4" />
            <span>Back to My Subjects</span>
          </Link>

          {/* Sequential Breadcrumb Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={goToChapters}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                currentStage === "chapters"
                  ? "bg-brand-orange text-white shadow-2xs"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              1. Chapters
            </button>

            {chapterId && (
              <>
                <ChevronRight className="size-3.5 text-zinc-400" />
                <button
                  type="button"
                  onClick={() => goToUnits(chapterId)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    currentStage === "units"
                      ? "bg-brand-orange text-white shadow-2xs"
                      : "bg-zinc-800 text-white hover:bg-zinc-700"
                  }`}
                >
                  2. {activeChapter?.name || "Units"}
                </button>
              </>
            )}

            {unitId && (
              <>
                <ChevronRight className="size-3.5 text-zinc-400" />
                <span className="px-3 py-1.5 rounded-xl font-bold bg-brand-orange text-white shadow-2xs">
                  3. {lessonsData?.placement?.unit?.name || activeUnit?.name || "Lessons"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Loading Subject State */}
        {isSubjectLoading && (
          <div className="p-16 rounded-3xl bg-white border border-zinc-200/80 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-brand-orange" />
            <p className="text-xs font-semibold text-zinc-500">
              Loading subject structure...
            </p>
          </div>
        )}

        {/* Error Subject State */}
        {isSubjectError && !isSubjectLoading && (
          <div className="p-10 rounded-3xl bg-white border border-rose-200 text-center flex flex-col items-center gap-3">
            <AlertCircle className="size-10 text-rose-500" />
            <h3 className="text-base font-bold text-zinc-900">
              Failed to load subject details
            </h3>
            <button
              type="button"
              onClick={() => refetchSubject()}
              className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:brightness-105 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!isSubjectLoading && !isSubjectError && subject && (
          <>
            {/* Subject Hero & Teacher Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Subject Progress & Counts */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="size-13 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-sm shrink-0">
                      <GraduationCap className="size-7" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-extrabold text-zinc-900">
                          {subject.name}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200/60">
                          {subject.term}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {subject.educationStageName} • {subject.gradeName} •{" "}
                        {subject.educationSystemName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Counts */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col">
                    <span className="text-[11px] text-zinc-400 font-medium">Chapters</span>
                    <span className="text-lg font-extrabold text-zinc-900">
                      {counts?.chapters ?? chapters.length}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col">
                    <span className="text-[11px] text-zinc-400 font-medium">Units</span>
                    <span className="text-lg font-extrabold text-zinc-900">
                      {counts?.units ?? 0}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col">
                    <span className="text-[11px] text-zinc-400 font-medium">Lessons</span>
                    <span className="text-lg font-extrabold text-zinc-900">
                      {counts?.lessons ?? 0}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {progress && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800">Overall Subject Progress</span>
                      <span className="font-extrabold text-brand-orange">
                        {progress.completedLessons} / {progress.totalLessons} Lessons (
                        {progress.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-orange transition-all duration-500"
                        style={{ width: `${Math.min(100, progress.percentage)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Teacher Card */}
              <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-13 rounded-full bg-amber-50 border border-amber-200 text-brand-orange flex items-center justify-center overflow-hidden shrink-0">
                    {teacher?.profilePhotoUrl ? (
                      <img
                        src={teacher.profilePhotoUrl}
                        alt={teacher.fullName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <User className="size-6" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                      Subject Teacher
                    </span>
                    <h3 className="text-sm font-extrabold text-zinc-900 truncate">
                      {teacher?.fullName || "Assigned Faculty"}
                    </h3>
                    <span className="text-[11px] text-zinc-500 truncate">
                      {teacher?.teachingLevelName || subject.educationStageName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-zinc-100 text-xs text-zinc-600">
                  {teacher?.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="size-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                  )}
                  {teacher?.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-zinc-400 shrink-0" />
                      <span>{teacher.phoneNumber}</span>
                    </div>
                  )}
                  {!teacher?.email && !teacher?.phoneNumber && (
                    <span className="text-zinc-400 text-[11px]">
                      Curriculum instructor supervising lessons and assessments.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* STAGE 1: CHAPTERS LIST */}
            {currentStage === "chapters" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="size-5 text-brand-orange" />
                    <h3 className="text-base font-extrabold text-zinc-900">
                      Step 1: Select a Chapter ({chapters.length})
                    </h3>
                  </div>
                </div>

                {chapters.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {chapters.map((chapter, idx) => (
                      <div
                        key={chapter.id}
                        onClick={() => goToUnits(chapter.id)}
                        className="group p-6 rounded-3xl bg-white border border-zinc-200/80 hover:border-brand-orange hover:shadow-lg transition-all flex flex-col justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/60">
                              Chapter {chapter.order || idx + 1}
                            </span>
                            <span className="text-[11px] font-semibold text-zinc-500">
                              {chapter.unitCount} Units • {chapter.lessonCount} Lessons
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-zinc-900 group-hover:text-amber-800 transition-colors">
                            {chapter.name}
                          </h4>
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                            {chapter.description || "Explore curriculum units and topics in this chapter."}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            goToUnits(chapter.id)
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                        >
                          <span>View Units</span>
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 rounded-3xl bg-white border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
                    No chapters found for this subject yet.
                  </div>
                )}
              </div>
            )}

            {/* STAGE 2: UNITS LIST */}
            {currentStage === "units" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="size-5 text-brand-orange" />
                    <h3 className="text-base font-extrabold text-zinc-900">
                      Step 2: Units in {activeChapter?.name || "Selected Chapter"}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={goToChapters}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                    <span>All Chapters</span>
                  </button>
                </div>

                {isUnitsLoading ? (
                  <div className="p-12 rounded-3xl bg-white border border-zinc-200 flex items-center justify-center gap-2 text-xs text-zinc-500">
                    <Loader2 className="size-5 animate-spin text-brand-orange" />
                    <span>Loading chapter units...</span>
                  </div>
                ) : isUnitsError ? (
                  <div className="p-8 rounded-3xl bg-white border border-rose-200 text-center text-xs text-rose-600">
                    Failed to load units for this chapter.
                  </div>
                ) : units.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {units.map((unit, idx) => (
                      <div
                        key={unit.id}
                        onClick={() => goToLessons(chapterId, unit.id)}
                        className="group p-6 rounded-3xl bg-white border border-zinc-200/80 hover:border-brand-orange hover:shadow-lg transition-all flex flex-col justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/60">
                              Unit {unit.order || idx + 1}
                            </span>
                            <span className="text-[11px] font-semibold text-zinc-500">
                              {unit.lessonCount} Lessons
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-zinc-900 group-hover:text-amber-800 transition-colors">
                            {unit.name}
                          </h4>
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                            {unit.description || "Open this unit to study its lessons and take the quiz."}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            goToLessons(chapterId, unit.id)
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                        >
                          <span>View Lessons</span>
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 rounded-3xl bg-white border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
                    No units available in this chapter.
                  </div>
                )}
              </div>
            )}

            {/* STAGE 3: LESSONS LIST */}
            {currentStage === "lessons" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-5 text-brand-orange" />
                    <h3 className="text-base font-extrabold text-zinc-900">
                      Step 3: Lessons in{" "}
                      {lessonsData?.placement?.unit?.name || activeUnit?.name || "Unit"} (
                      {lessonsData?.lessonCount ?? lessons.length})
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => goToUnits(chapterId)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                    <span>Back to Units</span>
                  </button>
                </div>

                {isLessonsLoading ? (
                  <div className="p-12 rounded-3xl bg-white border border-zinc-200 flex items-center justify-center gap-2 text-xs text-zinc-500">
                    <Loader2 className="size-5 animate-spin text-brand-orange" />
                    <span>Loading unit lessons...</span>
                  </div>
                ) : isLessonsError ? (
                  <div className="p-8 rounded-3xl bg-white border border-rose-200 text-center text-xs text-rose-600">
                    Failed to load lessons for this unit.
                  </div>
                ) : lessons.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {lessons.map((lesson, idx) => {
                      const isCompleted = (lesson.status || "").toLowerCase() === "completed"

                      return (
                        <div
                          key={lesson.id}
                          onClick={() =>
                            router.push(`/student/subjects/${subjectId}/lessons/${lesson.id}`)
                          }
                          className="group p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-brand-orange hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div
                              className={`size-11 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 transition-colors ${
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-50 text-brand-orange group-hover:bg-brand-orange group-hover:text-white"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="size-5" />
                              ) : (
                                lesson.lessonOrder || idx + 1
                              )}
                            </div>

                            <div className="flex flex-col gap-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-zinc-900 truncate">
                                  {lesson.name}
                                </h4>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                    isCompleted
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-zinc-100 text-zinc-600"
                                  }`}
                                >
                                  {(lesson.status || "Available").replace(/_/g, " ")}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-500 line-clamp-1">
                                {lesson.description || "Watch lecture video, read materials, and take quiz."}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
                              <Clock className="size-3.5 text-zinc-400" />
                              {lesson.durationMinutes || 0} mins
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/student/subjects/${subjectId}/lessons/${lesson.id}`)
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                            >
                              <PlayCircle className="size-4" />
                              <span>Start Lesson</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-10 rounded-3xl bg-white border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
                    No lessons available in this unit yet.
                  </div>
                )}
              </div>
            )}

            {/* Subject Materials (if provided on subject level) */}
            {subjectMaterials.length > 0 && (
              <StudentLessonMaterialsSection
                materials={subjectMaterials}
                title="Subject Reference Materials & Books"
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
