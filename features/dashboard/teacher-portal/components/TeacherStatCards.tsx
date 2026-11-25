"use client"

import * as React from "react"
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react"
import { TeacherStats } from "../types/teacherPortal.types"
import { MOCK_TEACHER_STATS } from "../data/mockTeacherData"

interface TeacherStatCardsProps {
  stats?: TeacherStats
}

export function TeacherStatCards({ stats = MOCK_TEACHER_STATS }: TeacherStatCardsProps) {
  const cards = [
    {
      id: "total-students",
      title: "Total Students",
      value: stats.totalStudents,
      supporting: `${stats.activeStudents} active learners`,
      icon: Users,
      iconColor: "text-brand-orange",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/60",
      badge: `${stats.activeStudents} Active`,
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "my-courses",
      title: "My Courses",
      value: stats.totalCourses,
      supporting: `${stats.publishedCourses} published • ${stats.draftCourses} draft`,
      icon: BookOpen,
      iconColor: "text-brand-orange",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/60",
      badge: `${stats.publishedCourses} Live`,
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "total-sessions",
      title: "Total Sessions",
      value: stats.totalSessions,
      supporting: `${stats.completedSessions} completed sessions`,
      icon: Calendar,
      iconColor: "text-brand-orange",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/60",
      badge: "42 Delivered",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "upcoming-sessions",
      title: "Upcoming Sessions",
      value: stats.upcomingSessions,
      supporting: `${stats.sessionsToday} scheduled today`,
      icon: Clock,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/60",
      badge: `${stats.sessionsToday} Today`,
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "pending-submissions",
      title: "Pending Submissions",
      value: stats.pendingSubmissions,
      supporting: `${stats.assignmentsWaiting} asg • ${stats.examsRequiringGrading} exams`,
      icon: ClipboardCheck,
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      badge: "Action Required",
      badgeColor: "bg-rose-100/70 text-rose-700",
    },
    {
      id: "average-score",
      title: "Average Student Score",
      value: `${stats.averageStudentScore}%`,
      supporting: `+${stats.scoreChangePercent}% vs last month`,
      icon: TrendingUp,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      badge: `+${stats.scoreChangePercent}%`,
      badgeColor: "bg-emerald-100/70 text-emerald-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            className={`p-4 rounded-2xl bg-white border ${card.borderColor} shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div
                className={`size-10 rounded-xl ${card.bgColor} flex items-center justify-center shrink-0 border ${card.borderColor}`}
              >
                <Icon className={`size-5 ${card.iconColor}`} />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-400 mb-0.5">
                {card.title}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-zinc-900 tracking-tight">
                  {card.value}
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 font-normal mt-1 truncate">
                {card.supporting}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
