"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users,
  BookOpen,
  GraduationCap,
  FileCheck2,
  PlayCircle,
  Clock,
  Layers,
  User,
  Calendar,
  Newspaper,
  Sparkles,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  Loader2,
  AlertCircle,
  Award,
  CheckCircle2,
  ExternalLink,
  X,
  Phone,
  Mail,
  Briefcase,
  Video,
  Mic,
} from "lucide-react"
import { useStudentHome } from "../hooks/useStudentPortal"
import {
  StudentHomeBannerItem,
  StudentHomeTeacher,
} from "../types/studentApi.types"
import { StudentCourseDetailModal } from "./StudentCourseDetailModal"
import { StudentExamTakerModal } from "./StudentExamTakerModal"
import { StudentExamResultModal } from "./StudentExamResultModal"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function StudentOverviewContent() {
  const router = useRouter()
  const { data, isLoading, isError, refetch, isFetching } = useStudentHome()

  // Modals state
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null)
  const [isCourseModalOpen, setIsCourseModalOpen] = React.useState(false)

  const [selectedExamId, setSelectedExamId] = React.useState<string | null>(null)
  const [isExamTakerOpen, setIsExamTakerOpen] = React.useState(false)
  const [isExamResultOpen, setIsExamResultOpen] = React.useState(false)

  const [selectedTeacher, setSelectedTeacher] =
    React.useState<StudentHomeTeacher | null>(null)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-44 rounded-3xl bg-zinc-200/70 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-3xl bg-zinc-200/70 animate-pulse" />
          ))}
        </div>
        <div className="p-12 rounded-3xl bg-white border border-zinc-200/80 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500">
          <Loader2 className="size-5 animate-spin text-brand-orange" />
          <span>Loading your academic overview...</span>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-12 rounded-3xl bg-white border border-rose-200 text-center flex flex-col items-center gap-3 shadow-2xs">
        <AlertCircle className="size-10 text-rose-500" />
        <h3 className="text-base font-bold text-zinc-900">
          Unable to load student overview
        </h3>
        <p className="text-xs text-zinc-500 max-w-md">
          We could not retrieve your home dashboard summary right now. Please try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  const student = data.student
  const quickAccess = data.quickAccess
  const teachers = data.teachers || []
  const courses = data.courses || []
  const subjects = data.subjects || []
  const exams = data.exams || []
  const news = data.news || []
  const banners = [...(data.banners || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const quickStats = [
    {
      label: "Subjects",
      count: quickAccess?.subjects ?? subjects.length,
      icon: GraduationCap,
      href: "/student/subjects",
      accent: "bg-amber-50 text-brand-orange border-amber-200/60",
    },
    {
      label: "Courses",
      count: quickAccess?.courses ?? courses.length,
      icon: BookOpen,
      href: "/student/courses",
      accent: "bg-blue-50 text-blue-600 border-blue-200/60",
    },
    {
      label: "Exams",
      count: quickAccess?.exams ?? exams.length,
      icon: FileCheck2,
      href: "/student/exams",
      accent: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    },
    {
      label: "Teachers",
      count: quickAccess?.teachers ?? teachers.length,
      icon: Users,
      href: "/student/sessions",
      accent: "bg-purple-50 text-purple-600 border-purple-200/60",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Welcome Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950 p-6 md:p-8 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-brand-orange/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="size-20 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-brand-orange shadow-md shrink-0 flex items-center justify-center">
              {student?.profilePhotoUrl ? (
                <img
                  src={student.profilePhotoUrl}
                  alt={student.fullName}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-9 text-brand-orange" />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-orange">
                <Sparkles className="size-4" />
                <span>{getGreeting()}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Welcome back, {student?.firstName || student?.fullName || "Student"}!
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {student?.academicStage && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/10 border border-white/15">
                    {student.academicStage}
                  </span>
                )}
                {student?.grade && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/10 border border-white/15">
                    {student.grade}
                  </span>
                )}
                {student?.educationSystem && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-orange/20 text-amber-200 border border-brand-orange/30">
                    {student.educationSystem}
                  </span>
                )}
                {student?.level && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/10 border border-white/15">
                    {student.level}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/student/subjects"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-md transition-all"
            >
              <GraduationCap className="size-4" />
              <span>Explore Subjects</span>
            </Link>
            <Link
              href="/student/courses"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-white/10 transition-all"
            >
              <PlayCircle className="size-4" />
              <span>My Courses</span>
            </Link>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 transition-all cursor-pointer"
              title="Refresh overview"
            >
              <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Quick Access Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group p-5 rounded-3xl bg-white border border-zinc-200/80 hover:border-brand-orange shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-zinc-500">{stat.label}</span>
                <span className="text-2xl font-extrabold text-zinc-900 tracking-tight">
                  {stat.count}
                </span>
                <span className="text-[11px] font-bold text-brand-orange flex items-center gap-1 mt-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Open {stat.label}</span>
                  <ChevronRight className="size-3.5" />
                </span>
              </div>
              <div
                className={`size-12 rounded-2xl border flex items-center justify-center shrink-0 ${stat.accent}`}
              >
                <Icon className="size-6" />
              </div>
            </Link>
          )
        })}
      </section>

      {/* 3. Banners Section (if present) */}
      {banners.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((banner: StudentHomeBannerItem) => (
              <div
                key={banner.id}
                className="relative h-44 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200/80 shadow-2xs group"
              >
                {banner.imageUrl && (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3 text-white">
                  <h3 className="text-base font-extrabold line-clamp-2">{banner.title}</h3>
                  {banner.linkUrl && (
                    <a
                      href={banner.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold shrink-0"
                    >
                      <span>View</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. My Subjects Quick Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
              <GraduationCap className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900">My Subjects</h2>
              <p className="text-xs text-zinc-500">
                Jump directly into chapters, units, and lesson quizzes
              </p>
            </div>
          </div>

          <Link
            href="/student/subjects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.slice(0, 4).map((subj) => (
              <div
                key={subj.id}
                onClick={() => router.push(`/student/subjects/${subj.id}`)}
                className="p-5 rounded-3xl bg-white border border-zinc-200/80 hover:border-brand-orange hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="size-10 rounded-xl bg-brand-orange text-white flex items-center justify-center">
                      <BookOpen className="size-5" />
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/60">
                      {subj.term || "Active"}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-zinc-900 line-clamp-1 mt-1">
                    {subj.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    {subj.educationStageName} • {subj.gradeName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/student/subjects/${subj.id}`)
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
            No subjects assigned yet.
          </div>
        )}
      </section>

      {/* 5. Featured Courses */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
              <BookOpen className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900">Featured Courses</h2>
              <p className="text-xs text-zinc-500">
                Continue watching lectures and tracking progress
              </p>
            </div>
          </div>

          <Link
            href="/student/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors"
          >
            <span>All Courses</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-3xl bg-white border border-zinc-200/80 shadow-2xs hover:border-brand-orange hover:shadow-md transition-all overflow-hidden"
              >
                <div className="relative h-36 w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-950">
                  {course.coverImageUrl ? (
                    <img
                      src={course.coverImageUrl}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <GraduationCap className="size-16 text-amber-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-zinc-900">
                      {course.category}
                    </span>
                    {course.difficultyLevel && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-orange text-white">
                        {course.difficultyLevel}
                      </span>
                    )}
                  </div>
                  <h3 className="absolute bottom-3 left-4 right-4 text-sm font-extrabold text-white line-clamp-1">
                    {course.name}
                  </h3>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-700 truncate">
                      {course.leadInstructor || "Instructor"}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Layers className="size-3.5 text-brand-orange" />
                      {course.lessonsCount} Lessons
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourseId(course.id)
                      setIsCourseModalOpen(true)
                    }}
                    className="w-full py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlayCircle className="size-4" />
                    <span>Continue</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
            No courses available yet.
          </div>
        )}
      </section>

      {/* 6. Two-Column: Exams & Teachers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming & Active Exams */}
        <section className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="size-5 text-brand-orange" />
              <h2 className="text-base font-extrabold text-zinc-900">
                Exams & Assessments
              </h2>
            </div>
            <Link
              href="/student/exams"
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold"
            >
              View All
            </Link>
          </div>

          {exams.length > 0 ? (
            <div className="flex flex-col gap-3">
              {exams.slice(0, 4).map((exam) => {
                const st = (exam.status || "").toLowerCase()
                const isDone =
                  st.includes("completed") || st.includes("submitted") || st.includes("passed")
                return (
                  <div
                    key={exam.id}
                    className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {exam.examType}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-500">
                          {exam.subjects?.join(", ")}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-zinc-900 truncate">
                        {exam.title}
                      </h4>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" /> {exam.durationMinutes}m
                        </span>
                        <span>•</span>
                        <span>{exam.questionCount} Questions</span>
                        <span>•</span>
                        <span>{exam.totalPoints} pts</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExamId(exam.id)
                        if (isDone) setIsExamResultOpen(true)
                        else setIsExamTakerOpen(true)
                      }}
                      className={`px-4 py-2 rounded-xl text-white text-xs font-bold shrink-0 cursor-pointer ${
                        isDone
                          ? "bg-zinc-900 hover:bg-zinc-800"
                          : "bg-brand-orange hover:brightness-105"
                      }`}
                    >
                      {isDone ? "View Result" : "Take Exam"}
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
              No exams scheduled right now.
            </div>
          )}
        </section>

        {/* Featured Teachers */}
        <section className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-5 text-brand-orange" />
              <h2 className="text-base font-extrabold text-zinc-900">
                Faculty & Teachers
              </h2>
            </div>
            <Link
              href="/student/sessions"
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold"
            >
              My Sessions
            </Link>
          </div>

          {teachers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {teachers.slice(0, 4).map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-11 rounded-full bg-amber-100 border border-amber-200 text-brand-orange flex items-center justify-center overflow-hidden shrink-0">
                      {teacher.profilePhotoUrl ? (
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
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-zinc-900 truncate">
                          {teacher.fullName}
                        </h4>
                        {teacher.isAvailable && (
                          <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500 truncate">
                        {teacher.specializations
                          ?.map((s) => s.subjectName)
                          .filter(Boolean)
                          .join(", ") ||
                          teacher.qualifications ||
                          teacher.educationStage}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {teacher.yearsOfExperience} yrs exp •{" "}
                        {teacher.sessions?.upcomingCount ?? 0} upcoming sessions
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTeacher(teacher)}
                    className="px-4 py-2 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold shrink-0 cursor-pointer"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
              No teachers listed yet.
            </div>
          )}
        </section>
      </div>

      {/* 7. Latest News & Announcements */}
      {news.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
              <Newspaper className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900">
                Latest News & Updates
              </h2>
              <p className="text-xs text-zinc-500">
                Academic announcements and platform highlights
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {news.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-white border border-zinc-200/80 shadow-2xs overflow-hidden flex flex-col"
              >
                {item.imageUrl && (
                  <div className="h-36 w-full bg-zinc-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-2 flex-1 justify-between">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-brand-orange flex items-center gap-1">
                      <Calendar className="size-3" />
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent"}
                    </span>
                    <h3 className="text-sm font-extrabold text-zinc-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Course Detail Modal */}
      <StudentCourseDetailModal
        courseId={selectedCourseId}
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSelectLesson={(lessonId, courseId) => {
          setIsCourseModalOpen(false)
          router.push(`/student/courses/${courseId}/lessons/${lessonId}`)
        }}
      />

      {/* Exam Modals */}
      <StudentExamTakerModal
        examId={selectedExamId}
        isOpen={isExamTakerOpen}
        onClose={() => setIsExamTakerOpen(false)}
        onSubmitExam={(id) => {
          setIsExamTakerOpen(false)
          setSelectedExamId(id)
          setIsExamResultOpen(true)
        }}
        onViewResult={(id) => {
          setIsExamTakerOpen(false)
          setSelectedExamId(id)
          setIsExamResultOpen(true)
        }}
      />

      <StudentExamResultModal
        examId={selectedExamId}
        isOpen={isExamResultOpen}
        onClose={() => setIsExamResultOpen(false)}
      />

      {/* Teacher Profile Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-zinc-200">
            <div className="p-6 bg-zinc-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-14 rounded-2xl bg-zinc-800 border border-brand-orange overflow-hidden flex items-center justify-center shrink-0">
                  {selectedTeacher.profilePhotoUrl ? (
                    <img
                      src={selectedTeacher.profilePhotoUrl}
                      alt={selectedTeacher.fullName}
                      className="size-full object-cover"
                    />
                  ) : (
                    <User className="size-7 text-brand-orange" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-lg font-extrabold truncate">
                    {selectedTeacher.fullName}
                  </h3>
                  <span className="text-xs text-amber-300 font-semibold truncate">
                    {selectedTeacher.qualifications || selectedTeacher.educationStage}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="size-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs">
              {/* Key Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 block">Experience</span>
                  <span className="font-bold text-zinc-900">
                    {selectedTeacher.yearsOfExperience} Years
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 block">Audio Rate</span>
                  <span className="font-bold text-zinc-900 flex items-center gap-1">
                    <Mic className="size-3 text-brand-orange" />
                    {selectedTeacher.audioPointsPerMinute} pts/min
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 block">Video Rate</span>
                  <span className="font-bold text-zinc-900 flex items-center gap-1">
                    <Video className="size-3 text-brand-orange" />
                    {selectedTeacher.videoPointsPerMinute} pts/min
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 block">Status</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    {selectedTeacher.isAvailable ? "Available" : "Busy"}
                  </span>
                </div>
              </div>

              {selectedTeacher.bio && (
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                    Biography
                  </span>
                  <p className="text-zinc-600 leading-relaxed">{selectedTeacher.bio}</p>
                </div>
              )}

              {/* Specializations */}
              {selectedTeacher.specializations?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                    Specializations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.specializations.map((sp, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60 font-semibold"
                      >
                        {sp.subjectName} • {sp.teachingLevelName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability Slots */}
              {selectedTeacher.availabilitySlots?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                    Weekly Availability
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTeacher.availabilitySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between"
                      >
                        <span className="font-bold text-zinc-800">
                          {DAY_NAMES[slot.dayOfWeek] || `Day ${slot.dayOfWeek}`}
                        </span>
                        <span className="text-zinc-600">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-zinc-100 text-zinc-600">
                {selectedTeacher.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5 text-brand-orange" />
                    {selectedTeacher.email}
                  </span>
                )}
                {selectedTeacher.phoneNumber && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-brand-orange" />
                    {selectedTeacher.phoneNumber}
                  </span>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
