"use client"

import * as React from "react"
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Search,
  Radio,
  Play,
  Eye,
  CheckCircle2,
  Users,
} from "lucide-react"
import { TeacherSession } from "../types/teacherPortal.types"
import { MOCK_TEACHER_SESSIONS } from "../data/mockTeacherData"
import { TeacherCreateSessionModal } from "./TeacherCreateSessionModal"
import { TeacherSessionDetailModal } from "./TeacherSessionDetailModal"

export function TeacherSessionsPage() {
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sessions, setSessions] = React.useState<TeacherSession[]>(MOCK_TEACHER_SESSIONS)
  const [selectedSession, setSelectedSession] = React.useState<TeacherSession | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  const filteredSessions = React.useMemo(() => {
    return sessions.filter((s) => {
      if (activeTab !== "all" && s.status !== activeTab) return false
      if (
        searchTerm &&
        !s.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !s.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !s.course.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [sessions, activeTab, searchTerm])

  const handleOpenDetail = (s: TeacherSession) => {
    setSelectedSession(s)
    setIsDetailOpen(true)
  }

  const handleSaveSession = (newS: any) => {
    const s: TeacherSession = {
      id: `tch-sess-${Date.now()}`,
      title: newS.title,
      course: newS.course,
      subject: newS.subject,
      date: newS.date,
      startTime: newS.startTime,
      endTime: newS.endTime,
      duration: "90 mins",
      registeredStudents: newS.maxStudents,
      expectedAttendees: Math.round(newS.maxStudents * 0.8),
      type: "live",
      status: "upcoming",
      meetingLink: newS.meetingUrl,
    }
    setSessions([s, ...sessions])
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sessions..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40 transition-all"
            />
          </div>
          <span className="text-xs font-medium text-zinc-500">
            {filteredSessions.length} Sessions Scheduled
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-sm shadow-brand-orange/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="size-4" />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200/70 max-w-fit">
        {[
          { key: "all", label: "All Sessions", count: sessions.length },
          { key: "live_now", label: "Live Now", count: sessions.filter((s) => s.status === "live_now").length },
          { key: "upcoming", label: "Upcoming", count: sessions.filter((s) => s.status === "upcoming").length },
          { key: "completed", label: "Completed", count: sessions.filter((s) => s.status === "completed").length },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-white text-zinc-950 shadow-2xs font-bold border border-zinc-200/60"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.key ? "bg-brand-orange/20 text-amber-800 font-bold" : "bg-zinc-200 text-zinc-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sessions Table */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Session Title</th>
                <th className="py-3 px-4">Course & Subject</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Students Registered</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredSessions.map((s) => {
                const isLive = s.status === "live_now"

                return (
                  <tr
                    key={s.id}
                    className={`transition-colors ${isLive ? "bg-blue-50/30 hover:bg-blue-50/60" : "hover:bg-zinc-50"}`}
                  >
                    <td className="py-3.5 px-4 font-bold text-zinc-900">
                      <div className="flex items-center gap-2.5">
                        {isLive ? (
                          <Radio className="size-4 text-blue-600 animate-pulse" />
                        ) : (
                          <Video className="size-4 text-purple-600" />
                        )}
                        <span className="truncate max-w-xs">{s.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600">
                      <span className="font-semibold text-zinc-800 block truncate max-w-xs">{s.course}</span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">{s.subject}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-700">
                      <span className="font-medium block">{s.date}</span>
                      <span className="text-[11px] text-zinc-400">{s.startTime} - {s.endTime}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600">{s.duration}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-zinc-800">{s.registeredStudents} Students</span>
                      <span className="text-[10px] text-zinc-400 block">{s.expectedAttendees} Expected</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {s.attendanceCount ? (
                        <span className="font-bold text-emerald-700">
                          {s.attendanceCount} Present ({Math.round((s.attendanceCount / s.registeredStudents) * 100)}%)
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLive
                            ? "bg-red-100 text-red-700 animate-pulse"
                            : s.status === "completed"
                            ? "bg-zinc-100 text-zinc-600"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {s.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isLive ? (
                          <a
                            href={s.meetingLink || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs"
                          >
                            Enter Room
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(s)}
                          className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Attendance
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TeacherCreateSessionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveSession}
      />

      <TeacherSessionDetailModal
        session={selectedSession}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  )
}
