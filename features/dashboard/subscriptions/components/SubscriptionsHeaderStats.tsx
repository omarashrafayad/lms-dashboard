"use client"

import * as React from "react"
import {
  TrendingUp,
  Users,
  CreditCard,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
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
            {stats?.mrrGrowth || "+14.6%"}
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {stats?.mrrFormatted || "351,400 EGP"}
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
            {stats?.activeSubscribersGrowth || "+38 this mo"}
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {stats?.activeSubscribers ?? 412}
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs text-zinc-500 font-medium">Active Paid Students</span>
            <span className="text-[11px] text-zinc-400 font-normal">
              {stats?.expiringIn7Days ?? 14} expiring soon
            </span>
          </div>
        </div>
      </div>

      {/* 3. Transaction Success Rate / Total Revenue */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-2xs">
            <CreditCard className="size-5 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <ShieldCheck className="size-3" />
            {stats?.successRate || "98.2%"} Success
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {stats?.totalRevenueFormatted || "2,845,000 EGP"}
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs text-zinc-500 font-medium">Total Processed Volume</span>
            <span className="text-[11px] text-zinc-400 font-normal">All Time</span>
          </div>
        </div>
      </div>

      {/* 4. Pending Payment Approvals (Vodafone / InstaPay) */}
      <div
        onClick={() => onSelectTab && onSelectTab("requests")}
        className="bg-white rounded-2xl border border-amber-200/80 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all relative overflow-hidden cursor-pointer group hover:border-amber-400/80"
      >
        <div className="flex items-center justify-between">
          <div className="size-10 rounded-xl bg-[#FFF9F2] border border-[#FFB543]/40 flex items-center justify-center text-[#D97706] shadow-2xs">
            <Clock className="size-5 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 animate-pulse">
            <AlertTriangle className="size-3" />
            Requires Action
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {stats?.pendingRequestsCount ?? 3}
            </span>
            <span className="text-xs font-semibold text-[#D97706]">Awaiting Review</span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs text-zinc-500 font-medium">Vodafone Cash / InstaPay</span>
            <span className="text-[11px] text-[#D97706] font-semibold group-hover:underline">
              Verify Now &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
