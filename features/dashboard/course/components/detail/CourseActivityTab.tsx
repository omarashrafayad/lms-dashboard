"use client"

import * as React from "react"
import { CourseActivityItem } from "../../types/course.types"

export interface CourseActivityTabProps {
  activities?: CourseActivityItem[]
}

export function CourseActivityTab({ activities }: CourseActivityTabProps) {
  const items = activities || [
    {
      id: "act-1",
      action: "Mathematics Fundamentals content updated",
      date: "Today · 09:24",
    },
    {
      id: "act-2",
      action: 'Lesson "Guided Practice" added',
      date: "Sep 18, 2026",
    },
    {
      id: "act-3",
      action: "Course published",
      date: "Sep 12, 2026",
    },
    {
      id: "act-4",
      action: "Academic mapping edited",
      date: "Sep 04, 2026",
    },
    {
      id: "act-5",
      action: "Course created as draft",
      date: "Aug 30, 2026",
    },
  ]

  return (
    <div className="py-6 px-2 animate-in fade-in duration-200">
      <div className="relative pl-6 flex flex-col gap-8">
        {/* Vertical line running behind items */}
        <div className="absolute left-[3px] top-2 bottom-2 w-[1.5px] bg-zinc-100" />

        {items.map((item) => (
          <div key={item.id} className="relative flex flex-col gap-1">
            {/* Orange Node Bullet matching Image 5 */}
            <div className="absolute -left-6 top-1 size-2 rounded-full bg-[#F59E0B] ring-4 ring-[#F59E0B]/10" />

            {/* Action text */}
            <span className="text-xs font-semibold text-zinc-900 leading-snug">
              {item.action}
            </span>

            {/* Timestamp */}
            <span className="text-[11px] text-zinc-400 font-normal">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
