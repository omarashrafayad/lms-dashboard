"use client"

import * as React from "react"
import { StudentProfile } from "../../types/studentProfile.types"
import { cn } from "@/lib/utils"

interface StudentSessionsCardProps {
  sessions: StudentProfile["sessions"]
}

export function StudentSessionsCard({ sessions }: StudentSessionsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs">
      <h2 className="text-sm font-bold text-zinc-900 mb-4">
        Sessions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UPCOMING SESSIONS */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            UPCOMING SESSIONS
          </div>

          <div className="flex flex-col gap-2.5">
            {sessions.upcoming.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/70 bg-white hover:bg-zinc-50/40 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 leading-tight">
                    {session.subject}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal mt-1">
                    {session.instructor} • {session.dateText} • {session.timeText}
                  </span>
                </div>

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-sky-700 bg-sky-50 border border-sky-200/70 shrink-0">
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PREVIOUS SESSIONS */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            PREVIOUS SESSIONS
          </div>

          <div className="flex flex-col gap-2.5">
            {sessions.previous.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/70 bg-white hover:bg-zinc-50/40 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 leading-tight">
                    {session.subject}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal mt-1">
                    {session.instructor} • {session.dateText} • {session.timeText}
                  </span>
                </div>

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 shrink-0">
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
