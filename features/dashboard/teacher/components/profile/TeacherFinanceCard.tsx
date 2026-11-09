"use client"

import * as React from "react"
import { DollarSign, Wallet, Clock, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { TeacherFinanceSummary } from "../../types/teacherProfile.types"

export interface TeacherFinanceCardProps {
  finance: TeacherFinanceSummary
  onViewFinanceTab?: () => void
}

export function TeacherFinanceCard({
  finance,
  onViewFinanceTab,
}: TeacherFinanceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center">
            <DollarSign className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Earnings & Payout Overview
            </h3>
            <span className="text-[11px] text-zinc-400">
              Teacher compensation and payment schedule
            </span>
          </div>
        </div>

        {onViewFinanceTab && (
          <button
            type="button"
            onClick={onViewFinanceTab}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-amber-700 transition-colors cursor-pointer"
          >
            <span>Details</span>
            <ArrowUpRight className="size-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 p-6">
        {/* Total Earnings */}
        <div className="flex flex-col gap-1 pr-4 pb-4 sm:pb-0">
          <span className="text-xs text-zinc-500 font-medium">Total Lifetime Earnings</span>
          <span className="text-xl font-bold text-zinc-900">
            ${finance.totalEarnings.toLocaleString()}
          </span>
          <span className="text-[11px] text-zinc-400">Paid & processed to date</span>
        </div>

        {/* Pending Payout */}
        <div className="flex flex-col gap-1 px-0 sm:px-4 py-4 sm:py-0">
          <span className="text-xs text-zinc-500 font-medium">Pending Payout</span>
          <span className="text-xl font-bold text-amber-600">
            ${finance.pendingPayout.toLocaleString()}
          </span>
          <span className="text-[11px] text-zinc-400">Scheduled for {finance.nextPayoutDate}</span>
        </div>

        {/* Hourly Rate & Hours */}
        <div className="flex flex-col gap-1 px-0 sm:px-4 py-4 sm:py-0">
          <span className="text-xs text-zinc-500 font-medium">Teaching Rate</span>
          <div className="flex items-center gap-1.5 text-base font-bold text-zinc-900">
            <span>${finance.hourlyRate}/hr</span>
          </div>
          <span className="text-[11px] text-zinc-400">
            {finance.totalBilledHours} hours completed
          </span>
        </div>

        {/* Payout Method */}
        <div className="flex flex-col gap-1 pl-0 sm:pl-4 pt-4 sm:pt-0">
          <span className="text-xs text-zinc-500 font-medium">Payout Method</span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
            <Wallet className="size-3.5 text-zinc-400" />
            <span className="truncate">{finance.payoutMethod}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600">
            <CheckCircle2 className="size-3" />
            <span>Active & verified</span>
          </div>
        </div>
      </div>
    </div>
  )
}

