"use client"

import * as React from "react"
import { NormalizedSessionDetail } from "../../utils/sessionDetail.utils"
import { ExternalLink, Video } from "lucide-react"

export interface SessionInfoCardProps {
  session: NormalizedSessionDetail
}

export function SessionInfoCard({ session }: SessionInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
      <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
        Session Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            SESSION ID
          </span>
          <span className="font-semibold text-zinc-900">
            Session {session.sessionNumber}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            SESSION TYPE
          </span>
          <span className="font-semibold text-zinc-900">
            {session.maxStudents > 1 ? `Group (${session.maxStudents} max)` : "Private 1:1"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            DATE & TIME
          </span>
          <span className="font-semibold text-zinc-900">
            {session.date} · {session.startTime}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            DURATION
          </span>
          <span className="font-semibold text-zinc-900">
            {session.duration}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            SUBJECT / COURSE
          </span>
          <span className="font-semibold text-zinc-900">
            {session.subjectOrCourse}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            ATTENDANCE / CAPACITY
          </span>
          <span className="font-semibold text-zinc-900">
            {session.bookedCount} / {session.maxStudents} booked ({session.seatsLeft} seats left)
          </span>
        </div>

        {session.meetingUrl && (
          <div className="sm:col-span-2 flex flex-col gap-1 pt-1">
            <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              MEETING LINK
            </span>
            <a
              href={session.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors truncate"
            >
              <Video className="size-3.5 text-amber-600" />
              <span className="truncate">{session.meetingUrl}</span>
              <ExternalLink className="size-3 shrink-0" />
            </a>
          </div>
        )}

        {session.description && (
          <div className="sm:col-span-2 flex flex-col gap-1 pt-1">
            <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              DESCRIPTION
            </span>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {session.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
