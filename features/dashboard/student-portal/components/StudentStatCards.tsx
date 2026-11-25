"use client"

import * as React from "react"
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileCheck2,
  Award,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { StudentStats } from "../types/studentPortal.types"
import { MOCK_STUDENT_STATS } from "../data/mockStudentData"

interface StudentStatCardsProps {
  stats?: StudentStats
}

export function StudentStatCards({ stats = MOCK_STUDENT_STATS }: StudentStatCardsProps) {
  const cards = [
    {
      id: "total-courses",
      title: "Total Courses",
      value: stats.totalCourses,
      supporting: `${stats.activeCourses} currently active`,
      icon: BookOpen,
      iconColor: "text-brand-orange",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/60",
      badge: "6 Active",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "completed-courses",
      title: "Completed Courses",
      value: stats.completedCourses,
      supporting: `${stats.courseCompletionRate}% total completion`,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      badge: `${stats.courseCompletionRate}% Rate`,
      badgeColor: "bg-emerald-100/70 text-emerald-700",
    },
    {
      id: "learning-hours",
      title: "Learning Hours",
      value: `${stats.totalLearningHours}h`,
      supporting: `+${stats.weeklyLearningHours}h this week`,
      icon: Clock,
      iconColor: "text-brand-orange",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/60",
      badge: "This Week",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "average-score",
      title: "Average Score",
      value: `${stats.averageScore}%`,
      supporting: `+${stats.scoreChangePercent}% vs last month`,
      icon: TrendingUp,
      iconColor: "text-brand-orange",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/60",
      badge: `+${stats.scoreChangePercent}%`,
      badgeColor: "bg-emerald-100/70 text-emerald-700",
    },
    {
      id: "upcoming-exams",
      title: "Upcoming Exams",
      value: stats.upcomingExams,
      supporting: `${stats.availableExamsNow} available now`,
      icon: FileCheck2,
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      badge: `${stats.availableExamsNow} Open`,
      badgeColor: "bg-rose-100/70 text-rose-700",
    },
    {
      id: "certificates",
      title: "Certificates",
      value: stats.earnedCertificates,
      supporting: `${stats.pendingCertificates} pending review`,
      icon: Award,
      iconColor: "text-brand-orange",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/60",
      badge: "Verified",
      badgeColor: "bg-amber-100 text-amber-800",
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
