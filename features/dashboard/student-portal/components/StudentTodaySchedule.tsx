"use client"

import * as React from "react"
import Link from "next/link"
import {
  Calendar,
  Clock,
  Video,
  Play,
  ArrowRight,
  Radio,
  FileText,
  CheckCircle,
} from "lucide-react"
import { LiveSession } from "../types/studentPortal.types"
import { MOCK_STUDENT_SESSIONS } from "../data/mockStudentData"

interface StudentTodayScheduleProps {
  sessions?: LiveSession[]
  onOpenSession?: (session: LiveSession) => void
}

export function StudentTodaySchedule({
  sessions = MOCK_STUDENT_SESSIONS,
  onOpenSession,
}: StudentTodayScheduleProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-brand-orange" />
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">
            Today&apos;s Schedule
          </h2>
        </div>
        <Link
          href="/student/sessions"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
        >
          <span>Sessions Calendar</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {sessions.map((session) => {
          const isLive = session.status === "live_now"
          const isCompleted = session.status === "completed"

          return (
            <div
              key={session.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isLive
                  ? "bg-emerald-50/60 border-emerald-200/80 shadow-2xs ring-1 ring-emerald-400/20"
                  : "bg-zinc-50/50 border-zinc-200/70 hover:bg-zinc-50"
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5">
                <div
                  className={`size-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isLive
                      ? "bg-emerald-600 text-white border-emerald-500 animate-pulse"
                      : isCompleted
                      ? "bg-zinc-200 text-zinc-600 border-zinc-300"
                      : "bg-blue-50 text-blue-600 border-blue-200"
                  }`}
                >
                  {isLive ? (
                    <Radio className="size-5" />
                  ) : (
                    <Video className="size-5" />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-200/80 text-zinc-800">
                      {session.subject}
                    </span>
                    {isLive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 flex items-center gap-1 animate-pulse">
                        <span className="size-1.5 rounded-full bg-red-600" />
                        LIVE NOW
                      </span>
                    )}
                    {session.status === "upcoming" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                        Upcoming • In 2h
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-200 text-zinc-600">
                        Completed
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                    {session.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-zinc-500 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div className="size-5 rounded-full overflow-hidden bg-zinc-200 border border-zinc-200">
                        <img
                          src={session.teacherAvatar}
                          alt={session.teacherName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-zinc-700">
                        {session.teacherName}
                      </span>
                    </div>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-zinc-400" />
                      {session.startTime} - {session.endTime} ({session.duration})
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                {isLive ? (
                  <a
                    href={session.meetingLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-sm shadow-brand-orange/20 transition-all"
                  >
                    <Play className="size-3.5 fill-current" />
                    <span>Join Now</span>
                  </a>
                ) : isCompleted ? (
                  <Link
                    href="/student/sessions"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs transition-colors"
                  >
                    <Video className="size-3.5" />
                    <span>Watch Recording</span>
                  </Link>
                ) : (
                  <Link
                    href="/student/sessions"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-medium text-xs transition-colors"
                  >
                    <span>View Details</span>
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
