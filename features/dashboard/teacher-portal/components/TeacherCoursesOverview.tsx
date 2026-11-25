"use client"

import * as React from "react"
import Link from "next/link"
import {
  BookOpen,
  Users,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart3,
  Edit,
} from "lucide-react"
import { TeacherCourse } from "../types/teacherPortal.types"
import { MOCK_TEACHER_COURSES } from "../data/mockTeacherData"

interface TeacherCoursesOverviewProps {
  courses?: TeacherCourse[]
}

export function TeacherCoursesOverview({
  courses = MOCK_TEACHER_COURSES.slice(0, 3),
}: TeacherCoursesOverviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-brand-orange" />
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
            My Assigned Courses ({MOCK_TEACHER_COURSES.length})
          </h2>
        </div>
        <Link
          href="/teacher/courses"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
        >
          <span>Manage All Courses</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col justify-between rounded-3xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-md transition-all overflow-hidden group"
          >
            {/* Thumbnail Header */}
            <div className="relative h-40 w-full overflow-hidden bg-zinc-100">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-xs text-zinc-900 shadow-2xs">
                  {course.subject}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  {course.grade}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-bold text-base leading-snug line-clamp-1">
                  {course.title}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-800">
                  <Users className="size-3.5 text-blue-600" />
                  {course.enrolledStudentsCount} Enrolled ({course.activeStudentsCount} Active)
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Avg: {course.averageExamScore}%
                </span>
              </div>

              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {course.description}
              </p>

              {/* Progress & Modules breakdown */}
              <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Syllabus Completion</span>
                  <span className="font-bold text-amber-800">{course.courseProgressPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-orange"
                    style={{ width: `${course.courseProgressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                  <span>{course.unitsCount} Units • {course.lessonsCount} Lessons</span>
                  <span>Updated: {course.lastUpdated}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                <Link
                  href="/teacher/courses"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Edit className="size-3.5" />
                  <span>Curriculum</span>
                </Link>

                <Link
                  href="/teacher/analytics"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-2xs shadow-brand-orange/20 transition-colors cursor-pointer"
                >
                  <BarChart3 className="size-3.5" />
                  <span>Analytics</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
