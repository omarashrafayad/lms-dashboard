"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { TimelineItem } from "../../types/session.types"

export interface SessionActivityTimelineProps {
  timeline: TimelineItem[]
}

export function SessionActivityTimeline({ timeline }: SessionActivityTimelineProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-6">
      <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
        Activity Timeline
      </h3>

      <div className="flex flex-col relative">
        {timeline.map((item, index) => {
          const isLast = index === timeline.length - 1

          return (
            <div key={item.id} className="flex items-start gap-3.5 relative">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-[11px] top-6 bottom-0 w-[1.5px] bg-zinc-200" />
              )}

              {/* Status Icon */}
              <div className="relative z-10 shrink-0 mt-0.5">
                {item.completed ? (
                  <div className="size-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-2xs">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="size-6 rounded-full border-2 border-zinc-300 bg-white flex items-center justify-center shadow-2xs">
                    <span className="size-2 rounded-full bg-zinc-300" />
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col pb-6 min-w-0">
                <span className="text-xs font-bold text-zinc-900 leading-snug">
                  {item.title}
                </span>
                <span className="text-[11px] text-zinc-500 font-normal mt-0.5 leading-relaxed">
                  {item.subtitle}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
