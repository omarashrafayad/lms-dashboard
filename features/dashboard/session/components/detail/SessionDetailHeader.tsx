"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  CalendarClock,
  UserCheck,
  RefreshCw,
  Ban,
  Trash2,
  Pencil,
  Video,
} from "lucide-react"
import { NormalizedSessionDetail } from "../../utils/sessionDetail.utils"

export interface SessionDetailHeaderProps {
  session: NormalizedSessionDetail
  onOpenBook: () => void
  onOpenStatus: () => void
  onOpenReschedule: () => void
  onOpenCancel: () => void
  onDeleteSession: () => void
  isDeleting: boolean
}

export function SessionDetailHeader({
  session,
  onOpenBook,
  onOpenStatus,
  onOpenReschedule,
  onOpenCancel,
  onDeleteSession,
  isDeleting,
}: SessionDetailHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4">
      {/* Back button */}
      <div>
        <Link
          href="/sessions"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-4 text-zinc-500" />
          <span>Back to All Sessions</span>
        </Link>
      </div>

      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Session {session.sessionNumber}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${session.statusStyle.badge} shadow-2xs`}
            >
              <span className={`size-1.5 rounded-full ${session.statusStyle.dot}`} />
              {session.status}
            </span>
            {session.isLive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="size-1.5 rounded-full bg-rose-600 animate-pulse" />
                Live Now
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 font-normal">
            {session.subjectOrCourse} · {session.date} · {session.startTime}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {session.meetingUrl && (
            <a
              href={session.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Video className="size-3.5" />
              <span>Join Meeting</span>
            </a>
          )}

          <button
            type="button"
            onClick={onOpenBook}
            className="h-9 px-3.5 rounded-xl border border-blue-200 bg-blue-50/80 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <UserCheck className="size-3.5" />
            <span>Book Student</span>
          </button>

          <button
            type="button"
            onClick={onOpenStatus}
            className="h-9 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <RefreshCw className="size-3.5 text-zinc-500" />
            <span>Change Status</span>
          </button>

          <button
            type="button"
            onClick={onOpenReschedule}
            className="h-9 px-3.5 rounded-xl border border-amber-300 bg-amber-50/80 text-xs font-semibold text-[#D97706] hover:bg-amber-100 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <CalendarClock className="size-3.5" />
            <span>Reschedule</span>
          </button>

          <button
            type="button"
            onClick={onOpenCancel}
            className="h-9 px-3.5 rounded-xl border border-rose-200 bg-rose-50/60 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Ban className="size-3.5 text-rose-600" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={onDeleteSession}
            disabled={isDeleting}
            className="h-9 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            <Trash2 className="size-3.5 text-rose-500" />
            <span>Delete</span>
          </button>

          <button
            type="button"
            onClick={() => router.push(`/sessions/${session.id}/edit`)}
            className="h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Pencil className="size-3.5 stroke-[2.2]" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  )
}
