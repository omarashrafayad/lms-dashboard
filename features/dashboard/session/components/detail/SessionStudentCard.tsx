"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { NormalizedSessionDetail } from "../../utils/sessionDetail.utils"

export interface SessionStudentCardProps {
  student: NormalizedSessionDetail["student"]
}

export function SessionStudentCard({ student }: SessionStudentCardProps) {
  const initial = student.name ? student.name.charAt(0).toUpperCase() : "S"

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
          Student Information
        </h3>
        {student.id && (
          <Link
            href={student.viewUrl}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <span>View Profile</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3.5 pb-2">
        <div className="size-11 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
          {initial}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-zinc-900 truncate">
            {student.name}
          </span>
          <span className="text-xs text-zinc-500 truncate">
            {student.grade}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs pt-3 border-t border-zinc-100">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            STUDENT ID
          </span>
          <span className="font-mono text-zinc-800 font-medium truncate">
            {student.id || "N/A"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            EDUCATION STAGE
          </span>
          <span className="font-semibold text-zinc-900">
            {student.educationStage || student.grade || "Primary / Prep"}
          </span>
        </div>
      </div>
    </div>
  )
}
