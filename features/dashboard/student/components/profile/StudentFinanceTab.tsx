"use client"

import * as React from "react"
import { DollarSign, CreditCard, Calendar, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react"
import { StudentFinanceSummary, StudentProfile } from "../../types/studentProfile.types"

export interface StudentFinanceTabProps {
  finance: StudentFinanceSummary
  subscription: StudentProfile["subscription"]
  onViewTransactions?: () => void
  onViewPaymentRequests?: () => void
}

export function StudentFinanceTab({
  finance,
  subscription,
  onViewTransactions,
  onViewPaymentRequests,
}: StudentFinanceTabProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <DollarSign className="size-4" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 block">
            ${finance.totalSpent.toLocaleString()}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Total Lifetime Paid</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center mb-3">
            <CreditCard className="size-4" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 block">
            ${finance.currentPlanCost}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Current Plan Fee ({finance.billingCycle})</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <Calendar className="size-4" />
          </div>
          <span className="text-lg font-bold text-zinc-900 block truncate">
            {finance.nextBillingDate}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Next Renewal Date</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <ShieldCheck className="size-4" />
          </div>
          <span className="text-lg font-bold text-zinc-900 block truncate">
            {finance.paymentMethod}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Default Payment Method</span>
        </div>
      </div>

      {/* Subscription Breakdown & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900">
              Subscription Billing Details
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                subscription.status === "Active"
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                  : "text-zinc-500 bg-zinc-50 border-zinc-200"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  subscription.status === "Active" ? "bg-emerald-500" : "bg-zinc-400"
                }`}
              />
              {subscription.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
              <span className="text-zinc-500">Subscribed Plan</span>
              <span className="font-bold text-zinc-900 text-sm">{subscription.plan}</span>
            </div>

            <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
              <span className="text-zinc-500">Plan Rate</span>
              <span className="font-bold text-zinc-900 text-sm">
                ${finance.currentPlanCost} / {finance.billingCycle}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
              <span className="text-zinc-500">Membership Start Date</span>
              <span className="font-semibold text-zinc-800">{subscription.startDate}</span>
            </div>

            <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
              <span className="text-zinc-500">Current Period Expiry</span>
              <span className="font-semibold text-zinc-800">{subscription.expiryDate}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions / Links */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-zinc-900">
              Financial Actions
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Review completed invoices, billing receipts, and student payment requests.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {onViewTransactions && (
              <button
                type="button"
                onClick={onViewTransactions}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
              >
                <span>View All Transactions</span>
                <ArrowRight className="size-4 text-zinc-400" />
              </button>
            )}

            {onViewPaymentRequests && (
              <button
                type="button"
                onClick={onViewPaymentRequests}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
              >
                <span>View Payment Requests</span>
                <ArrowRight className="size-4 text-zinc-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

