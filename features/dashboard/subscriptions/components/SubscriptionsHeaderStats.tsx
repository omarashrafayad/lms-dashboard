"use client"

import * as React from "react"
import {
  TrendingUp,
  Users,
  CreditCard,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react"
import { SubscriptionsFinancialStats } from "../types/subscriptions.types"
import { SubscriptionsTabKey } from "./SubscriptionsNavTabs"

interface SubscriptionsHeaderStatsProps {
  stats?: SubscriptionsFinancialStats
  onSelectTab?: (tab: SubscriptionsTabKey) => void
}

export function SubscriptionsHeaderStats({
  stats,
  onSelectTab,
}: SubscriptionsHeaderStatsProps) {
  const mrr = stats?.monthlyRecurringRevenue ?? stats?.mrr ?? 0
  const activeSubs = stats?.activePaidStudents ?? stats?.activeSubscribers ?? 0
  const expiring = stats?.expiringSoonStudents ?? stats?.expiringIn7Days ?? 0
  const volume = stats?.totalProcessedVolume ?? stats?.totalRevenue ?? 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
      {/* 1. Monthly Recurring Revenue (MRR) */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div className="size-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#D97706] shadow-2xs">
            <TrendingUp className="size-5 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            <ArrowUpRight className="size-3" />
            {stats?.monthlyRecurringRevenueChangePercent
              ? `+${stats.monthlyRecurringRevenueChangePercent}%`
              : stats?.mrrGrowth || "+12.5%"}
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {mrr.toLocaleString()} EGP
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs text-zinc-500 font-medium">Monthly Recurring Revenue</span>
            <span className="text-[11px] text-zinc-400 font-normal">MRR</span>
          </div>
        </div>
      </div>

      {/* 2. Active Subscribers */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div className="size-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-2xs">
            <Users className="size-5 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
            {stats?.newSubscriptionsThisMonth
              ? `+${stats.newSubscriptionsThisMonth} this mo`
              : "+Active"}
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {activeSubs}
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs text-zinc-500 font-medium">Active Enrolled Students</span>
            <span className="text-[11px] text-zinc-400 font-normal">Learners</span>
          </div>
        </div>
      </div>

      {/* 3. Expiring Soon */}
      <div
        onClick={() => onSelectTab?.("subscribers")}
        className="bg-white rounded-2xl border border-zinc-200/80 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="size-10 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 shadow-2xs">
            <Clock className="size-5 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
            Action Needed
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {expiring}
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs text-zinc-500 font-medium">Expiring Within 7 Days</span>
            <span className="text-[11px] text-zinc-400 font-normal">Renewal</span>
          </div>
        </div>
      </div>

      {/* 4. Total Processed Volume */}
      <div
        onClick={() => onSelectTab?.("transactions")}
        className="bg-white rounded-2xl border border-zinc-200/80 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-2xs">
            <CreditCard className="size-5 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <ShieldCheck className="size-3" />
            {stats?.paymentSuccessRatePercent
              ? `${stats.paymentSuccessRatePercent}% success`
              : "Live"}
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {volume.toLocaleString()} EGP
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs text-zinc-500 font-medium">Total Processed Volume</span>
            <span className="text-[11px] text-zinc-400 font-normal">Ledger</span>
          </div>
        </div>
      </div>
    </div>
  )
}
