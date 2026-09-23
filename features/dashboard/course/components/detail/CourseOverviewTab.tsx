"use client"

import * as React from "react"
import { BookOpen, Video, Clock, Users, Target } from "lucide-react"
import { CourseDetail } from "../../types/course.types"

export interface CourseOverviewTabProps {
  course: CourseDetail
}

export function CourseOverviewTab({ course }: CourseOverviewTabProps) {
  const statsList = [
    {
      label: "Total lessons",
      value: course.stats?.totalLessons ?? 7,
      icon: BookOpen,
      iconBg: "bg-[#F3E8FF] text-[#7E22CE]",
    },
    {
      label: "Total videos",
      value: course.stats?.totalVideos ?? 23,
      icon: Video,
      iconBg: "bg-[#E0F2FE] text-[#0284C7]",
    },
    {
      label: "Estimated duration",
      value: course.stats?.estimatedDuration ?? "5h",
      icon: Clock,
      iconBg: "bg-[#FEF9C3] text-[#CA8A04]",
    },
    {
      label: "Total students",
      value: course.stats?.totalStudents ?? 325,
      icon: Users,
      iconBg: "bg-[#FFEDD5] text-[#EA580C]",
    },
    {
      label: "Completion rate",
      value: course.stats?.completionRate ?? "74%",
      icon: Target,
      iconBg: "bg-[#F3E8FF] text-[#9333EA]",
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Left Column (Span 2) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Card 1: Course Information */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col gap-5">
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
            Course Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                COURSE NAME
              </span>
              <span className="font-semibold text-zinc-900">
                {course.title}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                LEVEL
              </span>
              <span className="font-semibold text-zinc-900">
                {course.level}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                EDUCATION STAGE
              </span>
              <span className="font-semibold text-zinc-900">
                {course.stage}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                SUBJECT
              </span>
              <span className="font-semibold text-zinc-900">
                {course.subject}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                EDUCATION SYSTEM
              </span>
              <span className="font-semibold text-zinc-900">
                {course.system}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                STATUS
              </span>
              <span className="font-semibold text-zinc-900">
                {course.status}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Description */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
            Description
          </h3>
          <p className="text-xs text-zinc-600 font-normal leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Card 3: Academic Mapping */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col gap-5">
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
            Academic Mapping
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                EDUCATION SYSTEM
              </span>
              <span className="font-semibold text-zinc-900">
                {course.system}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                ACADEMIC YEAR
              </span>
              <span className="font-semibold text-zinc-900">
                {course.academicYear}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                EDUCATION STAGE
              </span>
              <span className="font-semibold text-zinc-900">
                {course.stage}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                TERM
              </span>
              <span className="font-semibold text-zinc-900">
                {course.term || "Term 1"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Span 1: 5 Stats Cards Stack) */}
      <div className="flex flex-col gap-4">
        {statsList.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4 transition-all hover:border-zinc-300"
            >
              <div
                className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  {stat.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
