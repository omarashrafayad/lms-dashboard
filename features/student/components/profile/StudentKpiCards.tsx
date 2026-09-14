"use client"

import * as React from "react"
import { StudentProfile } from "../../types/studentProfile.types"

interface StudentKpiCardsProps {
  kpis: StudentProfile["kpis"]
}

export function StudentKpiCards({ kpis }: StudentKpiCardsProps) {
  const cards = [
    {
      value: `${kpis.overallProgress}%`,
      label: "Overall Progress",
      dotColor: "bg-indigo-400",
    },
    {
      value: `${kpis.averageScore}%`,
      label: "Average Score",
      dotColor: "bg-emerald-400",
    },
    {
      value: `${kpis.completedCourses}`,
      label: "Completed Courses",
      dotColor: "bg-purple-400",
    },
    {
      value: `${kpis.completedLessons}`,
      label: "Completed Lessons",
      dotColor: "bg-amber-400",
    },
    {
      value: `${kpis.upcomingSessions}`,
      label: "Upcoming Sessions",
      dotColor: "bg-sky-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="relative bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-2xs flex flex-col justify-between min-h-[96px]"
        >
          {/* Subtle colored indicator dot at top-right */}
          <span
            className={`absolute top-3.5 right-3.5 size-1.5 rounded-full ${card.dotColor}`}
          />

          {/* Metric Value */}
          <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-none mt-1">
            {card.value}
          </span>

          {/* Metric Label */}
          <span className="text-xs text-zinc-400 font-normal">
            {card.label}
          </span>
        </div>
      ))}
    </div>
  )
}
