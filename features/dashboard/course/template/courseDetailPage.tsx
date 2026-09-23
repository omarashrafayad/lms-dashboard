"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Eye, Pencil, Users, BarChart3, History } from "lucide-react"
import { CourseOverviewTab } from "../components/detail/CourseOverviewTab"
import { CourseContentTab } from "../components/detail/CourseContentTab"
import { CourseExamTab } from "../components/detail/CourseExamTab"
import { CourseStudentsTab } from "../components/detail/CourseStudentsTab"
import { CourseAnalyticsTab } from "../components/detail/CourseAnalyticsTab"
import { CourseActivityTab } from "../components/detail/CourseActivityTab"
import { useCourseDetail } from "../hooks/useCourses"
import { toast } from "sonner"

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
  const { data: course, isLoading } = useCourseDetail(courseId)

  if (isLoading || !course) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-xs text-zinc-400 font-medium animate-pulse">
          Loading course details...
        </div>
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
        {/* Back Link matching Image 2 */}
        <div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to Courses</span>
          </Link>
        </div>

        {/* Top Header Card matching Image 2 */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              {course.title}
            </h1>

            {/* Badges row matching Image 2 */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Level Badge */}
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#0284C7] border border-sky-200/60 shadow-2xs">
                {course.level}
              </span>

              {/* Stage Badge */}
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-zinc-50 text-zinc-700 border border-zinc-200/80 shadow-2xs">
                {course.stage}
              </span>

              {/* Status Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] shadow-2xs">
                <span className="size-1.5 rounded-full bg-[#16A34A]" />
                {course.status}
              </span>
            </div>
          </div>

          {/* Action Buttons matching Image 2 */}
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
              className="h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Pencil className="size-3.5" />
              <span>Edit Course</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs matching Images 2 & 3 */}
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
                      ? "font-bold text-zinc-900 border-b-2 border-[#F59E0B]"
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
          <CourseContentTab initialLessons={course.lessons} courseId={course.id} />
        )}
        {activeTab === "Course Exam" && (
          <CourseExamTab
            courseId={course.id}
            courseTitle={course.title}
            courseLevel={course.level}
            initialExam={course.exam}
          />
        )}
        {activeTab === "Students" && (
          <CourseStudentsTab
            students={course.students || []}
            totalEnrolled={course.stats.totalStudents}
            avgCompletion={course.stats.completionRate}
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
