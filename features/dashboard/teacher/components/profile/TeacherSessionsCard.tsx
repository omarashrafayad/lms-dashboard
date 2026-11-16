"use client"

import * as React from "react"
import Link from "next/link"
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarClock,
  RotateCcw,
  ExternalLink,
  UserCheck,
  Check,
  X,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react"
import { TeacherSession } from "../../types/teacherProfile.types"
import {
  useTeacherHub,
  useTeacherSessions,
  useDecideBooking,
} from "@/features/dashboard/session/hooks/useSessions"
import {
  TeacherSessionCard as ITeacherSessionCard,
  TeacherBookingRequestItem,
  RescheduleRequestItem,
} from "@/features/dashboard/session/types/session.types"
import { RescheduleRequestModal } from "@/features/dashboard/session/components/reschedule/RescheduleRequestModal"
import { RespondRescheduleModal } from "@/features/dashboard/session/components/reschedule/RespondRescheduleModal"
import { CancelSessionModal } from "@/features/dashboard/session/components/booking/CancelSessionModal"
import { ChangeSessionStatusModal } from "@/features/dashboard/session/components/booking/ChangeSessionStatusModal"
import { BookSessionModal } from "@/features/dashboard/session/components/booking/BookSessionModal"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

interface TeacherSessionsCardProps {
  teacherId?: string
  teacherName?: string
  upcomingSessions?: TeacherSession[]
  previousSessions?: TeacherSession[]
}

type HubViewTab = "upcoming" | "past" | "booking_requests" | "reschedule_requests"

export function TeacherSessionsCard({
  teacherId,
  teacherName,
  upcomingSessions = [],
  previousSessions = [],
}: TeacherSessionsCardProps) {
  const [activeTab, setActiveTab] = React.useState<HubViewTab>("upcoming")

  // Modal states
  const [rescheduleSession, setRescheduleSession] = React.useState<ITeacherSessionCard | null>(null)
  const [cancelSessionItem, setCancelSessionItem] = React.useState<ITeacherSessionCard | null>(null)
  const [statusSessionItem, setStatusSessionItem] = React.useState<ITeacherSessionCard | null>(null)
  const [bookSessionItem, setBookSessionItem] = React.useState<ITeacherSessionCard | null>(null)
  const [respondRescheduleItem, setRespondRescheduleItem] = React.useState<RescheduleRequestItem | null>(null)

  // API mutations
  const decideBookingMutation = useDecideBooking()

  // Queries if teacherId is present
  const {
    data: hubData,
    isLoading: isLoadingHub,
    isError: isHubError,
  } = useTeacherHub(teacherId || "", undefined, { enabled: !!teacherId })

  const counts = hubData?.counts
  const upcomingList = hubData?.upcoming || []
  const pastList = hubData?.past || []
  const bookingRequests = hubData?.pendingBookingRequests || []
  const rescheduleRequests = hubData?.pendingRescheduleRequests || []

  const handleBookingDecision = async (
    sessionId: string,
    bookingId: string,
    decision: "Approved" | "Rejected"
  ) => {
    if (!teacherId) return
    try {
      await decideBookingMutation.mutateAsync({
        sessionId,
        bookingId,
        payload: {
          decision,
          teacherId,
        },
      })
      toast.success(`Booking request was ${decision.toLowerCase()} successfully.`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const renderStatusBadge = (status?: string | null) => {
    const s = status?.toLowerCase()
    if (s === "completed" || s === "confirmed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {status || "Completed"}
        </span>
      )
    }
    if (s === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
          <span className="size-1.5 rounded-full bg-rose-500" />
          {status || "Cancelled"}
        </span>
      )
    }
    if (s === "in progress" || s === "inprogress") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 animate-pulse">
          <span className="size-1.5 rounded-full bg-amber-500" />
          In Progress
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
        <span className="size-1.5 rounded-full bg-blue-500" />
        {status || "Upcoming"}
      </span>
    )
  }

  // If teacherId is not passed, render fallback static card
  if (!teacherId) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col gap-6">
        <h2 className="text-sm font-bold text-zinc-900">Sessions</h2>
        <div>
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            UPCOMING SESSIONS
          </div>
          {upcomingSessions.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-400">No sessions recorded</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="pb-3">STUDENT</th>
                    <th className="pb-3">SUBJECT</th>
                    <th className="pb-3">DATE</th>
                    <th className="pb-3">TIME</th>
                    <th className="pb-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {upcomingSessions.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-50/50">
                      <td className="py-3 font-semibold">{s.studentName}</td>
                      <td className="py-3 text-zinc-600">{s.subject}</td>
                      <td className="py-3 text-zinc-600">{s.date}</td>
                      <td className="py-3 text-zinc-600">{s.time}</td>
                      <td className="py-3">{renderStatusBadge(s.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs flex flex-col overflow-hidden">
      {/* Header and live counts */}
      <div className="p-6 border-b border-zinc-100 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
              <Calendar className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900">
                  Teacher Sessions Hub (مركز جلسات المدرس)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-[#B45309]">
                  Live Hub API
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Monitor live scheduling, manage student bookings, approve reschedules, and update session states.
              </p>
            </div>
          </div>

          <Link
            href="/sessions/schedule"
            className="h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Schedule New Session</span>
          </Link>
        </div>

        {/* 6 Quick Metric Badges from Hub API */}
        {counts && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex flex-col">
              <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
                Upcoming
              </span>
              <span className="text-lg font-bold text-blue-900">{counts.upcomingCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex flex-col">
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
                Past / Completed
              </span>
              <span className="text-lg font-bold text-emerald-900">{counts.pastCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex flex-col">
              <span className="text-[10px] text-purple-600 font-semibold uppercase tracking-wider">
                Live Now
              </span>
              <span className="text-lg font-bold text-purple-900">{counts.liveCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex flex-col">
              <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
                Today
              </span>
              <span className="text-lg font-bold text-amber-900">{counts.todayCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex flex-col">
              <span className="text-[10px] text-rose-600 font-semibold uppercase tracking-wider">
                Booking Requests
              </span>
              <span className="text-lg font-bold text-rose-900">{counts.pendingBookingRequestCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100 flex flex-col">
              <span className="text-[10px] text-orange-700 font-semibold uppercase tracking-wider">
                Reschedule Reqs
              </span>
              <span className="text-lg font-bold text-orange-900">{counts.pendingRescheduleRequestCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hub Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-zinc-100 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "upcoming"
              ? "bg-amber-500 text-white shadow-2xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          Upcoming Sessions ({upcomingList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("past")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "past"
              ? "bg-amber-500 text-white shadow-2xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          Past Sessions ({pastList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("booking_requests")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "booking_requests"
              ? "bg-amber-500 text-white shadow-2xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          Booking Requests ({bookingRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reschedule_requests")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "reschedule_requests"
              ? "bg-amber-500 text-white shadow-2xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          Reschedule Requests ({rescheduleRequests.length})
        </button>
      </div>

      {/* Tab Content */}
      {isLoadingHub ? (
        <div className="p-12">
          <LoadingSpinner title="Loading teacher session hub..." />
        </div>
      ) : isHubError ? (
        <GlobalError />
      ) : (
        <div className="p-6">
          {/* 1. UPCOMING SESSIONS */}
          {activeTab === "upcoming" && (
            <div className="overflow-x-auto">
              {upcomingList.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-400">
                  No upcoming sessions scheduled for this instructor.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="pb-3 px-3">Session</th>
                      <th className="pb-3 px-3">Student</th>
                      <th className="pb-3 px-3">Scheduled Time</th>
                      <th className="pb-3 px-3">Duration</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {upcomingList.map((s) => (
                      <tr key={s.id} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <Link
                            href={`/sessions/${s.id}`}
                            className="font-bold text-zinc-900 hover:text-amber-600 transition-colors flex items-center gap-1.5"
                          >
                            <span>{s.title || s.subjectName || "Private Session"}</span>
                            <ExternalLink className="size-3 text-zinc-400" />
                          </Link>
                          {s.courseName && (
                            <span className="text-[10px] text-zinc-400 block">{s.courseName}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-zinc-800 font-medium">
                          {s.studentName || `${s.studentCount} enrolled`}
                        </td>
                        <td className="py-3 px-3 text-zinc-600">
                          <div className="flex flex-col">
                            <span className="font-semibold text-zinc-800">
                              {s.scheduledStart ? new Date(s.scheduledStart).toLocaleDateString() : "—"}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {s.scheduledStart ? new Date(s.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-zinc-700 font-semibold">
                          {s.durationMinutes} mins
                        </td>
                        <td className="py-3 px-3">{renderStatusBadge(s.status || s.displayStatus)}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setBookSessionItem(s)}
                              title="Book Student"
                              className="h-8 px-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="size-3 text-zinc-500" />
                              <span>Book</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRescheduleSession(s)}
                              title="Request Reschedule"
                              className="h-8 px-2.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <CalendarClock className="size-3 text-amber-600" />
                              <span>Reschedule</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setStatusSessionItem(s)}
                              title="Change Status"
                              className="h-8 px-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="size-3 text-zinc-500" />
                              <span>Status</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCancelSessionItem(s)}
                              title="Cancel Session"
                              className="h-8 px-2.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="size-3 text-rose-500" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 2. PAST SESSIONS */}
          {activeTab === "past" && (
            <div className="overflow-x-auto">
              {pastList.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-400">
                  No past sessions recorded.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="pb-3 px-3">Session</th>
                      <th className="pb-3 px-3">Student</th>
                      <th className="pb-3 px-3">Date & Time</th>
                      <th className="pb-3 px-3">Duration</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {pastList.map((s) => (
                      <tr key={s.id} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3 px-3 font-semibold text-zinc-900">
                          {s.title || s.subjectName || "Session"}
                        </td>
                        <td className="py-3 px-3 text-zinc-700">{s.studentName || "—"}</td>
                        <td className="py-3 px-3 text-zinc-600">
                          {s.scheduledStart ? new Date(s.scheduledStart).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 px-3 font-semibold text-zinc-700">
                          {s.durationMinutes} mins
                        </td>
                        <td className="py-3 px-3">{renderStatusBadge(s.status || s.displayStatus)}</td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            href={`/sessions/${s.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline"
                          >
                            <span>Details</span>
                            <ExternalLink className="size-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 3. PENDING BOOKING REQUESTS */}
          {activeTab === "booking_requests" && (
            <div className="overflow-x-auto">
              {bookingRequests.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-400">
                  No pending student booking requests awaiting teacher decision.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="pb-3 px-3">Student</th>
                      <th className="pb-3 px-3">Session / Subject</th>
                      <th className="pb-3 px-3">Scheduled Slot</th>
                      <th className="pb-3 px-3">Requested At</th>
                      <th className="pb-3 px-3 text-right">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {bookingRequests.map((b) => (
                      <tr key={b.bookingId} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold text-zinc-900 block">{b.studentName || "Student"}</span>
                          {b.educationSystem && (
                            <span className="text-[10px] text-zinc-400">{b.educationSystem}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-zinc-800">
                          <span className="font-semibold block">{b.sessionTitle || "Private Session"}</span>
                          <span className="text-[10px] text-zinc-400">{b.subjectName || "Subject"}</span>
                        </td>
                        <td className="py-3 px-3 text-zinc-600">
                          <div className="flex flex-col">
                            <span className="font-medium text-zinc-800">
                              {b.scheduledStart ? new Date(b.scheduledStart).toLocaleDateString() : "—"}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {b.durationMinutes} mins ({b.seatsLeft} seats left)
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">
                          {b.requestedAt ? new Date(b.requestedAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleBookingDecision(b.sessionId, b.bookingId, "Approved")
                              }
                              disabled={decideBookingMutation.isPending}
                              className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <Check className="size-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleBookingDecision(b.sessionId, b.bookingId, "Rejected")
                              }
                              disabled={decideBookingMutation.isPending}
                              className="h-8 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <X className="size-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 4. PENDING RESCHEDULE REQUESTS */}
          {activeTab === "reschedule_requests" && (
            <div className="overflow-x-auto">
              {rescheduleRequests.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-400">
                  No pending reschedule requests for this instructor.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="pb-3 px-3">Session</th>
                      <th className="pb-3 px-3">Requested By</th>
                      <th className="pb-3 px-3">Original Time</th>
                      <th className="pb-3 px-3">Proposed Time</th>
                      <th className="pb-3 px-3">Note</th>
                      <th className="pb-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {rescheduleRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3 px-3 font-semibold text-zinc-900">
                          {r.sessionTitle || r.sessionId.slice(0, 8)}
                        </td>
                        <td className="py-3 px-3 text-zinc-700">
                          {r.requestedByName || r.requestedBy || "User"}
                        </td>
                        <td className="py-3 px-3 text-zinc-600">
                          {r.originalDate || (r.originalStart ? new Date(r.originalStart).toLocaleDateString() : "—")}
                        </td>
                        <td className="py-3 px-3 text-amber-700 font-bold bg-amber-50/40 px-2 py-1 rounded">
                          {r.newDate || (r.newStart ? new Date(r.newStart).toLocaleDateString() : "—")}
                        </td>
                        <td className="py-3 px-3 text-zinc-600 italic max-w-xs truncate">
                          {r.requestNote || "—"}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setRespondRescheduleItem(r)}
                            className="h-8 px-3 rounded-lg bg-[#F59E0B] hover:bg-amber-500 text-white font-semibold text-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer ml-auto"
                          >
                            <CalendarClock className="size-3.5" />
                            <span>Respond</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals for actions */}
      {rescheduleSession && (
        <RescheduleRequestModal
          isOpen={Boolean(rescheduleSession)}
          onClose={() => setRescheduleSession(null)}
          sessionId={rescheduleSession.id}
          sessionTitle={rescheduleSession.title || rescheduleSession.subjectName || "Session"}
          currentDate={rescheduleSession.scheduledStart ? new Date(rescheduleSession.scheduledStart).toLocaleDateString() : undefined}
          currentTime={rescheduleSession.scheduledStart ? new Date(rescheduleSession.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined}
          teacherId={teacherId}
          teacherName={teacherName}
        />
      )}

      {cancelSessionItem && (
        <CancelSessionModal
          isOpen={Boolean(cancelSessionItem)}
          onClose={() => setCancelSessionItem(null)}
          sessionId={cancelSessionItem.id}
          teacherId={teacherId}
          sessionTitle={cancelSessionItem.title || cancelSessionItem.subjectName || "Session"}
        />
      )}

      {statusSessionItem && (
        <ChangeSessionStatusModal
          isOpen={Boolean(statusSessionItem)}
          onClose={() => setStatusSessionItem(null)}
          sessionId={statusSessionItem.id}
          currentStatus={statusSessionItem.status || "Upcoming"}
          sessionTitle={statusSessionItem.title || statusSessionItem.subjectName || "Session"}
        />
      )}

      {bookSessionItem && (
        <BookSessionModal
          isOpen={Boolean(bookSessionItem)}
          onClose={() => setBookSessionItem(null)}
          sessionId={bookSessionItem.id}
          sessionTitle={bookSessionItem.title || bookSessionItem.subjectName || "Session"}
        />
      )}

      {respondRescheduleItem && (
        <RespondRescheduleModal
          isOpen={Boolean(respondRescheduleItem)}
          onClose={() => setRespondRescheduleItem(null)}
          request={respondRescheduleItem}
        />
      )}
    </div>
  )
}
