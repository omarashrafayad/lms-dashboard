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
  Users,
  Eye,
  CheckCircle,
} from "lucide-react"
import { TeacherSession } from "../types/teacherPortal.types"
import { MOCK_TEACHER_SESSIONS } from "../data/mockTeacherData"

interface TeacherTodayScheduleProps {
  sessions?: TeacherSession[]
}

export function TeacherTodaySchedule({
  sessions = MOCK_TEACHER_SESSIONS.slice(0, 3),
}: TeacherTodayScheduleProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-brand-orange" />
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">
            Today&apos;s Teaching Schedule
          </h2>
        </div>
        <Link
          href="/teacher/sessions"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
        >
          <span>Sessions Management</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {sessions.map((session) => {
          const isLive = session.status === "live_now"

          return (
            <div
              key={session.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isLive
                  ? "bg-amber-50/50 border-amber-300 shadow-2xs ring-1 ring-amber-400/20"
                  : "bg-zinc-50/50 border-zinc-200/70 hover:bg-zinc-50"
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5">
                <div
                  className={`size-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isLive
                      ? "bg-brand-orange text-white border-amber-500 animate-pulse"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {isLive ? <Radio className="size-5" /> : <Video className="size-5" />}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-200/80 text-zinc-800">
                      {session.subject}
                    </span>
                    {isLive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 flex items-center gap-1 animate-pulse">
                        <span className="size-1.5 rounded-full bg-red-600" />
                        BROADCASTING LIVE
                      </span>
                    )}
                    {session.status === "upcoming" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                        Upcoming • In 3h
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                    {session.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
                    <span className="font-medium text-zinc-700">
                      {session.course}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-zinc-400" />
                      {session.startTime} - {session.endTime} ({session.duration})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-amber-800">
                      <Users className="size-3 text-brand-orange" />
                      {session.expectedAttendees} / {session.registeredStudents} Attendees Expected
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                {isLive ? (
                  <a
                    href={session.meetingLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-sm shadow-brand-orange/20 transition-all"
                  >
                    <Play className="size-3.5 fill-current" />
                    <span>Enter Broadcaster Room</span>
                  </a>
                ) : (
                  <Link
                    href="/teacher/sessions"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 font-semibold text-xs transition-colors"
                  >
                    <Eye className="size-3.5" />
                    <span>View Attendance</span>
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
