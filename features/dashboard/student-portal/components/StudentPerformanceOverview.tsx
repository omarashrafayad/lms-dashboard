"use client"

import * as React from "react"
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Award,
  ArrowUpRight,
  Filter,
} from "lucide-react"
import { MOCK_SUBJECT_PERFORMANCES } from "../data/mockStudentData"

export function StudentPerformanceOverview() {
  const [timeFilter, setTimeFilter] = React.useState<"weekly" | "monthly">("monthly")
  const subjects = MOCK_SUBJECT_PERFORMANCES

  // Monthly trend data
  const trendData = [
    { period: "Sep", score: 81, hours: 26 },
    { period: "Oct", score: 84, hours: 32 },
    { period: "Nov", score: 89, hours: 38 },
    { period: "Dec", score: 87, hours: 34 },
    { period: "Jan", score: 92, hours: 42 },
  ]

  // Daily study hours for this week
  const studyHours = [
    { day: "Sat", hours: 2.5, completed: true },
    { day: "Sun", hours: 3.0, completed: true },
    { day: "Mon", hours: 1.5, completed: true },
    { day: "Tue", hours: 4.0, completed: true },
    { day: "Wed", hours: 2.0, completed: true },
    { day: "Thu", hours: 1.5, completed: false },
    { day: "Fri", hours: 0.0, completed: false },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 2-Columns: Overall Performance & Study Trends */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-6">
        {/* Header & Filter Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-brand-orange" />
              <h2 className="text-base font-bold text-zinc-900">
                Academic Performance Trend
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Average examination scores and progression over time
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 border border-zinc-200/60 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTimeFilter("weekly")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeFilter === "weekly"
                  ? "bg-white text-zinc-950 font-bold shadow-2xs border border-zinc-200/60"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("monthly")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeFilter === "monthly"
                  ? "bg-white text-zinc-950 font-bold shadow-2xs border border-zinc-200/60"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Visual Chart - Score Bars with Study Hours line comparison */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Score (%)</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-brand-orange" />
                <span className="text-zinc-600 font-medium">Exam Avg Score</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="text-zinc-600 font-medium">Study Hours</span>
              </div>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 sm:gap-8 pt-4 pb-1 border-b border-zinc-100 px-2">
            {trendData.map((d) => (
              <div key={d.period} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex items-end justify-center gap-1 h-36">
                  {/* Score Bar */}
                  <div
                    className="w-8 sm:w-10 rounded-t-lg bg-brand-orange group-hover:bg-brand-orange/90 transition-all duration-300 relative shadow-2xs"
                    style={{ height: `${(d.score / 100) * 100}%` }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md pointer-events-none whitespace-nowrap shadow-sm">
                      {d.score}%
                    </span>
                  </div>
                  {/* Hours Mini Bar */}
                  <div
                    className="w-3 rounded-t-sm bg-blue-300 group-hover:bg-blue-400 transition-all duration-300 relative"
                    style={{ height: `${(d.hours / 50) * 100}%` }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md pointer-events-none whitespace-nowrap shadow-sm">
                      {d.hours}h
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-zinc-600">{d.period}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Summary Score Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex flex-col">
            <span className="text-[11px] text-zinc-400 font-medium">Overall Average</span>
            <span className="text-xl font-extrabold text-zinc-900">88.5%</span>
            <span className="text-[10px] text-emerald-600 font-semibold">+4.2% Growth</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col">
            <span className="text-[11px] text-zinc-400 font-medium">Highest Exam</span>
            <span className="text-xl font-extrabold text-emerald-700">98%</span>
            <span className="text-[10px] text-zinc-500">Calculus & Geometry</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col">
            <span className="text-[11px] text-zinc-400 font-medium">Lowest Score</span>
            <span className="text-xl font-extrabold text-amber-700">76%</span>
            <span className="text-[10px] text-zinc-500">Physics Mechanics</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex flex-col">
            <span className="text-[11px] text-zinc-400 font-medium">Weekly Study</span>
            <span className="text-xl font-extrabold text-purple-700">14.5h</span>
            <span className="text-[10px] text-purple-600 font-semibold">Goal: 15h / week</span>
          </div>
        </div>
      </div>

      {/* 1-Column: Subject Scores Breakdown */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="size-5 text-emerald-600" />
            <h2 className="text-base font-bold text-zinc-900">
              Subject Performance
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Average test scores and subject completion
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {subjects.map((sub) => (
            <div key={sub.subject} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800">{sub.subject}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400">{sub.progress}% done</span>
                  <span
                    className={`font-bold ${
                      sub.averageScore >= 90
                        ? "text-emerald-700"
                        : sub.averageScore >= 80
                        ? "text-blue-700"
                        : "text-amber-700"
                    }`}
                  >
                    {sub.averageScore}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sub.averageScore >= 90
                      ? "bg-emerald-500"
                      : sub.averageScore >= 80
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${sub.averageScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Study Hours Activity Mini Bar */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700 flex items-center gap-1.5">
              <Clock className="size-3.5 text-emerald-600" />
              Daily Study Hours (This Week)
            </span>
            <span className="text-[11px] font-bold text-emerald-700">14.5 / 15 hrs</span>
          </div>
          <div className="flex items-end justify-between gap-1.5 h-12 pt-2">
            {studyHours.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-sm transition-all ${
                    d.completed ? "bg-emerald-500" : "bg-zinc-200"
                  }`}
                  style={{ height: `${Math.max((d.hours / 4) * 100, 10)}%` }}
                  title={`${d.day}: ${d.hours} hours`}
                />
                <span className="text-[10px] text-zinc-400 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
