"use client"

import * as React from "react"
import {
  Clock,
  CheckCircle2,
  XCircle,
  Smartphone,
  Receipt,
  Building2,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
} from "lucide-react"
import { PaymentRequestItem, PaymentRequestStatus } from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PaymentRequestsViewProps {
  requests: PaymentRequestItem[]
  isLoading?: boolean
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function PaymentRequestsView({
  requests,
  isLoading,
  onApprove,
  onReject,
}: PaymentRequestsViewProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredRequests = React.useMemo(() => {
    return requests.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase()
        const matches =
          r.requestCode.toLowerCase().includes(q) ||
          r.senderName.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q) ||
          r.transferReference.toLowerCase().includes(q) ||
          r.senderPhone.includes(q)
        if (!matches) return false
      }

      if (statusFilter !== "all" && r.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [requests, search, statusFilter])

  const pendingCount = requests.filter((r) => r.status === "Pending").length

  return (
    <div className="flex flex-col gap-5">
      {/* Informative Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#FFB543]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Smartphone className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900">
              Offline Wallet & InstaPay Transfer Verification
            </h4>
            <p className="text-[11px] text-zinc-600">
              Review submitted merchant wallet transfers (Vodafone Cash, InstaPay, Bank Wire).
              Approving an item immediately enrolls the student and creates a verified transaction.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F59E0B] text-white shadow-2xs">
            {pendingCount} Pending Verification
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative min-w-[260px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search sender, phone, student, or ref code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9.5 rounded-xl text-xs bg-zinc-50/50 border-zinc-200 focus-visible:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9.5 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-700 font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <span className="text-xs text-zinc-500 font-medium">
          Showing <strong>{filteredRequests.length}</strong> payment submissions
        </span>
      </div>

      {/* Requests Cards Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="col-span-2 py-14 text-center bg-white rounded-2xl border border-zinc-200/80 text-xs text-zinc-400">
            No transfer verification requests found.
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isPending = req.status === "Pending"
            const isApproved = req.status === "Approved"

            return (
              <div
                key={req.id}
                className={cn(
                  "bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-2xs transition-all",
                  isPending
                    ? "border-amber-300 ring-1 ring-amber-200/60"
                    : "border-zinc-200/80"
                )}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 font-mono">
                        {req.requestCode}
                      </span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-[11px] text-zinc-500">{req.dateSubmitted}</span>
                    </div>

                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                        isPending
                          ? "text-amber-700 bg-amber-50 border-amber-200"
                          : isApproved
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-rose-700 bg-rose-50 border-rose-200"
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          isPending
                            ? "bg-amber-500 animate-pulse"
                            : isApproved
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        )}
                      />
                      {req.status}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                        Sender / Payer:
                      </span>
                      <div className="font-bold text-zinc-900 mt-0.5">{req.senderName}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">{req.senderPhone}</div>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                        Student & Grade:
                      </span>
                      <div className="font-bold text-zinc-900 mt-0.5">{req.studentName}</div>
                      <div className="text-[11px] text-zinc-500">{req.studentGrade}</div>
                    </div>
                  </div>

                  {/* Transfer Method and Reference */}
                  <div className="mt-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
                        {req.method === "Vodafone Cash" && (
                          <Smartphone className="size-3.5 text-rose-600" />
                        )}
                        {req.method === "InstaPay" && (
                          <Receipt className="size-3.5 text-indigo-600" />
                        )}
                        {req.method === "Bank Transfer" && (
                          <Building2 className="size-3.5 text-emerald-600" />
                        )}
                        <span>{req.method}</span>
                      </div>
                      <span className="font-extrabold text-sm text-zinc-900">
                        {req.amount.toLocaleString()} {req.currency}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-600 font-mono bg-white p-1.5 rounded-lg border border-zinc-200/70">
                      Ref / Txn #: <strong>{req.transferReference}</strong>
                    </div>

                    {req.receiptNote && (
                      <div className="text-[11px] text-zinc-500 italic mt-0.5">
                        "{req.receiptNote}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                  {isPending ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onReject(req.id)}
                        className="rounded-xl h-8.5 px-3 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer"
                      >
                        <XCircle className="size-3.5" />
                        <span>Reject</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => onApprove(req.id)}
                        className="rounded-xl h-8.5 px-4 text-xs font-semibold bg-[#16A34A] hover:bg-green-700 text-white gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>Approve & Activate Plan</span>
                      </Button>
                    </>
                  ) : (
                    <div className="text-[11px] text-zinc-400">
                      Reviewed by {req.reviewedBy || "Administrator"}{" "}
                      {req.reviewedAt && `• ${req.reviewedAt}`}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
