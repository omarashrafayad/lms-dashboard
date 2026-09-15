"use client"

import * as React from "react"
import Link from "next/link"
import { TeacherSession } from "../../types/teacherProfile.types"
import { cn } from "@/lib/utils"

interface TeacherSessionsCardProps {
  upcomingSessions: TeacherSession[]
  previousSessions: TeacherSession[]
}

export function TeacherSessionsCard({
  upcomingSessions,
  previousSessions,
}: TeacherSessionsCardProps) {
  const renderStatusPill = (status: TeacherSession["status"]) => {
    let pillClass = "text-zinc-600 bg-zinc-100 border-zinc-200"
    if (status === "Confirmed" || status === "Completed") {
      pillClass = "text-emerald-700 bg-emerald-50 border-emerald-200/70"
    } else if (status === "Pending") {
      pillClass = "text-amber-700 bg-amber-50 border-amber-200/70"
    } else if (status === "Cancelled") {
      pillClass = "text-rose-700 bg-rose-50 border-rose-200/70"
    }

    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          pillClass
        )}
      >
        {status}
      </span>
    )
  }

  const renderSessionTable = (sessions: TeacherSession[]) => {
    if (sessions.length === 0) {
      return (
        <div className="py-6 text-center text-xs text-zinc-400">
          No sessions recorded
        </div>
      )
    }

    return (
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <th className="pb-3 font-semibold">STUDENT</th>
              <th className="pb-3 font-semibold">SUBJECT</th>
              <th className="pb-3 font-semibold">DATE</th>
              <th className="pb-3 font-semibold">TIME</th>
              <th className="pb-3 font-semibold">SESSION TYPE</th>
              <th className="pb-3 font-semibold">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 text-xs">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-3.5 pr-4 font-semibold text-zinc-900">
                  <Link
                    href={`/student/${session.studentId || "STU-1024"}`}
                    className="underline decoration-zinc-400 hover:text-brand-orange hover:decoration-brand-orange transition-colors"
                  >
                    {session.studentName}
                  </Link>
                </td>
                <td className="py-3.5 pr-4 text-zinc-600">{session.subject}</td>
                <td className="py-3.5 pr-4 text-zinc-600">{session.date}</td>
                <td className="py-3.5 pr-4 text-zinc-600">{session.time}</td>
                <td className="py-3.5 pr-4 text-zinc-600">{session.sessionType}</td>
                <td className="py-3.5">{renderStatusPill(session.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col gap-6">
      <h2 className="text-sm font-bold text-zinc-900">Sessions</h2>

      {/* Section 1: Upcoming Sessions */}
      <div>
        <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          UPCOMING SESSIONS
        </div>
        {renderSessionTable(upcomingSessions)}
      </div>

      {/* Section 2: Previous Sessions */}
      <div className="pt-2">
        <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          PREVIOUS SESSIONS
        </div>
        {renderSessionTable(previousSessions)}
      </div>
    </div>
  )
}
