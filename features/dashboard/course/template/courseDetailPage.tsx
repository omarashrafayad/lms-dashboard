"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Eye, Pencil } from "lucide-react"
import { CourseOverviewTab } from "../components/detail/CourseOverviewTab"
import { CourseContentTab } from "../components/detail/CourseContentTab"
import { CourseExamTab } from "../components/detail/CourseExamTab"
import { CourseStudentsTab } from "../components/detail/CourseStudentsTab"
import { CourseAnalyticsTab } from "../components/detail/CourseAnalyticsTab"
import { CourseActivityTab } from "../components/detail/CourseActivityTab"
import { useCourseDetail } from "../hooks/useCourses"
import { toast } from "sonner"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { CourseDetail, CourseLevel } from "../types/course.types"

export type CourseDetailTab =
  | "Overview"
  | "Course Content"
  | "Course Exam"
  | "Students"
  | "Analytics"
  | "Activity History"

export interface CourseDetailPageProps {
  courseId: string
}

export default function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<CourseDetailTab>("Overview")
  const { data: rawCourse, isLoading, isError } = useCourseDetail(courseId)

  const course: CourseDetail | null = React.useMemo(() => {
    if (!rawCourse) return null
    return {
      ...rawCourse,
      title: rawCourse.name || rawCourse.title || "Course Details",
      instructor: rawCourse.leadInstructor || rawCourse.instructor || "Instructor",
      level: ((rawCourse.difficultyLevel || rawCourse.level || "Beginner") as CourseLevel),
      duration: rawCourse.estimatedDurationHours
        ? `${rawCourse.estimatedDurationHours} Hours`
        : rawCourse.duration || "—",
      lessons: rawCourse.lessons || [],
      stats: rawCourse.stats || {
        totalLessons: rawCourse.lessons?.length || 0,
        totalVideos: 0,
        estimatedDuration: rawCourse.estimatedDurationHours
          ? `${rawCourse.estimatedDurationHours}h`
          : "0h",
        totalStudents: 0,
        completionRate: "0%",
      },
      exam: rawCourse.exam || null,
      students: rawCourse.students || [],
      analytics: rawCourse.analytics || {
        completionRate: "0%",
        avgWatchTime: "0m",
        activeLearners: 0,
        lessonEngagement: [],
      },
      activityHistory: rawCourse.activityHistory || [],
    } as CourseDetail
  }, [rawCourse])

  if (isLoading) {
    return (
      <div className="flex-1 p-12 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner title="Loading course details..." />
      </div>
    )
  }

  if (isError || !course) {
    return (
      <div className="flex-1 p-12 flex items-center justify-center min-h-[400px]">
        <GlobalError />
      </div>
    )
  }

  const tabs: CourseDetailTab[] = [
    "Overview",
    "Course Content",
    "Course Exam",
    "Students",
    "Analytics",
    "Activity History",
  ]

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20">
        {/* Back Link */}
        <div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to Courses</span>
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              {course.title}
            </h1>

            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Badge */}
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80 shadow-2xs">
                {course.category}
              </span>

              {/* Level Badge */}
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#0284C7] border border-sky-200/60 shadow-2xs">
                {course.level}
              </span>

              {/* Status Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] shadow-2xs">
                <span className="size-1.5 rounded-full bg-[#16A34A]" />
                {course.status}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => toast.info("Opening Course Preview...")}
              className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="size-3.5 text-zinc-500" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => router.push(`/courses/${course.id}/edit`)}
              className="h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Pencil className="size-3.5" />
              <span>Edit Course</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-zinc-200/80 overflow-x-auto">
          <div className="flex items-center gap-8 min-w-[600px]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-xs whitespace-nowrap cursor-pointer transition-all relative ${
                    isActive
                      ? "font-bold text-zinc-900 border-b-2 border-brand-orange"
                      : "font-medium text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === "Overview" && <CourseOverviewTab course={course} />}
        {activeTab === "Course Content" && (
          <CourseContentTab initialLessons={course.lessons || []} courseId={course.id} />
        )}
        {activeTab === "Course Exam" && (
          <CourseExamTab
            courseId={course.id}
            courseTitle={course.title || course.name || "Course"}
            courseLevel={course.level || "Beginner"}
            initialExam={course.exam}
          />
        )}
        {activeTab === "Students" && (
          <CourseStudentsTab
            students={course.students || []}
            totalEnrolled={course.stats?.totalStudents || 0}
            avgCompletion={course.stats?.completionRate || "0%"}
          />
        )}
        {activeTab === "Analytics" && (
          <CourseAnalyticsTab analytics={course.analytics} />
        )}
        {activeTab === "Activity History" && (
          <CourseActivityTab activities={course.activityHistory} />
        )}
      </main>
    </div>
  )
}
