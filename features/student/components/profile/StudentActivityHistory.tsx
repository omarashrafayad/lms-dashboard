"use client"

import * as React from "react"
import { StudentActivityItem } from "../../types/studentProfile.types"

interface StudentActivityHistoryProps {
  activities: StudentActivityItem[]
}

export function StudentActivityHistory({ activities }: StudentActivityHistoryProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs">
      <h2 className="text-sm font-bold text-zinc-900 mb-4">
        Activity History
      </h2>

      <div className="flex flex-col divide-y divide-zinc-100">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            {/* Orange bullet dot matching the screenshot */}
            <span className="size-1.5 rounded-full bg-brand-orange shrink-0 mt-1.5" />

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-900 leading-tight">
                {item.title}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal mt-1">
                {item.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
