"use client"

import * as React from "react"
import {
  DollarSign,
  Wallet,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Percent,
  CheckCircle2,
  FileText,
} from "lucide-react"
import { TeacherFinanceSummary } from "../../types/teacherProfile.types"
import { useTeacherDues } from "../../hooks/useTeachers"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

export interface TeacherFinanceTabProps {
  teacherId?: string
  finance?: TeacherFinanceSummary
  onViewTransactions?: () => void
  onViewPaymentRequests?: () => void
}

export function TeacherFinanceTab({
  teacherId,
  finance,
  onViewTransactions,
  onViewPaymentRequests,
}: TeacherFinanceTabProps) {
  const [fromDate, setFromDate] = React.useState("")
  const [toDate, setToDate] = React.useState("")

  const {
    data: duesReport,
    isLoading,
    isError,
  } = useTeacherDues(teacherId || "", {
    from: fromDate ? new Date(fromDate).toISOString() : undefined,
    to: toDate ? new Date(toDate).toISOString() : undefined,
  })

  // Extract primary teacher dues item or totals
  const teacherDuesItem = duesReport?.items?.[0]
  const totals = duesReport?.totals

  const netAmount = teacherDuesItem?.netAmount ?? totals?.netAmount ?? finance?.totalEarnings ?? 0
  const grossAmount = teacherDuesItem?.grossAmount ?? totals?.grossAmount ?? 0
  const commissionAmount = teacherDuesItem?.commissionAmount ?? totals?.commissionAmount ?? 0
  const deliveredHours = teacherDuesItem?.deliveredHours ?? (totals?.deliveredMinutes ? (totals.deliveredMinutes / 60).toFixed(1) : 0)
  const deliveredSessions = teacherDuesItem?.deliveredSessions ?? totals?.deliveredSessions ?? 0
  const costPerHour = teacherDuesItem?.costPerHour ?? finance?.hourlyRate ?? 0
  const commissionPercentage = teacherDuesItem?.applicationPercentage ?? 0

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Date Range Filter Header */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
            <DollarSign className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Teacher Financial Statement & Dues 
            </h3>
            <p className="text-xs text-zinc-500">
              Live dues calculated from completed lessons and platform commission rules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 px-3 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 px-3 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={() => {
                setFromDate("")
                setToDate("")
              }}
              className="h-9 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-12">
          <LoadingSpinner title="Loading teacher dues..." />
        </div>
      ) : isError ? (
        <GlobalError />
      ) : (
        <>
          {/* 4 Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
              <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <DollarSign className="size-4" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 block">
                ${Number(netAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-zinc-500 mt-1 block">Net Teacher Dues (المستحقات الصافية)</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
              <div className="size-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <DollarSign className="size-4" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 block">
                ${Number(grossAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-zinc-500 mt-1 block">Gross Earnings (إجمالي الأرباح)</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
              <div className="size-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center mb-3">
                <Percent className="size-4" />
              </div>
              <span className="text-2xl font-bold text-amber-600 block">
                ${Number(commissionAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-zinc-500 mt-1 block">
                Platform Commission ({commissionPercentage}%)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
              <div className="size-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <Clock className="size-4" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 block">
                {deliveredHours} hrs
              </span>
              <span className="text-xs text-zinc-500 mt-1 block">
                Delivered Teaching Hours ({deliveredSessions} sessions)
              </span>
            </div>
          </div>

          {/* Dues Breakdown and Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="text-sm font-bold text-zinc-900">
                  Rate & Commission Breakdown
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border text-emerald-700 bg-emerald-50 border-emerald-200/60">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Active Settlement
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
                  <span className="text-zinc-500">Teacher Hourly Base Rate</span>
                  <span className="font-bold text-zinc-900 text-sm">
                    ${costPerHour} / hour
                  </span>
                </div>

                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
                  <span className="text-zinc-500">Platform Commission Rate</span>
                  <span className="font-bold text-zinc-900 text-sm">
                    {commissionPercentage}% {teacherDuesItem?.applicationPercentageSource ? `(${teacherDuesItem.applicationPercentageSource})` : ""}
                  </span>
                </div>

                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
                  <span className="text-zinc-500">Completed Sessions</span>
                  <span className="font-bold text-zinc-900 text-sm">
                    {deliveredSessions} completed
                  </span>
                </div>

                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
                  <span className="text-zinc-500">Total Billed Teaching Minutes</span>
                  <span className="font-bold text-zinc-900 text-sm">
                    {teacherDuesItem?.deliveredMinutes ?? totals?.deliveredMinutes ?? 0} mins
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-zinc-900">
                  Payout Navigation
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Review transaction logs, pending disbursement requests, or settlement details.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {onViewTransactions && (
                  <button
                    type="button"
                    onClick={onViewTransactions}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                  >
                    <span>View Payout Transactions</span>
                    <ArrowRight className="size-4 text-zinc-400" />
                  </button>
                )}

                {onViewPaymentRequests && (
                  <button
                    type="button"
                    onClick={onViewPaymentRequests}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                  >
                    <span>View Payout Requests</span>
                    <ArrowRight className="size-4 text-zinc-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
