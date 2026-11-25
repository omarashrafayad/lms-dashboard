"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Search,
  Clock,
  PlayCircle,
  Layers,
  ChevronLeft,
  ChevronRight,
  User,
  RefreshCw,
  GraduationCap,
} from "lucide-react"
import { useStudentCourses } from "../hooks/useStudentPortal"
import { StudentCourseItem } from "../types/studentApi.types"
import { StudentCourseDetailModal } from "./StudentCourseDetailModal"

export function StudentCoursesView() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const pageSize = 6

  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const { data, isLoading, isError, refetch, isFetching } = useStudentCourses({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  })

  const courses = data?.items || []
  const totalCount = data?.totalCount ?? courses.length
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize))

  const handleOpenCourse = (courseId: string) => {
    setSelectedCourseId(courseId)
    setIsDetailOpen(true)
  }

  const handleSelectLesson = (lessonId: string, courseId: string) => {
    setIsDetailOpen(false)
    router.push(`/student/courses/${courseId}/lessons/${lessonId}`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
              <BookOpen className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              My Courses
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/60">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Access your curriculum courses, track lesson progress, and continue learning
          </p>
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses or instructor..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40"
            />
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white transition-all shadow-2xs cursor-pointer"
            title="Refresh courses"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-zinc-200/80 p-5 flex flex-col gap-4 animate-pulse shadow-2xs"
            >
              <div className="h-44 w-full rounded-2xl bg-zinc-200" />
              <div className="h-5 w-3/4 bg-zinc-200 rounded" />
              <div className="h-3 w-1/2 bg-zinc-100 rounded" />
              <div className="h-10 bg-zinc-100 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="p-10 text-center bg-white rounded-3xl border border-rose-200 shadow-2xs flex flex-col items-center gap-3">
          <div className="size-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            !
          </div>
          <h3 className="text-base font-bold text-zinc-900">Failed to load courses</h3>
          <p className="text-xs text-zinc-500 max-w-md">
            We encountered an issue fetching your courses list. Please verify your connection or try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs cursor-pointer shadow-2xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Courses Cards Grid */}
      {!isLoading && !isError && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: StudentCourseItem) => (
            <div
              key={course.id}
              className="flex flex-col justify-between rounded-3xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-lg hover:border-brand-orange/70 transition-all duration-200 overflow-hidden group"
            >
              {/* Thumbnail Header */}
              <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-950">
                {course.coverImageUrl ? (
                  <img
                    src={course.coverImageUrl}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <GraduationCap className="size-20 text-amber-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-xs text-zinc-900 shadow-2xs truncate max-w-[140px]">
                    {course.category || "Course"}
                  </span>
                  {course.difficultyLevel && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-orange text-white shadow-2xs">
                      {course.difficultyLevel}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <h3 className="font-bold text-base leading-snug line-clamp-1">
                    {course.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-7 rounded-full bg-amber-50 border border-amber-200 text-brand-orange flex items-center justify-center shrink-0">
                      <User className="size-3.5" />
                    </div>
                    <span className="font-semibold text-zinc-700 truncate">
                      {course.leadInstructor || "Instructor"}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1 shrink-0">
                    <Clock className="size-3.5 text-zinc-400" />
                    {course.estimatedDurationHours || 0}h
                  </span>
                </div>

                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed min-h-[36px]">
                  {course.description || "Structured curriculum modules, lessons, and practice materials."}
                </p>

                {/* Lessons summary */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs">
                  <span className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1.5">
                    <Layers className="size-3.5 text-brand-orange" />
                    Curriculum Content
                  </span>
                  <span className="text-xs font-bold text-zinc-900">
                    {course.lessonsCount ?? 0} {course.lessonsCount === 1 ? "Lesson" : "Lessons"}
                  </span>
                </div>

                {/* Single Continue Action */}
                <div className="pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => handleOpenCourse(course.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs shadow-brand-orange/25 transition-all cursor-pointer"
                  >
                    <PlayCircle className="size-4" />
                    <span>Continue</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && courses.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-zinc-200/80 text-center flex flex-col items-center justify-center gap-3">
          <div className="size-16 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center">
            <BookOpen className="size-8" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900">No courses found</h3>
          <p className="text-xs text-zinc-500 max-w-md">
            {searchTerm
              ? `No courses match your search "${searchTerm}". Try adjusting your search query.`
              : "You do not have any courses assigned right now."}
          </p>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-2 px-4 py-2 rounded-xl bg-brand-orange text-white font-bold text-xs hover:brightness-105 cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <p className="text-xs text-zinc-500 font-medium">
            Showing Page <span className="font-bold text-zinc-900">{page}</span> of{" "}
            <span className="font-bold text-zinc-900">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Improved Course Detail Dialog */}
      <StudentCourseDetailModal
        courseId={selectedCourseId}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSelectLesson={handleSelectLesson}
      />
    </div>
  )
}
