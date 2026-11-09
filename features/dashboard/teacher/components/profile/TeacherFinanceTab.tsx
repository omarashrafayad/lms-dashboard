"use client"

import * as React from "react"
import { DollarSign, Wallet, Calendar, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"
import { TeacherFinanceSummary } from "../../types/teacherProfile.types"

export interface TeacherFinanceTabProps {
  finance: TeacherFinanceSummary
  onViewTransactions?: () => void
  onViewPaymentRequests?: () => void
}

export function TeacherFinanceTab({
  finance,
  onViewTransactions,
  onViewPaymentRequests,
}: TeacherFinanceTabProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <DollarSign className="size-4" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 block">
            ${finance.totalEarnings.toLocaleString()}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Total Lifetime Earnings</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center mb-3">
            <Clock className="size-4" />
          </div>
          <span className="text-2xl font-bold text-amber-600 block">
            ${finance.pendingPayout.toLocaleString()}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Pending Payout Amount</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <DollarSign className="size-4" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 block">
            ${finance.hourlyRate}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Hourly Base Rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <Wallet className="size-4" />
          </div>
          <span className="text-lg font-bold text-zinc-900 block truncate">
            {finance.payoutMethod}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Primary Payout Method</span>
        </div>
      </div>

      {/* Payout Information and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900">
              Compensation & Payout Settings
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border text-emerald-700 bg-emerald-50 border-emerald-200/60">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Eligible for Payout
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
              <span className="text-zinc-500">Total Billed Teaching Hours</span>
              <span className="font-bold text-zinc-900 text-sm">
                {finance.totalBilledHours} hours
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
              <span className="text-zinc-500">Completed Payouts to Date</span>
              <span className="font-bold text-zinc-900 text-sm">
                ${finance.completedPayouts.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
              <span className="text-zinc-500">Next Scheduled Payout</span>
              <span className="font-semibold text-zinc-800">{finance.nextPayoutDate}</span>
            </div>

            <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
              <span className="text-zinc-500">Payout Cycle</span>
              <span className="font-semibold text-zinc-800">Bi-Weekly (1st & 15th)</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-zinc-900">
              Payout Requests & History
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Track payout disbursement requests, transfer confirmations, and earnings history.
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
    </div>
  )
}

