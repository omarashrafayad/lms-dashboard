"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSessionDetail, useDeleteSession } from "../hooks/useSessions"
import { normalizeSessionDetail } from "../utils/sessionDetail.utils"
import { SessionDetailHeader } from "../components/detail/SessionDetailHeader"
import { SessionInfoCard } from "../components/detail/SessionInfoCard"
import { SessionStudentCard } from "../components/detail/SessionStudentCard"
import { SessionTeacherCard } from "../components/detail/SessionTeacherCard"
import { SessionBookingCard } from "../components/detail/SessionBookingCard"
import { SessionActivityTimeline } from "../components/detail/SessionActivityTimeline"

import { RescheduleRequestModal } from "../components/reschedule/RescheduleRequestModal"
import { BookSessionModal } from "../components/booking/BookSessionModal"
import { ChangeSessionStatusModal } from "../components/booking/ChangeSessionStatusModal"
import { CancelSessionModal } from "../components/booking/CancelSessionModal"

import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export interface SessionDetailPageProps {
  sessionId: string
}

export default function SessionDetailPage({ sessionId }: SessionDetailPageProps) {
  const router = useRouter()
  const [isRescheduleOpen, setIsRescheduleOpen] = React.useState(false)
  const [isBookOpen, setIsBookOpen] = React.useState(false)
  const [isStatusOpen, setIsStatusOpen] = React.useState(false)
  const [isCancelOpen, setIsCancelOpen] = React.useState(false)

  const { data: rawSession, isLoading, isError } = useSessionDetail(sessionId)
  const deleteMutation = useDeleteSession()

  const handleDeleteSession = async () => {
    if (!rawSession) return
    if (!confirm("Are you sure you want to delete this session?")) return

    try {
      await deleteMutation.mutateAsync(rawSession.id)
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

  if (isError || !rawSession) {
    return (
      <div className="flex-1 p-8">
        <GlobalError />
      </div>
    )
  }

  const session = normalizeSessionDetail(rawSession)

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20 animate-in fade-in duration-200">
        {/* Header with breadcrumb and actions */}
        <SessionDetailHeader
          session={session}
          onOpenBook={() => setIsBookOpen(true)}
          onOpenStatus={() => setIsStatusOpen(true)}
          onOpenReschedule={() => setIsRescheduleOpen(true)}
          onOpenCancel={() => setIsCancelOpen(true)}
          onDeleteSession={handleDeleteSession}
          isDeleting={deleteMutation.isPending}
        />

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (Span 2): Cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <SessionInfoCard session={session} />
            <SessionStudentCard student={session.student} />
            <SessionTeacherCard teacher={session.teacher} />
            <SessionBookingCard booking={session.booking} />
          </div>

          {/* Right Column (Span 1): Activity Timeline */}
          <div className="lg:col-span-1">
            <SessionActivityTimeline timeline={session.timeline} />
          </div>
        </div>
      </main>

      {/* Interactive Modals */}
      <RescheduleRequestModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        sessionId={session.id}
        sessionTitle={session.title}
        currentDate={session.date}
        currentTime={session.startTime}
        teacherId={session.teacher.id}
        teacherName={session.teacher.name}
        studentId={session.student.id}
        studentName={session.student.name}
      />

      <BookSessionModal
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        sessionId={session.id}
        sessionTitle={session.title}
      />

      <ChangeSessionStatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        sessionId={session.id}
        currentStatus={session.status}
        sessionTitle={session.title}
      />

      <CancelSessionModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        sessionId={session.id}
        teacherId={session.teacher.id}
        sessionTitle={session.title}
      />
    </div>
  )
}
