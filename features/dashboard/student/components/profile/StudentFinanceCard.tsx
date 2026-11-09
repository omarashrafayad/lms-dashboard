"use client"

import * as React from "react"
import { DollarSign, CreditCard, Calendar, ShieldCheck, ArrowUpRight } from "lucide-react"
import { StudentFinanceSummary } from "../../types/studentProfile.types"

export interface StudentFinanceCardProps {
  finance: StudentFinanceSummary
  onViewFinanceTab?: () => void
}

export function StudentFinanceCard({
  finance,
  onViewFinanceTab,
}: StudentFinanceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center">
            <DollarSign className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Finance & Billing Overview
            </h3>
            <span className="text-[11px] text-zinc-400">
              Active plan and payment summary
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
        {/* Total Spent */}
        <div className="flex flex-col gap-1 pr-4 pb-4 sm:pb-0">
          <span className="text-xs text-zinc-500 font-medium">Total Paid</span>
          <span className="text-xl font-bold text-zinc-900">
            ${finance.totalSpent.toLocaleString()}
          </span>
          <span className="text-[11px] text-zinc-400">Lifetime platform payments</span>
        </div>

        {/* Current Plan */}
        <div className="flex flex-col gap-1 px-0 sm:px-4 py-4 sm:py-0">
          <span className="text-xs text-zinc-500 font-medium">Active Plan</span>
          <span className="text-base font-bold text-zinc-900 truncate">
            {finance.currentPlanName}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">
            ${finance.currentPlanCost} / {finance.billingCycle}
          </span>
        </div>

        {/* Next Billing Date */}
        <div className="flex flex-col gap-1 px-0 sm:px-4 py-4 sm:py-0">
          <span className="text-xs text-zinc-500 font-medium">Next Renewal</span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
            <Calendar className="size-3.5 text-zinc-400" />
            <span>{finance.nextBillingDate}</span>
          </div>
          <span className="text-[11px] text-zinc-400">Auto-renew enabled</span>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-1 pl-0 sm:pl-4 pt-4 sm:pt-0">
          <span className="text-xs text-zinc-500 font-medium">Payment Method</span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
            <CreditCard className="size-3.5 text-zinc-400" />
            <span>{finance.paymentMethod}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600">
            <ShieldCheck className="size-3" />
            <span>Verified method</span>
          </div>
        </div>
      </div>
    </div>
  )
}

