"use client"

import * as React from "react"
import { Info } from "lucide-react"

export interface LessonOverviewProps {
  description: string
  order: number
  duration: string
  access: string
}

export function LessonOverviewCard({
  description,
  order,
  duration,
  access,
}: LessonOverviewProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
          <Info className="size-4" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-sm text-zinc-900">Overview</h3>
          <span className="text-xs text-zinc-400">
            Basic lesson information and curriculum placement.
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-600 leading-relaxed font-normal">
        {description}
      </p>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Lesson Order */}
        <div className="p-4 rounded-xl border border-zinc-200/70 bg-zinc-50/40 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-zinc-400">
            Lesson Order
          </span>
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {order}
          </span>
        </div>

        {/* Duration */}
        <div className="p-4 rounded-xl border border-zinc-200/70 bg-zinc-50/40 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-zinc-400">
            Duration
          </span>
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {duration}
          </span>
        </div>

        {/* Access */}
        <div className="p-4 rounded-xl border border-zinc-200/70 bg-zinc-50/40 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-zinc-400">Access</span>
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {access}
          </span>
        </div>
      </div>
    </div>
  )
}
