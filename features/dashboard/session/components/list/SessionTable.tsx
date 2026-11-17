"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import { SessionItem } from "../../types/session.types"
import { SessionRowActions } from "./SessionRowActions"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import EmptyState from "@/components/shared/EmptyState"
import { Calendar, Video } from "lucide-react"

export interface SessionTableProps {
  sessions: SessionItem[]
  isLoading?: boolean
  serverPagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    onPageChange: (page: number) => void
    pageSizeOptions?: number[]
    onPageSizeChange?: (pageSize: number) => void
  }
  pageSize?: number
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "In Progress":
      return {
        badge: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
        dot: "bg-[#D97706]",
      }
    case "Upcoming":
    case "Scheduled":
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

const getPaymentBadge = (payment: string) => {
  switch (payment) {
    case "Paid":
      return {
        badge: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]",
        dot: "bg-[#16A34A]",
      }
    case "Refunded":
      return {
        badge: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]",
        dot: "bg-[#0284C7]",
      }
    default:
      return {
        badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
        dot: "bg-zinc-400",
      }
  }
}

export function SessionTable({
  sessions,
  isLoading = false,
  serverPagination,
  pageSize = 10,
}: SessionTableProps) {
  const router = useRouter()

  const columns: UniTableColumn<SessionItem>[] = React.useMemo(
    () => [
      {
        id: "session",
        header: "SESSION",
        cell: (_val, item) => {
          const sessionCode =
            item.sessionNumber ||
            item.sessionId ||
            item.sessionCode ||
            `#${item.id.slice(0, 6)}`
          return (
            <button
              type="button"
              onClick={() => router.push(`/sessions/${item.id}`)}
              className="flex flex-col gap-0.5 text-left cursor-pointer group"
            >
              <span className="font-bold text-zinc-900 group-hover:text-amber-700 transition-colors">
                Session {sessionCode}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal">
                {item.sessionType || "Private 1:1"}
              </span>
            </button>
          )
        },
      },
      {
        id: "student",
        header: "STUDENT",
        cell: (_val, item) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-zinc-900">
              {item.studentName || item.student?.name || "Student"}
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">
              {item.studentGrade ||
                item.student?.academicYear ||
                item.educationStage ||
                "Grade 10"}
            </span>
          </div>
        ),
      },
      {
        id: "teacher",
        header: "TEACHER",
        cell: (_val, item) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-zinc-900">
              {item.teacherName || item.teacher?.name || "Teacher"}
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">
              {item.teacherSubject || item.teacher?.subject || "Instructor"}
            </span>
          </div>
        ),
      },
      {
        id: "subjectOrCourse",
        header: "SUBJECT / COURSE",
        cell: (_val, item) => (
          <span className="font-medium text-zinc-800">
            {item.subject ||
              item.subjectOrCourse ||
              item.courseName ||
              item.subjectName ||
              "General"}
          </span>
        ),
      },
      {
        id: "dateTime",
        header: "DATE & TIME",
        cell: (_val, item) => {
          const date =
            item.date ||
            item.formattedDate ||
            (item.formattedDateTime ? item.formattedDateTime.split(" ")[0] : null) ||
            "Today"
          const time = item.startTime || item.time || "10:00 AM"
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-zinc-900">{date}</span>
              <span className="text-[11px] text-zinc-400 font-normal">{time}</span>
            </div>
          )
        },
      },
      {
        id: "duration",
        header: "DURATION",
        cell: (_val, item) => (
          <span className="font-medium text-zinc-700">
            {item.duration ||
              (item.durationMinutes ? `${item.durationMinutes} min` : "60 min")}
          </span>
        ),
      },
      {
        id: "status",
        header: "SESSION STATUS",
        cell: (_val, item) => {
          const status = item.status || item.sessionStatus || "Upcoming"
          const sStyle = getStatusBadge(status)
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sStyle.badge} shadow-2xs`}
            >
              <span className={`size-1.5 rounded-full ${sStyle.dot}`} />
              {status}
            </span>
          )
        },
      },
      {
        id: "payment",
        header: "PAYMENT",
        cell: (_val, item) => {
          const payment =
            item.paymentStatus || item.payment || (item.isPaid ? "Paid" : "Unpaid")
          const pStyle = getPaymentBadge(payment)
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${pStyle.badge} shadow-2xs`}
            >
              <span className={`size-1.5 rounded-full ${pStyle.dot}`} />
              {payment}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "",
        className: "text-right",
        cell: (_val, item) => (
          <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
            <SessionRowActions session={item} />
          </div>
        ),
      },
    ],
    []
  )

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-12">
        <LoadingSpinner title="Loading sessions..." />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <UniTable
        data={sessions}
        columns={columns}
        serverPagination={serverPagination}
        pageSize={pageSize}
        itemLabel="sessions"
        emptyMessage={
          <EmptyState
            icon={Calendar}
            title="No sessions found"
            description="No scheduled or past sessions match the selected filters."
          />
        }
      />
    </div>
  )
}
