"use client"

import * as React from "react"
import {
  Video,
  Clock,
  Radio,
  Calendar as CalendarIcon,
  Play,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Coins,
  RefreshCw,
  User,
  PhoneCall,
  CalendarDays,
  List,
} from "lucide-react"
import { useStudentSessions } from "../hooks/useStudentPortal"
import { StudentSessionItem } from "../types/studentApi.types"

export function StudentSessionsView() {
  const [activeTab, setActiveTab] = React.useState<"upcoming" | "previous" | "all">("upcoming")
  const [selectedSession, setSelectedSession] = React.useState<StudentSessionItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  const { data, isLoading, isError, refetch, isFetching } = useStudentSessions()

  const pointsBalance = data?.pointsBalance ?? 150
  const upcomingSessions = data?.upcoming || []
  const previousSessions = data?.previous || []

  const displayedSessions = React.useMemo(() => {
    if (activeTab === "upcoming") return upcomingSessions
    if (activeTab === "previous") return previousSessions
    return [...upcomingSessions, ...previousSessions]
  }, [activeTab, upcomingSessions, previousSessions])

  const handleOpenDetail = (session: StudentSessionItem) => {
    setSelectedSession(session)
    setIsDetailOpen(true)
  }

  const formatSessionTime = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return {
        date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }
    } catch {
      return { date: "Scheduled", time: "TBD" }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Points Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
              <Video className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              My Live Sessions
            </h1>
          </div>
          <p className="text-xs text-zinc-500">
            Attend real-time video tutoring sessions, live webinars, and access past recorded archives
          </p>
        </div>

        {/* Points Balance Card & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 shadow-2xs">
            <div className="size-9 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold">
              <Coins className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Points Balance
              </span>
              <span className="text-sm font-extrabold text-zinc-900">
                {pointsBalance} pts
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white transition-all shadow-2xs cursor-pointer"
            title="Refresh sessions"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200/70 max-w-fit">
        {[
          { key: "upcoming", label: "Upcoming Sessions", count: upcomingSessions.length },
          { key: "previous", label: "Previous & Recordings", count: previousSessions.length },
          { key: "all", label: "All Sessions", count: upcomingSessions.length + previousSessions.length },
        ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-brand-orange text-white shadow-2xs"
                  : "bg-zinc-800/80 text-white hover:bg-zinc-900"
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-bold">
                {tab.count}
              </span>
            </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs animate-pulse flex flex-col gap-4"
            >
              <div className="h-6 w-1/3 bg-zinc-200 rounded" />
              <div className="h-16 bg-zinc-100 rounded-2xl" />
              <div className="h-10 bg-zinc-100 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="p-8 text-center bg-white rounded-3xl border border-rose-200 shadow-2xs flex flex-col items-center gap-3">
          <div className="size-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            !
          </div>
          <h3 className="text-base font-bold text-zinc-900">Failed to load sessions</h3>
          <p className="text-xs text-zinc-500 max-w-md">
            We were unable to load your scheduled sessions. Please verify your connection or try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-brand-orange text-white font-bold text-xs hover:brightness-105 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Sessions Grid */}
      {!isLoading && !isError && displayedSessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedSessions.map((session) => {
            const startObj = formatSessionTime(session.scheduledStart)
            const endObj = formatSessionTime(session.scheduledEnd)

            return (
              <div
                key={session.sessionId || session.bookingId}
                className={`p-6 rounded-3xl border flex flex-col justify-between gap-5 transition-all shadow-2xs hover:shadow-md ${
                  session.isJoinable
                    ? "bg-amber-50/30 border-amber-300 ring-2 ring-amber-400/20"
                    : "bg-white border-zinc-200/80"
                }`}
              >
                <div className="flex flex-col gap-3.5">
                  {/* Top Bar: Subject and Status Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200/60">
                      {session.subjectName || "Academic Curriculum"}
                    </span>

                    <div className="flex items-center gap-2">
                      {session.isJoinable && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white flex items-center gap-1.5 shadow-2xs animate-pulse">
                          <Radio className="size-3" />
                          LIVE NOW
                        </span>
                      )}

                      {session.isAwaitingTeacher && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Waiting for Teacher
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 capitalize">
                        {session.sessionStatus || session.bookingStatus || "Confirmed"}
                      </span>
                    </div>
                  </div>

                  {/* Title & Teacher Card */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-amber-100 border border-amber-300 text-brand-orange flex items-center justify-center font-bold text-xs shrink-0">
                          <User className="size-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-900">
                            {session.teacherName}
                          </span>
                          <span className="text-[10px] text-zinc-500 capitalize flex items-center gap-1">
                            <PhoneCall className="size-3 text-zinc-400" />
                            {session.callType || "Video Call"}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-lg">
                        {session.durationMinutes} mins
                      </span>
                    </div>

                    {/* Schedule Time */}
                    <div className="flex items-center gap-4 text-xs text-zinc-600 pt-2 border-t border-zinc-200/60">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CalendarIcon className="size-3.5 text-zinc-400" />
                        {startObj.date}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="size-3.5 text-zinc-400" />
                        {startObj.time} - {endObj.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(session)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                  </button>

                  {session.isJoinable ? (
                    <a
                      href={session.meetingUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Play className="size-3.5 fill-current" />
                      <span>Join Room Now</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled={!session.meetingUrl}
                      onClick={() => {
                        if (session.meetingUrl) window.open(session.meetingUrl, "_blank")
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ExternalLink className="size-3.5" />
                      <span>Meeting Link</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && displayedSessions.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-zinc-200/80 text-center flex flex-col items-center justify-center gap-3">
          <div className="size-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Video className="size-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">
            {activeTab === "upcoming" ? "No upcoming live sessions" : "No previous session records"}
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            {activeTab === "upcoming"
              ? "You don't have any scheduled sessions right now. Use your points balance to book a tutoring session with an instructor."
              : "Previous session recordings will appear here once your completed webinars are archived."}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
                  <Video className="size-4" />
                </span>
                <h3 className="text-base font-bold text-zinc-900">Session Information</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="size-8 rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50">
                <span className="text-zinc-500">Subject</span>
                <span className="font-bold text-zinc-900">{selectedSession.subjectName}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50">
                <span className="text-zinc-500">Instructor</span>
                <span className="font-bold text-zinc-900">{selectedSession.teacherName}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50">
                <span className="text-zinc-500">Call Type</span>
                <span className="font-bold text-zinc-900 capitalize">{selectedSession.callType}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50">
                <span className="text-zinc-500">Duration</span>
                <span className="font-bold text-zinc-900">{selectedSession.durationMinutes} Minutes</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50">
                <span className="text-zinc-500">Status</span>
                <span className="font-bold text-amber-800 capitalize">
                  {selectedSession.sessionStatus || selectedSession.bookingStatus}
                </span>
              </div>
              {selectedSession.meetingUrl && (
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
                  <span className="text-[11px] font-bold text-amber-900">Virtual Meeting Room:</span>
                  <a
                    href={selectedSession.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-800 underline truncate"
                  >
                    {selectedSession.meetingUrl}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
              {selectedSession.canCancel && (
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
                >
                  Cancel Booking
                </button>
              )}
              {selectedSession.isJoinable && selectedSession.meetingUrl ? (
                <a
                  href={selectedSession.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-brand-orange text-white font-bold text-xs text-center hover:brightness-105 cursor-pointer"
                >
                  Join Meeting Now
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-black cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
