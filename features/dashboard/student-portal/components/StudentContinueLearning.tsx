"use client"

import * as React from "react"
import Link from "next/link"
import {
  PlayCircle,
  Clock,
  BookOpen,
  Layers,
  ArrowRight,
  User,
  Sparkles,
} from "lucide-react"
import { Course } from "../types/studentPortal.types"
import { MOCK_STUDENT_COURSES } from "../data/mockStudentData"

interface StudentContinueLearningProps {
  courses?: Course[]
  onContinueCourse?: (course: Course) => void
}

export function StudentContinueLearning({
  courses = MOCK_STUDENT_COURSES.slice(0, 3),
  onContinueCourse,
}: StudentContinueLearningProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlayCircle className="size-5 text-brand-orange" />
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
            Continue Learning
          </h2>
        </div>
        <Link
          href="/student/courses"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
        >
          <span>View All Courses</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course, idx) => (
          <div
            key={course.id}
            className="flex flex-col justify-between rounded-2xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-md transition-all overflow-hidden group"
          >
            {/* Thumbnail Header with Subject Tag */}
            <div className="relative h-40 w-full overflow-hidden bg-zinc-100">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-xs text-zinc-900 shadow-2xs">
                  {course.subject}
                </span>
                {idx === 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 flex items-center gap-1 shadow-2xs">
                    <Sparkles className="size-2.5" /> Most Recent
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-base leading-snug line-clamp-1">
                  {course.title}
                </h3>
              </div>
            </div>

            {/* Course Body */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-4">
              {/* Teacher & Last Accessed info */}
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full overflow-hidden bg-zinc-200 border border-zinc-200">
                    <img
                      src={course.teacherAvatar}
                      alt={course.teacherName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-zinc-700 truncate max-w-[120px]">
                    {course.teacherName}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <Clock className="size-3" />
                  <span>{course.remainingHours} left</span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {course.description}
              </p>

              {/* Progress Bar & Counters */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-zinc-600">Course Progress</span>
                  <span className="text-xs font-bold text-amber-800">{course.progressPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-orange transition-all duration-500"
                    style={{ width: `${course.progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
                  <span>{course.completedLessonsCount} / {course.lessonsCount} lessons</span>
                  <span>{course.completedChaptersCount} / {course.chaptersCount} chapters</span>
                </div>
              </div>

              {/* Last Accessed & Continue Action */}
              <div className="flex flex-col gap-2 pt-1 border-t border-zinc-100">
                <div className="flex flex-col text-[11px] text-zinc-400">
                  <span className="font-medium text-zinc-700 truncate">
                    📌 {course.lastAccessedLesson}
                  </span>
                  <span>Accessed: {course.lastAccessedDate}</span>
                </div>

                <Link
                  href={`/student/courses`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs transition-colors shadow-sm shadow-brand-orange/20 cursor-pointer"
                >
                  <PlayCircle className="size-4" />
                  <span>Continue Lesson</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
