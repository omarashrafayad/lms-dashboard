"use client"

import * as React from "react"
import { ExamItem } from "../../types/exam.types"

interface ExamAnalyticsTabProps {
  exam: ExamItem
}

export function ExamAnalyticsTab({ exam }: ExamAnalyticsTabProps) {
  const passPercent = exam.passRatePercent || 72
  const failPercent = exam.failRatePercent || 28

  return (
    <div className="flex flex-col gap-6">
      {/* 5 Stat Cards in a row matching Image 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Attempts */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col gap-1 shadow-2xs">
          <span className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            {exam.studentsCount || 185}
          </span>
          <span className="text-xs font-medium text-zinc-500">
            Total Attempts
          </span>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col gap-1 shadow-2xs">
          <span className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            {exam.averageScore || "78%"}
          </span>
          <span className="text-xs font-medium text-zinc-500">
            Average Score
          </span>
        </div>

        {/* Card 3: Pass Rate */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col gap-1 shadow-2xs">
          <span className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            {exam.passRate || `${passPercent}%`}
          </span>
          <span className="text-xs font-medium text-zinc-500">
            Pass Rate
          </span>
        </div>

        {/* Card 4: Fail Rate */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col gap-1 shadow-2xs">
          <span className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            {failPercent}%
          </span>
          <span className="text-xs font-medium text-zinc-500">
            Fail Rate
          </span>
        </div>

        {/* Card 5: Avg. Completion Time */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col gap-1 shadow-2xs">
          <span className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            {exam.avgCompletionTime || "24 min"}
          </span>
          <span className="text-xs font-medium text-zinc-500">
            Avg. Completion Time
          </span>
        </div>
      </div>

      {/* Pass / Fail breakdown Card matching Image 4 */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col">
        <h3 className="text-sm font-bold text-zinc-900 mb-6">
          Pass / Fail breakdown
        </h3>

        {/* Progress Bar & Percentage Text */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3.5 bg-zinc-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[#F59E0B] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${passPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-zinc-800 shrink-0">
            {passPercent}% passed
          </span>
        </div>

        {/* Subtext description below */}
        <p className="text-xs text-zinc-400 mt-4">
          Breakdown by subject · {exam.subject} · Level {exam.level}
        </p>
      </div>
    </div>
  )
}
