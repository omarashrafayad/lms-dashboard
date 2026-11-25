"use client"

import * as React from "react"
import {
  TrendingUp,
  BarChart3,
  Award,
  Users,
  AlertTriangle,
  CheckCircle2,
  PieChart,
} from "lucide-react"

export function TeacherStudentPerformanceOverview() {
  const [courseFilter, setCourseFilter] = React.useState("all")

  // Performance distribution across assigned students
  const scoreDistribution = [
    { range: "90-100% (A+)", studentsCount: 104, percentage: 30, color: "bg-emerald-500" },
    { range: "80-89% (B+)", studentsCount: 122, percentage: 35, color: "bg-blue-500" },
    { range: "70-79% (C)", studentsCount: 78, percentage: 22, color: "bg-amber-500" },
    { range: "60-69% (D)", studentsCount: 32, percentage: 9, color: "bg-purple-500" },
    { range: "< 60% (At Risk)", studentsCount: 12, percentage: 4, color: "bg-rose-500" },
  ]

  // Monthly average exam progress
  const monthlyAverages = [
    { month: "Sep", avg: 80 },
    { month: "Oct", avg: 82 },
    { month: "Nov", avg: 85 },
    { month: "Dec", avg: 84 },
    { month: "Jan", avg: 88 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 2-Columns: Score Distribution & Progression */}
      <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-brand-orange" />
              <h2 className="text-base font-bold text-zinc-900">
                Cohort Academic Performance & Grade Distribution
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Aggregated assessment grades across 348 enrolled secondary students
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 w-fit">
            Overall Pass Rate: 92.4%
          </span>
        </div>

        {/* Grade Distribution Horizontal Bars */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Grade Brackets Breakdown:
          </span>
          <div className="flex flex-col gap-2.5">
            {scoreDistribution.map((dist) => (
              <div key={dist.range} className="flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-zinc-700">{dist.range}</span>
                  <span className="text-zinc-900">
                    {dist.studentsCount} Students ({dist.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dist.color} transition-all duration-500`}
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Summary Stat Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col">
            <span className="text-[11px] text-zinc-400 font-medium">Overall Average</span>
            <span className="text-xl font-extrabold text-zinc-900">84.6%</span>
            <span className="text-[10px] text-emerald-600 font-semibold">+3.1% Improvement</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col">
            <span className="text-[11px] text-zinc-400 font-medium">Pass Rate</span>
            <span className="text-xl font-extrabold text-emerald-700">92.4%</span>
            <span className="text-[10px] text-emerald-600">321 of 348 Students</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col">
            <span className="text-[11px] text-zinc-400 font-medium">Avg Completion</span>
            <span className="text-xl font-extrabold text-blue-700">74.0%</span>
            <span className="text-[10px] text-blue-600">Curriculum Syllabus</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col">
            <span className="text-[11px] text-zinc-400 font-medium">Students at Risk</span>
            <span className="text-xl font-extrabold text-rose-700">12</span>
            <span className="text-[10px] text-rose-600 font-semibold">Immediate Attention</span>
          </div>
        </div>
      </div>

      {/* 1-Column: Course Performance & Monthly Trend */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="size-5 text-blue-600" />
            <h2 className="text-base font-bold text-zinc-900">
              Exam Progression Trend
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Average monthly cohort scores
          </p>
        </div>

        {/* Vertical Bars */}
        <div className="h-44 flex items-end justify-between gap-4 px-3 pt-4 border-b border-zinc-100">
          {monthlyAverages.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
              <div
                className="w-full rounded-t-xl bg-brand-orange group-hover:bg-brand-orange/90 transition-all relative flex justify-center shadow-xs"
                style={{ height: `${m.avg}%` }}
              >
                <span className="absolute -top-6 text-[10px] font-bold text-zinc-700">
                  {m.avg}%
                </span>
              </div>
              <span className="text-xs font-semibold text-zinc-600">{m.month}</span>
            </div>
          ))}
        </div>

        {/* At-Risk Alert Banner with Action */}
        <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
            <AlertTriangle className="size-4 text-rose-600 shrink-0" />
            <span>12 Students Need Academic Intervention</span>
          </div>
          <p className="text-[11px] text-rose-800 leading-relaxed">
            Identified by recurring missed live clinics and midterm scores below 60%.
          </p>
          <a
            href="/teacher/students"
            className="text-xs font-bold text-rose-700 hover:text-rose-900 underline mt-0.5"
          >
            Review At-Risk Students List →
          </a>
        </div>
      </div>
    </div>
  )
}
