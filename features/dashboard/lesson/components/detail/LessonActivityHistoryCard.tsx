"use client"

import * as React from "react"
import { History } from "lucide-react"
import { ActivityHistoryItem } from "../../types/lesson.types"

export interface LessonActivityHistoryProps {
  history?: ActivityHistoryItem[]
}

export function LessonActivityHistoryCard({
  history = [
    {
      id: "1",
      action: "Created",
      date: "19 Aug 2026 · 16:40",
      author: "Omar Reda",
    },
  ],
}: LessonActivityHistoryProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
          <History className="size-4" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-sm text-zinc-900">Activity History</h3>
          <span className="text-xs text-zinc-400">
            Timeline of changes to this lesson.
          </span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex flex-col pl-2">
        {history.map((item, index) => (
          <div key={item.id || index} className="flex items-start gap-3 relative pb-2">
            {/* Dot */}
            <span className="size-2 rounded-full bg-amber-500 ring-4 ring-amber-100 shrink-0 mt-1" />

            {/* Content */}
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-zinc-900">
                {item.action}
              </span>
              <span className="text-[11px] text-zinc-400 mt-0.5">
                {item.date} · by {item.author}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
