"use client"

import * as React from "react"
import {
  DollarSign,
  CreditCard,
  Calendar,
  ShieldCheck,
  RotateCcw,
  Clock,
  ArrowRight,
  FileText,
  BadgePercent,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import {
  StudentFinanceSummary,
  StudentProfile,
  BillingPaymentItem,
  BillingSubscriptionItem,
  BillingStudentRefundItem,
} from "../../types/studentProfile.types"
import { useStudentFinance } from "../../hooks/useStudents"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

export interface StudentFinanceTabProps {
  studentId?: string
  finance?: StudentFinanceSummary
  subscription?: StudentProfile["subscription"]
  onViewTransactions?: () => void
  onViewPaymentRequests?: () => void
}

type FinanceSubTab = "payments" | "subscriptions" | "refunds" | "bookings"

export function StudentFinanceTab({
  studentId,
  finance,
  subscription,
  onViewTransactions,
  onViewPaymentRequests,
}: StudentFinanceTabProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<FinanceSubTab>("payments")

  const {
    data: financeData,
    isLoading,
    isError,
  } = useStudentFinance(studentId || "")

  const totals = financeData?.totals
  const payments = financeData?.payments || []
  const subscriptions = financeData?.subscriptions || []
  const refunds = financeData?.refunds || []
  const bookings = financeData?.bookings

  const netPaid = totals?.netPaidAmount ?? finance?.totalSpent ?? 0
  const collected = totals?.collectedAmount ?? 0
  const discounts = totals?.discountAmount ?? 0
  const awaitingReview = totals?.awaitingReviewAmount ?? 0
  const awaitingReviewCount = totals?.awaitingReviewCount ?? 0
  const refundedAmount = totals?.refundedAmount ?? 0
  const refundedCount = totals?.refundedCount ?? 0

  if (isLoading) {
    return (
      <div className="py-12 bg-white rounded-2xl border border-zinc-200/80">
        <LoadingSpinner title="Loading student finance profile..." />
      </div>
    )
  }

  if (isError) {
    return <GlobalError />
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 5 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5">
            <DollarSign className="size-4" />
          </div>
          <span className="text-xl font-bold text-zinc-900 block">
            ${Number(netPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5 block">Net Paid (صافي المدفوع)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2.5">
            <CreditCard className="size-4" />
          </div>
          <span className="text-xl font-bold text-zinc-900 block">
            ${Number(collected).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5 block">
            Collected ({totals?.paymentsCount ?? payments.length} payments)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5">
            <BadgePercent className="size-4" />
          </div>
          <span className="text-xl font-bold text-purple-700 block">
            ${Number(discounts).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5 block">Total Discounts (الخصومات)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-8 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center mb-2.5">
            <Clock className="size-4" />
          </div>
          <span className="text-xl font-bold text-amber-600 block">
            ${Number(awaitingReview).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5 block">
            Under Review ({awaitingReviewCount})
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-2.5">
            <RotateCcw className="size-4" />
          </div>
          <span className="text-xl font-bold text-rose-600 block">
            ${Number(refundedAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5 block">
            Refunded ({refundedCount})
          </span>
        </div>
      </div>

      {/* Bookings & Session Summary Card if available */}
      {bookings && (
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-2xs flex flex-col gap-3">
          <h4 className="text-xs font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <Calendar className="size-4 text-amber-500" />
            <span>Session Bookings & Attendance Summary</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex flex-col">
              <span className="text-[10px] text-zinc-400 font-medium">Total Booked</span>
              <span className="text-sm font-bold text-zinc-900">{bookings.bookedCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col">
              <span className="text-[10px] text-blue-600 font-medium">Upcoming</span>
              <span className="text-sm font-bold text-blue-700">{bookings.upcomingCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col">
              <span className="text-[10px] text-emerald-600 font-medium">Attended</span>
              <span className="text-sm font-bold text-emerald-700">{bookings.attendedCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex flex-col">
              <span className="text-[10px] text-amber-600 font-medium">No-Show</span>
              <span className="text-sm font-bold text-amber-700">{bookings.noShowCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex flex-col">
              <span className="text-[10px] text-rose-600 font-medium">Cancelled</span>
              <span className="text-sm font-bold text-rose-700">{bookings.cancelledCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex flex-col">
              <span className="text-[10px] text-purple-600 font-medium">Attended Mins</span>
              <span className="text-sm font-bold text-purple-700">{bookings.attendedMinutes}m</span>
            </div>
          </div>
        </div>
      )}

      {/* Financial Details Container with Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        {/* Sub-Tab Navigation Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab("payments")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "payments"
                  ? "bg-amber-500 text-white shadow-2xs"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              Payments ({payments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("subscriptions")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "subscriptions"
                  ? "bg-amber-500 text-white shadow-2xs"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              Subscriptions ({subscriptions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("refunds")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "refunds"
                  ? "bg-amber-500 text-white shadow-2xs"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              Refunds ({refunds.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onViewTransactions && (
              <button
                type="button"
                onClick={onViewTransactions}
                className="text-xs font-medium text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>All Transactions</span>
                <ArrowRight className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tab Content: Payments */}
        {activeSubTab === "payments" && (
          <div className="overflow-x-auto">
            {payments.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-400">
                No payment transactions recorded for this student.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Invoice #</th>
                    <th className="py-3 px-4">Item / Plan</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3 px-5 font-mono font-medium text-zinc-900">
                        {p.invoiceNumber || p.reference || p.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-zinc-900 block">
                          {p.planName || p.itemDescription || "General Payment"}
                        </span>
                        {p.itemKind && (
                          <span className="text-[10px] text-zinc-400">{p.itemKind}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-zinc-900">
                        ${Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-zinc-500">
                        {p.discountAmount > 0 ? (
                          <span className="text-amber-600 font-semibold">
                            -${p.discountAmount}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4 text-zinc-600">
                        {p.methodDisplay || p.method || "Direct"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.status === "Paid" || p.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : p.status === "AwaitingReview" || p.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                              : "bg-rose-50 text-rose-700 border border-rose-200/60"
                          }`}
                        >
                          {p.status || "Completed"}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-zinc-500 whitespace-nowrap">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Sub-Tab Content: Subscriptions */}
        {activeSubTab === "subscriptions" && (
          <div className="overflow-x-auto">
            {subscriptions.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-400">
                No active or historical subscriptions found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Plan</th>
                    <th className="py-3 px-4">Tier / Cycle</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Starts At</th>
                    <th className="py-3 px-4">Expires At</th>
                    <th className="py-3 px-5">Days Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {subscriptions.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3 px-5 font-bold text-zinc-900">
                        {s.planName || "Standard Plan"}
                      </td>
                      <td className="py-3 px-4 text-zinc-600">
                        {s.tier || "Standard"} · {s.billingCycle || "Monthly"}
                      </td>
                      <td className="py-3 px-4 font-bold text-zinc-900">
                        ${Number(s.amountCharged).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            s.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                          }`}
                        >
                          {s.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                        {s.startsAt ? new Date(s.startsAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                        {s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 px-5 font-semibold text-zinc-800">
                        {s.daysRemaining !== undefined ? `${s.daysRemaining} days` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Sub-Tab Content: Refunds */}
        {activeSubTab === "refunds" && (
          <div className="overflow-x-auto">
            {refunds.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-400">
                No refund requests or processed refunds found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Invoice #</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Refunded At</th>
                    <th className="py-3 px-4">Reviewed By</th>
                    <th className="py-3 px-5">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {refunds.map((r, idx) => (
                    <tr key={r.paymentId || idx} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3 px-5 font-mono font-medium text-zinc-900">
                        {r.invoiceNumber || r.paymentId?.slice(0, 8) || "—"}
                      </td>
                      <td className="py-3 px-4 font-bold text-rose-600">
                        -${Number(r.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-zinc-600">
                        {r.methodDisplay || r.method || "Original Method"}
                      </td>
                      <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                        {r.refundedAt ? new Date(r.refundedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 px-4 text-zinc-700">
                        {r.reviewedBy || "Admin"}
                      </td>
                      <td className="py-3 px-5 text-zinc-500 italic max-w-xs truncate">
                        {r.note || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
