"use client"

import * as React from "react"
import {
  CheckCircle2,
  Play,
  FileCheck2,
  Download,
  Video,
  Award,
  Layers,
  Clock,
  Sparkles,
} from "lucide-react"
import { StudentRecentActivity } from "../types/studentPortal.types"
import { MOCK_RECENT_ACTIVITIES } from "../data/mockStudentData"

interface StudentRecentActivityProps {
  activities?: StudentRecentActivity[]
}

export function StudentRecentActivityTimeline({
  activities = MOCK_RECENT_ACTIVITIES,
}: StudentRecentActivityProps) {
  const getIcon = (type: StudentRecentActivity["type"]) => {
    switch (type) {
      case "lesson":
        return { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" }
      case "video":
        return { icon: Play, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" }
      case "exam":
        return { icon: FileCheck2, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" }
      case "download":
        return { icon: Download, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" }
      case "session":
        return { icon: Video, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" }
      case "grade":
        return { icon: Award, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" }
      case "unit":
        return { icon: Layers, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" }
      default:
        return { icon: Sparkles, color: "text-zinc-600", bg: "bg-zinc-50", border: "border-zinc-200" }
    }
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-brand-orange" />
          <h2 className="text-base font-bold text-zinc-900">
            Recent Learning Activity
          </h2>
        </div>
        <span className="text-xs text-zinc-400 font-medium">Last 7 days</span>
      </div>

      <div className="relative pl-6 flex flex-col gap-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-200">
        {activities.map((act) => {
          const config = getIcon(act.type)
          const Icon = config.icon

          return (
            <div key={act.id} className="relative flex items-start justify-between gap-4 group">
              {/* Dot Icon Indicator */}
              <div
                className={`absolute -left-6 size-6 rounded-full ${config.bg} border ${config.border} flex items-center justify-center -translate-x-1/2 ring-4 ring-white shadow-2xs`}
              >
                <Icon className={`size-3 ${config.color}`} />
              </div>

              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                  {act.title}
                </span>
                <span className="text-[11px] text-zinc-500 font-normal truncate">
                  {act.subjectOrCourse}
                </span>
                <span className="text-[10px] text-zinc-400 font-normal">
                  {act.date}
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-700 shrink-0 border border-zinc-200/70">
                {act.statusBadge}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
