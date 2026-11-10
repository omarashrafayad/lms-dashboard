"use client"

import * as React from "react"
import { Users, GraduationCap, UserCheck, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardOverviewResponse } from "../types/overview.types"

export interface OverviewStatsProps {
  data?: DashboardOverviewResponse
}

export function OverviewStats({ data }: OverviewStatsProps) {
  const totalStudents = data?.totalStudents ?? 0
  const activeStudents = data?.activeStudents ?? 0
  const newStudents = data?.newStudentsThisMonth ?? 0
  const studentGrowth = data?.studentsGrowthPercent ?? 0

  const totalTeachers = data?.totalTeachers ?? 0
  const activeTeachers = data?.activeTeachers ?? 0
  const availableTeachers = data?.availableTeachers ?? 0
  const teacherGrowth = data?.teachersGrowthPercent ?? 0

  const activeStudentPct =
    totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toLocaleString(),
      change: `${studentGrowth >= 0 ? "+" : ""}${studentGrowth.toFixed(1)}%`,
      period: `${newStudents.toLocaleString()} new this month`,
      isPositive: studentGrowth >= 0,
      icon: GraduationCap,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      dotColor: "bg-blue-400",
    },
    {
      title: "Active Students",
      value: activeStudents.toLocaleString(),
      change: `${activeStudentPct}%`,
      period: "Of total enrolled capacity",
      isPositive: true,
      icon: Users,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      dotColor: "bg-emerald-400",
    },
    {
      title: "Total Faculty",
      value: totalTeachers.toLocaleString(),
      change: `${teacherGrowth >= 0 ? "+" : ""}${teacherGrowth.toFixed(1)}%`,
      period: "Teachers & instructors",
      isPositive: teacherGrowth >= 0,
      icon: UserCheck,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      dotColor: "bg-purple-400",
    },
    {
      title: "Active Teachers",
      value: activeTeachers.toLocaleString(),
      change: `${availableTeachers} Available`,
      period: "Ready for live sessions",
      isPositive: true,
      icon: Sparkles,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      dotColor: "bg-amber-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between group"
          >
            {/* Top row: Icon & Status Dot */}
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "size-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                  stat.iconBg,
                  stat.iconColor
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className={cn("size-2 rounded-full", stat.dotColor)} />
                <span className="text-[11px] font-medium text-zinc-400">Live Metric</span>
              </div>
            </div>

            {/* Middle: Value and Title */}
            <div className="mt-4 mb-2">
              <span className="text-3xl font-bold text-zinc-900 tracking-tight block">
                {stat.value}
              </span>
              <span className="text-xs font-medium text-zinc-500 mt-1 block">
                {stat.title}
              </span>
            </div>

            {/* Bottom: Change Badge and Period */}
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
              <span
                className={cn(
                  "text-xs font-semibold rounded-full px-2 py-0.5 border",
                  stat.isPositive
                    ? "text-brand-green bg-emerald-50 border-emerald-100"
                    : "text-rose-600 bg-rose-50 border-rose-100"
                )}
              >
                {stat.change}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal truncate">
                {stat.period}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
