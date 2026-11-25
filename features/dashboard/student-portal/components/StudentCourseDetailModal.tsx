"use client"

import * as React from "react"
import {
  X,
  PlayCircle,
  Clock,
  Layers,
  User,
  GraduationCap,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRight,
  Lock,
} from "lucide-react"
import { useStudentCourse, useStudentCourseProgress } from "../hooks/useStudentPortal"
import { StudentProgressLesson } from "../types/studentApi.types"

interface StudentCourseDetailModalProps {
  courseId: string | null
  isOpen: boolean
  onClose: () => void
  onSelectLesson: (lessonId: string, courseId: string) => void
}

export function StudentCourseDetailModal({
  courseId,
  isOpen,
  onClose,
  onSelectLesson,
}: StudentCourseDetailModalProps) {
  const { data: detailData, isLoading: isDetailLoading } = useStudentCourse(courseId || "")
  const { data: progressData, isLoading: isProgressLoading } = useStudentCourseProgress(
    courseId || ""
  )

  if (!isOpen || !courseId) return null

  const course = detailData?.course || progressData?.course
  const instructor = detailData?.instructor
  const completion = progressData?.completion || {
    totalLessons: detailData?.lessonCount || 0,
    completedLessons: 0,
    percentage: 0,
  }
  const lessons: StudentProgressLesson[] = [...(progressData?.lessons || [])].sort(
    (a, b) => (a.lessonOrder ?? 0) - (b.lessonOrder ?? 0)
  )
  const enrollment = progressData?.enrollment

  const formattedEnrollDate = enrollment?.enrolledAt
    ? new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Active"

  const isLoading = isDetailLoading && isProgressLoading

  const nextTargetLesson =
    lessons.find((l) => l.status?.toLowerCase() !== "completed") || lessons[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-zinc-200/80">
        {/* Enhanced Hero Banner */}
        <div className="relative h-52 w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-950 overflow-hidden shrink-0">
          {course?.coverImageUrl ? (
            <img
              src={course.coverImageUrl}
              alt={course.name}
              className="w-full h-full object-cover opacity-55"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-end pr-12 opacity-15">
              <GraduationCap className="size-36 text-amber-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 size-9 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-900 flex items-center justify-center backdrop-blur-xs border border-white/15 transition-colors cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>

          <div className="absolute bottom-5 left-6 right-6 flex flex-col gap-2 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-orange text-white shadow-sm">
                {course?.category || "Course"}
              </span>
              {course?.difficultyLevel && (
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/15 backdrop-blur-xs text-white border border-white/15">
                  {course.difficultyLevel}
                </span>
              )}
              {course?.status && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  {course.status}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
              {course?.name || "Loading Course..."}
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-zinc-50/40">
          {isLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-zinc-200/70" />
                ))}
              </div>
              <div className="h-24 rounded-2xl bg-zinc-200/70" />
              <div className="h-44 rounded-2xl bg-zinc-200/70" />
            </div>
          ) : (
            <>
              {/* Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-0.5">
                  <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                    <User className="size-3 text-brand-orange" /> Instructor
                  </span>
                  <span className="text-xs font-bold text-zinc-900 truncate">
                    {instructor?.fullName || course?.leadInstructor || "Instructor"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-0.5">
                  <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                    <Clock className="size-3 text-brand-orange" /> Estimated Hours
                  </span>
                  <span className="text-xs font-bold text-zinc-900">
                    {course?.estimatedDurationHours ?? 0} Hours
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-0.5">
                  <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                    <BookOpen className="size-3 text-brand-orange" /> Total Lessons
                  </span>
                  <span className="text-xs font-bold text-zinc-900">
                    {completion.totalLessons} Lessons
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-0.5">
                  <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                    <Calendar className="size-3 text-brand-orange" /> Enrolled On
                  </span>
                  <span className="text-xs font-bold text-zinc-900">
                    {formattedEnrollDate}
                  </span>
                </div>
              </div>

              {/* Progress Card */}
              <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-2xs flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900">
                    Course Completion Progress
                  </span>
                  <span className="font-extrabold text-brand-orange">
                    {completion.completedLessons} / {completion.totalLessons} Lessons (
                    {completion.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-orange transition-all duration-500"
                    style={{ width: `${Math.min(100, completion.percentage)}%` }}
                  />
                </div>
              </div>

              {/* Summary & Instructor Bio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-2">
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    About This Course
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {course?.description || "No course description provided."}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-3 justify-center">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Lead Instructor
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-amber-50 border border-amber-200 text-brand-orange flex items-center justify-center font-bold shrink-0 overflow-hidden">
                      {instructor?.profilePhotoUrl ? (
                        <img
                          src={instructor.profilePhotoUrl}
                          alt={instructor.fullName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <User className="size-5" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-zinc-900 truncate">
                        {instructor?.fullName || course?.leadInstructor || "Instructor"}
                      </span>
                      <span className="text-[11px] text-zinc-500 line-clamp-2">
                        {instructor?.bio || "Course Instructor"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="size-4 text-brand-orange" />
                    Course Lessons ({lessons.length})
                  </h3>
                  <span className="text-[11px] text-zinc-500">
                    Select any lesson to open video player & materials
                  </span>
                </div>

                {lessons.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {lessons.map((lesson, idx) => {
                      const statusLower = (lesson.status || "").toLowerCase()
                      const isCompleted = statusLower === "completed"
                      const isInProgress = statusLower === "in_progress" || statusLower === "in progress"
                      const isLocked = statusLower === "locked"

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            if (!isLocked) onSelectLesson(lesson.id, courseId)
                          }}
                          className={`flex items-center justify-between p-4 rounded-2xl border bg-white transition-all ${
                            isLocked
                              ? "border-zinc-200/70 opacity-60 cursor-not-allowed"
                              : "border-zinc-200/80 hover:border-brand-orange hover:shadow-sm cursor-pointer group"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={`size-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-700"
                                  : isLocked
                                  ? "bg-zinc-100 text-zinc-400"
                                  : "bg-amber-50 text-brand-orange group-hover:bg-brand-orange group-hover:text-white"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="size-4" />
                              ) : isLocked ? (
                                <Lock className="size-4" />
                              ) : (
                                lesson.lessonOrder || idx + 1
                              )}
                            </div>

                            <div className="flex flex-col min-w-0 gap-0.5">
                              <span className="text-sm font-bold text-zinc-900 truncate group-hover:text-amber-900">
                                {lesson.name}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                                <span className="flex items-center gap-1 shrink-0">
                                  <Clock className="size-3" />
                                  {lesson.durationMinutes || 0} mins
                                </span>
                                {lesson.description && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate">{lesson.description}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                                isCompleted
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                                  : isInProgress
                                  ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                                  : "bg-zinc-100 text-zinc-600"
                              }`}
                            >
                              {(lesson.status || "Available").replace(/_/g, " ")}
                            </span>

                            {!isLocked && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-2xs group-hover:brightness-105 transition-all">
                                <PlayCircle className="size-3.5" />
                                <span>Open</span>
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-white border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
                    No lessons available in this course yet.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200/80 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          {nextTargetLesson && (
            <button
              type="button"
              onClick={() => onSelectLesson(nextTargetLesson.id, courseId)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-sm shadow-brand-orange/25 transition-all cursor-pointer"
            >
              <PlayCircle className="size-4" />
              <span>Start Lesson {nextTargetLesson.lessonOrder || 1}</span>
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
