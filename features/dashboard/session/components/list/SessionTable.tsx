"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SessionItem, SessionStatus, PaymentStatus } from "../../types/session.types"
import { SessionRowActions } from "./SessionRowActions"

export interface SessionTableProps {
  sessions: SessionItem[]
  isLoading?: boolean
}

export function SessionTable({ sessions, isLoading = false }: SessionTableProps) {
  const router = useRouter()

  const getStatusBadge = (status: SessionStatus) => {
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

  const getPaymentBadge = (payment: PaymentStatus) => {
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

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-200/80 text-[11px] font-bold text-zinc-400 tracking-wider uppercase bg-zinc-50/50">
              <th className="py-3.5 px-4 font-semibold">SESSION</th>
              <th className="py-3.5 px-4 font-semibold">STUDENT</th>
              <th className="py-3.5 px-4 font-semibold">TEACHER</th>
              <th className="py-3.5 px-4 font-semibold">SUBJECT / COURSE</th>
              <th className="py-3.5 px-4 font-semibold">DATE & TIME</th>
              <th className="py-3.5 px-4 font-semibold">DURATION</th>
              <th className="py-3.5 px-4 font-semibold">SESSION STATUS</th>
              <th className="py-3.5 px-4 font-semibold">PAYMENT</th>
              <th className="py-3.5 px-4 text-right font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-400">
                  Loading sessions...
                </td>
              </tr>
            ) : sessions.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-400">
                  No sessions found matching your criteria.
                </td>
              </tr>
            ) : (
              sessions.map((session) => {
                const statusStyle = getStatusBadge(session.status)
                const paymentStyle = getPaymentBadge(session.paymentStatus)

                return (
                  <tr
                    key={session.id}
                    onClick={() => router.push(`/sessions/${session.id}`)}
                    className="hover:bg-zinc-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Session Column: Session #10484 + Private 1:1 */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                          Session {session.sessionNumber}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-normal">
                          {session.sessionType}
                        </span>
                      </div>
                    </td>

                    {/* Student */}
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-zinc-900">
                      {session.studentName}
                    </td>

                    {/* Teacher */}
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-zinc-800">
                      {session.teacherName}
                    </td>

                    {/* Subject / Course */}
                    <td className="py-4 px-4 whitespace-nowrap text-zinc-600">
                      {session.subject}
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-800">
                          {session.date}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-normal">
                          {session.startTime}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-4 whitespace-nowrap text-zinc-600">
                      {session.duration}
                    </td>

                    {/* Session Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.badge}`}
                      >
                        <span className={`size-1.5 rounded-full ${statusStyle.dot}`} />
                        {session.status}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${paymentStyle.badge}`}
                      >
                        <span className={`size-1.5 rounded-full ${paymentStyle.dot}`} />
                        {session.paymentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-4 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SessionRowActions session={session} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
