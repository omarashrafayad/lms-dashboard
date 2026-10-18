"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Trash2,
  Pencil,
  ArrowUpRight,
} from "lucide-react"
import { useSessionDetail, useDeleteSession } from "../hooks/useSessions"
import { SessionActivityTimeline } from "../components/detail/SessionActivityTimeline"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import { toast } from "sonner"

export interface SessionDetailPageProps {
  sessionId: string
}

export default function SessionDetailPage({
  sessionId,
}: SessionDetailPageProps) {
  const router = useRouter()
  const { data: session, isLoading, isError } = useSessionDetail(sessionId)
  const deleteMutation = useDeleteSession()

  const handleDeleteSession = async () => {
    if (!session) return
    if (!confirm("Are you sure you want to delete this session?")) return

    try {
      await deleteMutation.mutateAsync(session.id)
      toast.success("Session deleted successfully.")
      router.push("/sessions")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <LoadingSpinner title="loading session details" />
      </div>
    )
  }

  if (isError || !session) {
    return (
      <div className="flex-1 p-8">
        <GlobalError />
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return {
          badge: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
          dot: "bg-[#D97706]",
        }
      case "Upcoming":
        return {
          badge: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]",
          dot: "bg-[#0284C7]",
        }
      case "Completed":
        return {
          badge: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]",
          dot: "bg-[#16A34A]",
        }
      case "Missed":
        return {
          badge: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]",
          dot: "bg-[#DC2626]",
        }
      case "Cancelled":
        return {
          badge: "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]",
          dot: "bg-[#64748B]",
        }
      default:
        return {
          badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
          dot: "bg-zinc-400",
        }
    }
  }

  const currentStatus = session.status || session.sessionStatus || "Upcoming"
  const statusStyle = getStatusBadge(currentStatus)

  // Timeline list
  const timelineItems =
    session.activityTimeline ||
    session.timeline ||
    [
      {
        id: "1",
        title: "Session Scheduled",
        subtitle: `${session.date || session.formattedDate || "Today"} · ${
          session.startTime || session.time || "Scheduled"
        }`,
        completed: true,
      },
    ]

  const sessionNumberText =
    session.sessionNumber ||
    session.sessionId ||
    session.sessionCode ||
    `#${session.id}`

  const studentNameText =
    session.studentName || session.student?.name || "Student"
  const studentGradeText =
    session.studentGrade ||
    session.student?.academicYear ||
    session.student?.academicStage ||
    session.educationStage ||
    "Grade 10"

  const teacherNameText =
    session.teacherName || session.teacher?.name || "Teacher"
  const teacherSubjectText =
    session.teacherSubject ||
    session.teacher?.subject ||
    session.subject ||
    "Instructor"
  const teacherAvailabilityText =
    session.teacherAvailability ||
    (session.teacher?.isAvailable !== false ? "Available" : "Busy")

  const subjectOrCourseText =
    session.subject ||
    session.subjectOrCourse ||
    session.courseName ||
    session.subjectName ||
    "General"

  const dateText =
    session.date ||
    session.formattedDate ||
    session.formattedDateTime?.split(" ")[0] ||
    "Today"
  const startTimeText =
    session.startTime || session.time || "10:00 AM"
  const endTimeText =
    session.endTime || session.sessionInformation?.endTime || "11:00 AM"
  const durationText =
    session.duration ||
    (session.durationMinutes ? `${session.durationMinutes} min` : "60 min")

  const bookingIdText =
    session.bookingId ||
    session.bookingInformation?.bookingId ||
    session.booking?.bookingId ||
    session.bookingCode ||
    `BK-${session.id.slice(0, 6)}`

  const bookingRequestedDateText =
    session.bookingRequestedDate ||
    session.bookingInformation?.requestedDate ||
    session.requestedDate ||
    dateText

  const bookingRequestedTimeText =
    session.bookingRequestedTime ||
    session.bookingInformation?.requestedTime ||
    session.requestedTime ||
    startTimeText

  const bookingCreatedAtText =
    session.bookingCreatedAt ||
    session.bookingInformation?.createdAtFormatted ||
    session.bookingInformation?.createdAt ||
    dateText

  const bookingStatusText =
    session.bookingStatus ||
    session.bookingInformation?.bookingStatus ||
    session.bookingInformation?.status ||
    "Confirmed"

  const paymentStatusText =
    session.paymentStatus ||
    session.payment ||
    (session.isPaid ? "Paid" : "Unpaid")

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20 animate-in fade-in duration-200">
        <div>
          <Link
            href="/sessions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to All Sessions</span>
          </Link>
        </div>

        {/* Header Row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Session {sessionNumberText}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.badge} shadow-2xs`}
              >
                <span className={`size-1.5 rounded-full ${statusStyle.dot}`} />
                {currentStatus}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-normal">
              {subjectOrCourseText} · {dateText} · {startTimeText}
            </p>
          </div>

          {/* Action Buttons: Delete & Edit */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDeleteSession}
              disabled={deleteMutation.isPending}
              className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              <Trash2 className="size-3.5 text-rose-500" />
              <span>Delete Session</span>
            </button>

            <button
              type="button"
              onClick={() => router.push(`/sessions/${session.id}/edit`)}
              className="h-9 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Pencil className="size-3.5 stroke-[2.2]" />
              <span>Edit Session</span>
            </button>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Card 1: Session Information */}
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
                    Session {sessionNumberText}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    SESSION TYPE
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {session.sessionType || "Private 1:1"}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    DATE
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {dateText}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    START TIME
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {startTimeText}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    END TIME
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {endTimeText}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    DURATION
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {durationText}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    SESSION STATUS
                  </span>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.badge}`}
                    >
                      <span className={`size-1.5 rounded-full ${statusStyle.dot}`} />
                      {currentStatus}
                    </span>
                  </div>
                </div>

                {session.notes && (
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                      NOTES
                    </span>
                    <span className="text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                      {session.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Row of 2 Cards: Student & Teacher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Card 2: Student */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">
                    Student
                  </span>
                  <Link
                    href="/student/student_list"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 text-[11px] font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors shadow-2xs"
                  >
                    <span>View Student</span>
                    <ArrowUpRight className="size-3 text-zinc-400" />
                  </Link>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <h4 className="text-sm font-bold text-zinc-900">
                    {studentNameText}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-400">Academic Year</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F3E8FF] text-[#7E22CE]">
                      {studentGradeText}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-400">Subject / Course</span>
                    <span className="font-semibold text-zinc-800">
                      {subjectOrCourseText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Teacher */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">
                    Teacher
                  </span>
                  <Link
                    href="/teacher/teacher_list"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 text-[11px] font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors shadow-2xs"
                  >
                    <span>View Teacher</span>
                    <ArrowUpRight className="size-3 text-zinc-400" />
                  </Link>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <h4 className="text-sm font-bold text-zinc-900">
                    {teacherNameText}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-400">Subject</span>
                    <span className="font-medium text-zinc-800">
                      {teacherSubjectText}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-400">Availability</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        teacherAvailabilityText === "Available"
                          ? "bg-[#DCFCE7] text-[#16A34A]"
                          : "bg-[#FEF3C7] text-[#D97706]"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          teacherAvailabilityText === "Available"
                            ? "bg-[#16A34A]"
                            : "bg-[#D97706]"
                        }`}
                      />
                      {teacherAvailabilityText}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Booking Information */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                Booking Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    BOOKING ID
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {bookingIdText}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    REQUESTED DATE
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {bookingRequestedDateText}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    REQUESTED TIME
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {bookingRequestedTimeText}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    CREATED AT
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {bookingCreatedAtText}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    BOOKING STATUS
                  </span>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
                      <span className="size-1.5 rounded-full bg-[#16A34A]" />
                      {bookingStatusText}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Payment */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                  Payment
                </h3>
                <p className="text-[11px] text-zinc-400 font-normal">
                  Shown for reference only. Payment management belongs to Subscriptions & Payments.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    PAYMENT STATUS
                  </span>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
                      <span className="size-1.5 rounded-full bg-[#16A34A]" />
                      {paymentStatusText}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    TOTAL PAYMENT
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {session.totalPayment || "200 EGP"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity Timeline */}
          <div className="lg:col-span-1">
            <SessionActivityTimeline timeline={timelineItems} />
          </div>
        </div>
      </main>
    </div>
  )
}
