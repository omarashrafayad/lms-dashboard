"use client"

import * as React from "react"
import Link from "next/link"
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  RotateCcw,
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { useRescheduleRequests } from "../hooks/useSessions"
import { RescheduleRequestItem } from "../types/session.types"
import { RespondRescheduleModal } from "../components/reschedule/RespondRescheduleModal"

type StatusFilter = "all" | "Pending" | "Approved" | "Rejected"

export function RescheduleRequestsPage() {
  const [page, setPage] = React.useState(1)
  const [pageSize] = React.useState(10)
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [search, setSearch] = React.useState("")
  const [selectedRequestForResponse, setSelectedRequestForResponse] =
    React.useState<RescheduleRequestItem | null>(null)

  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useRescheduleRequests({
    page,
    pageSize,
    status: statusFilter === "all" ? undefined : statusFilter,
  })

  const requests = React.useMemo(
    () => responseData?.items || [],
    [responseData]
  )
  const totalCount = responseData?.totalCount ?? requests.length
  const totalPages = responseData?.totalPages ?? 1

  // Filter requests locally if search is typed
  const filteredRequests = React.useMemo(() => {
    if (!search.trim()) return requests
    const q = search.toLowerCase()
    return requests.filter(
      (r) =>
        r.sessionTitle?.toLowerCase().includes(q) ||
        r.teacherName?.toLowerCase().includes(q) ||
        r.studentName?.toLowerCase().includes(q) ||
        r.requestedByName?.toLowerCase().includes(q) ||
        r.requestNote?.toLowerCase().includes(q)
    )
  }, [requests, search])

  // Count summaries
  const pendingCount = requests.filter((r) => r.status?.toLowerCase() === "pending").length
  const approvedCount = requests.filter((r) => r.status?.toLowerCase() === "approved").length
  const rejectedCount = requests.filter((r) => r.status?.toLowerCase() === "rejected").length

  const getStatusBadge = (status?: string | null) => {
    const s = status?.toLowerCase()
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Approved
        </span>
      )
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
          <span className="size-1.5 rounded-full bg-rose-500" />
          Rejected
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 animate-pulse">
        <span className="size-1.5 rounded-full bg-amber-500" />
        Pending Review
      </span>
    )
  }

  const columns = React.useMemo<UniTableColumn<RescheduleRequestItem>[]>(
    () => [
      {
        id: "sessionDetails",
        header: "Session Details",
        cell: (_val, item: RescheduleRequestItem) => (
          <div className="flex flex-col">
            <Link
              href={`/sessions/${item.sessionId}`}
              className="text-xs font-bold text-zinc-900 hover:text-amber-600 transition-colors flex items-center gap-1.5"
            >
              <span>{item.sessionTitle || "Private Session"}</span>
              <ExternalLink className="size-3 text-zinc-400" />
            </Link>
            <span className="text-[11px] text-zinc-400 font-mono">
              ID: {item.sessionId?.slice(0, 8)}
            </span>
          </div>
        ),
      },
      {
        id: "teacherAndStudent",
        header: "Teacher & Student",
        cell: (_val, item: RescheduleRequestItem) => (
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-zinc-800">
              Teacher: {item.teacherName || "—"}
            </span>
            <span className="text-zinc-500 text-[11px]">
              Student: {item.studentName || "—"}
            </span>
          </div>
        ),
      },
      {
        id: "requestedBy",
        header: "Requested By",
        cell: (_val, item: RescheduleRequestItem) => (
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-zinc-800">
              {item.requestedByName || item.requestedBy || "User"}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              Role: {item.requestedBy || "Requester"}
            </span>
          </div>
        ),
      },
      {
        id: "originalSlot",
        header: "Original Slot",
        cell: (_val, item: RescheduleRequestItem) => (
          <div className="flex flex-col text-xs text-zinc-600">
            <span className="font-medium text-zinc-800">
              {item.originalDate || (item.originalStart ? new Date(item.originalStart).toLocaleDateString() : "—")}
            </span>
            <span className="text-[11px] text-zinc-400">
              {item.originalTimeSlot || (item.originalStart ? new Date(item.originalStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—")}
            </span>
          </div>
        ),
      },
      {
        id: "requestedSlot",
        header: "Requested Slot",
        cell: (_val, item: RescheduleRequestItem) => (
          <div className="flex flex-col text-xs text-amber-700 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
            <span className="font-bold">
              {item.newDate || (item.newStart ? new Date(item.newStart).toLocaleDateString() : "—")}
            </span>
            <span className="text-[11px] text-amber-600 font-medium">
              {item.newTimeSlot || (item.newStart ? new Date(item.newStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—")}
            </span>
          </div>
        ),
      },
      {
        id: "note",
        header: "Note",
        cell: (_val, item: RescheduleRequestItem) => (
          <div className="max-w-[200px]">
            {item.requestNote ? (
              <span className="text-xs text-zinc-600 line-clamp-2 italic" title={item.requestNote}>
                "{item.requestNote}"
              </span>
            ) : (
              <span className="text-xs text-zinc-400">—</span>
            )}
            {item.responseNote && (
              <span className="text-[10px] text-zinc-500 block mt-0.5" title={item.responseNote}>
                Resp: "{item.responseNote}"
              </span>
            )}
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (_val, item: RescheduleRequestItem) => getStatusBadge(item.status),
      },
      {
        id: "actions",
        header: "Actions",
        cell: (_val, item: RescheduleRequestItem) => {
          const isPending = !item.status || item.status.toLowerCase() === "pending"
          return (
            <div className="flex items-center gap-2">
              {isPending ? (
                <button
                  type="button"
                  onClick={() => setSelectedRequestForResponse(item)}
                  className="h-8 px-3 rounded-lg bg-[#F59E0B] hover:bg-amber-500 text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="size-3.5" />
                  <span>Respond</span>
                </button>
              ) : (
                <Link
                  href={`/sessions/${item.sessionId}`}
                  className="h-8 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>View</span>
                  <ArrowRight className="size-3 text-zinc-400" />
                </Link>
              )}
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Session Reschedule Requests (طلبات إعادة الجدولة)"
        description="Review incoming reschedule requests from instructors and students, approve new time proposals, or reject changes."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="size-9 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center mb-3">
              <CalendarClock className="size-4" />
            </div>
            <span className="text-2xl font-bold text-zinc-900 block">
              {totalCount}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              Total Reschedule Requests
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="size-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Clock className="size-4" />
            </div>
            <span className="text-2xl font-bold text-amber-600 block">
              {pendingCount}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              Pending Administrative Review
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <CheckCircle2 className="size-4" />
            </div>
            <span className="text-2xl font-bold text-emerald-700 block">
              {approvedCount}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              Approved Reschedules
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="size-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
              <XCircle className="size-4" />
            </div>
            <span className="text-2xl font-bold text-rose-600 block">
              {rejectedCount}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              Rejected Requests
            </span>
          </div>
        </div>

        {/* Filter Bar & Tabs */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-zinc-100/80 p-1 rounded-xl">
            {(
              [
                { label: "All Requests", val: "all" },
                { label: "Pending", val: "Pending" },
                { label: "Approved", val: "Approved" },
                { label: "Rejected", val: "Rejected" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.val}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.val)
                  setPage(1)
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab.val
                    ? "bg-white text-zinc-900 shadow-2xs font-bold"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by session, teacher, or student..."
              className="w-full h-9 pl-9 pr-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Reschedule Requests UniTable */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-12">
            <LoadingSpinner title="Loading reschedule requests..." />
          </div>
        ) : isError ? (
          <GlobalError />
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Reschedule Requests Queue
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Showing {filteredRequests.length} of {totalCount} total reschedule records.
                </p>
              </div>
            </div>

            <UniTable<RescheduleRequestItem>
              data={filteredRequests}
              columns={columns}
              emptyMessage={
                <div className="p-12 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
                  <CalendarClock className="size-8 text-zinc-300 stroke-[1.5]" />
                  <span>No reschedule requests found for the selected filter.</span>
                </div>
              }
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="h-8 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="h-8 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Respond Modal */}
      <RespondRescheduleModal
        isOpen={Boolean(selectedRequestForResponse)}
        onClose={() => setSelectedRequestForResponse(null)}
        request={selectedRequestForResponse}
      />
    </div>
  )
}
