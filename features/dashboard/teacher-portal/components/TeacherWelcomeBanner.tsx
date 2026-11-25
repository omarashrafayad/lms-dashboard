"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  Plus,
  BookOpen,
  FileCheck2,
  Calendar,
  Users,
  Video,
  Award,
  ClipboardList,
} from "lucide-react"
import { MOCK_TEACHER_PROFILE } from "../data/mockTeacherData"

interface TeacherWelcomeBannerProps {
  onCreateLessonClick?: () => void
  onCreateExamClick?: () => void
  onScheduleSessionClick?: () => void
}

export function TeacherWelcomeBanner({
  onCreateLessonClick,
  onCreateExamClick,
  onScheduleSessionClick,
}: TeacherWelcomeBannerProps) {
  const profile = MOCK_TEACHER_PROFILE

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#241908] text-white p-6 md:p-8 border border-amber-500/20 shadow-xl shadow-black/20">
      {/* Decorative Brand Orange Glow Orbs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-brand-orange/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-[#FFB543]/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top Info Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative size-20 rounded-2xl overflow-hidden border-2 border-brand-orange/60 shadow-lg shadow-brand-orange/15 shrink-0 bg-zinc-900">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 size-3 rounded-full bg-brand-orange ring-2 ring-zinc-950" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-orange/20 text-[#FFB543] border border-brand-orange/30 flex items-center gap-1">
                  <Sparkles className="size-3 text-[#FFB543]" />
                  {profile.academicYear} • {profile.semester}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-zinc-200 border border-white/10">
                  {profile.assignedSubjects.join(" & ")}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30">
                  ★ Senior Faculty Instructor
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {getGreeting()}, {profile.fullName}!
              </h1>
              <p className="text-sm text-zinc-300 font-normal">
                {profile.title} • {profile.specialization}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
          <span className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider">
            Quick Faculty Actions:
          </span>
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/teacher/content"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-all shadow-sm hover:border-brand-orange/40 cursor-pointer"
            >
              <Plus className="size-3.5 text-brand-orange" />
              <span>Create Lesson</span>
            </Link>

            <Link
              href="/teacher/exams"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs transition-all shadow-sm shadow-brand-orange/25 cursor-pointer"
            >
              <FileCheck2 className="size-3.5 text-white" />
              <span>Create Exam</span>
            </Link>

            <Link
              href="/teacher/assignments"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-all shadow-sm hover:border-brand-orange/40 cursor-pointer"
            >
              <ClipboardList className="size-3.5 text-amber-300" />
              <span>Create Assignment</span>
            </Link>

            <Link
              href="/teacher/sessions"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-all shadow-sm hover:border-brand-orange/40 cursor-pointer"
            >
              <Calendar className="size-3.5 text-brand-orange" />
              <span>Schedule Session</span>
            </Link>

            <Link
              href="/teacher/students"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-all shadow-sm hover:border-brand-orange/40 cursor-pointer"
            >
              <Users className="size-3.5 text-zinc-300" />
              <span>View Students Roster</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
