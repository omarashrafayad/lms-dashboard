"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { NormalizedSessionDetail } from "../../utils/sessionDetail.utils"

export interface SessionTeacherCardProps {
  teacher: NormalizedSessionDetail["teacher"]
}

export function SessionTeacherCard({ teacher }: SessionTeacherCardProps) {
  const initial = teacher.name ? teacher.name.charAt(0).toUpperCase() : "T"

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
          Teacher Information
        </h3>
        {teacher.id && (
          <Link
            href={teacher.viewUrl}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <span>View Profile</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="size-11 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
            {initial}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-zinc-900 truncate">
              {teacher.name}
            </span>
            <span className="text-xs text-zinc-500 truncate">
              {teacher.subject}
            </span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${
            teacher.isAvailable
              ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
              : "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              teacher.isAvailable ? "bg-[#16A34A]" : "bg-[#D97706]"
            }`}
          />
          {teacher.availability}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs pt-3 border-t border-zinc-100">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            TEACHER ID
          </span>
          <span className="font-mono text-zinc-800 font-medium truncate">
            {teacher.id || "N/A"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            ASSIGNED SUBJECT
          </span>
          <span className="font-semibold text-zinc-900">
            {teacher.subject}
          </span>
        </div>
      </div>
    </div>
  )
}
