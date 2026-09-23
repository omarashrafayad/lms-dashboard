"use client"

import * as React from "react"
import { CourseAnalyticsData } from "../../types/course.types"

export interface CourseAnalyticsTabProps {
  analytics?: CourseAnalyticsData
}

export function CourseAnalyticsTab({ analytics }: CourseAnalyticsTabProps) {
  const completionRate = analytics?.completionRate || "74%"
  const avgWatchTime = analytics?.avgWatchTime || "24m"
  const activeLearners = analytics?.activeLearners || 234

  const lessons = ["L1", "L2", "L3", "L4", "L5", "L6"]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* 3 KPI Cards matching Image 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-1">
          <span className="text-3xl font-bold text-zinc-900 tracking-tight">
            {completionRate}
          </span>
          <span className="text-xs font-medium text-zinc-400">
            Completion rate
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-1">
          <span className="text-3xl font-bold text-zinc-900 tracking-tight">
            {avgWatchTime}
          </span>
          <span className="text-xs font-medium text-zinc-400">
            Avg. watch time
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-1">
          <span className="text-3xl font-bold text-zinc-900 tracking-tight">
            {activeLearners}
          </span>
          <span className="text-xs font-medium text-zinc-400">
            Active learners
          </span>
        </div>
      </div>

      {/* Lesson Engagement Chart Card matching Image 4 */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col gap-8 min-h-[360px]">
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
          Lesson engagement
        </h3>

        {/* Minimalist chart matching Image 4 */}
        <div className="flex-1 flex flex-col justify-end w-full pt-10">
          <div className="relative w-full h-44">
            {/* Subtle SVG Area / Line */}
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 600 120"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,40 Q 60,30 120,50 T 240,35 T 360,65 T 480,45 T 600,30 L 600,120 L 0,120 Z"
                fill="url(#engagementGradient)"
              />
              <path
                d="M 0,40 Q 60,30 120,50 T 240,35 T 360,65 T 480,45 T 600,30"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* X-axis Labels matching Image 4 */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-100/90 text-xs font-medium text-zinc-400 px-4">
            {lessons.map((lesson) => (
              <span key={lesson} className="hover:text-zinc-700 transition-colors">
                {lesson}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
