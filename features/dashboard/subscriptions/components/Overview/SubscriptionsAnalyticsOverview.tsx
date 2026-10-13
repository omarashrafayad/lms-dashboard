"use client"

import * as React from "react"
import {
  PieChart,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Smartphone,
  Receipt,
  Building2,
  Users,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react"
import {
  SubscriptionPlan,
  TransactionItem,
  SubscriberItem,
  SubscriptionsFinancialStats,
} from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"

interface SubscriptionsAnalyticsOverviewProps {
  stats?: SubscriptionsFinancialStats
  plans: SubscriptionPlan[]
  recentTransactions: TransactionItem[]
  subscribers: SubscriberItem[]
  onSelectTab: (tab: any) => void
  onAssignNew: () => void
  onAddNewPlan: () => void
}

export function SubscriptionsAnalyticsOverview({
  stats,
  plans,
  recentTransactions,
  subscribers,
  onSelectTab,
  onAssignNew,
  onAddNewPlan,
}: SubscriptionsAnalyticsOverviewProps) {
  const totalSubscribers = plans.reduce((acc, p) => acc + p.subscribersCount, 0) || 412
  const expiringSubscribers = subscribers.filter(
    (s) => s.remainingDays <= 7 && s.status !== "Expired"
  )

  const paymentGateways = [
    { name: "Visa / Mastercard", share: 48, amount: "1,365,600 EGP", color: "bg-blue-500", icon: CreditCard },
    { name: "InstaPay (IPN)", share: 32, amount: "910,400 EGP", color: "bg-indigo-500", icon: Receipt },
    { name: "Vodafone Cash", share: 15, amount: "426,750 EGP", color: "bg-rose-500", icon: Smartphone },
    { name: "Fawry & Cash", share: 5, amount: "142,250 EGP", color: "bg-amber-500", icon: Building2 },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* 2-Column High Level Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Plan Distribution & Revenue breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center font-bold">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Plan Enrollment & Recurring Breakdown
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Distribution of active student subscriptions across pricing tiers
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab("plans")}
                className="text-xs font-semibold text-[#D97706] hover:text-amber-700 cursor-pointer"
              >
                Manage Plans &rarr;
              </Button>
            </div>

            {/* Plan progress bars */}
            <div className="flex flex-col gap-4 mt-5">
              {plans.map((plan) => {
                const percentage = Math.round((plan.subscribersCount / totalSubscribers) * 100) || 10
                return (
                  <div key={plan.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-800">{plan.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-100 text-zinc-600 font-medium">
                          {plan.tier}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500">{plan.subscribersCount} students</span>
                        <strong className="text-zinc-900 font-bold">{plan.totalRevenueFormatted}</strong>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden flex">
                      <div
                        className="h-full rounded-full bg-[#F59E0B] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-6 flex items-center justify-between text-xs text-zinc-500">
            <span>Average Revenue Per Student: <strong>853 EGP / mo</strong></span>
            <span>Annual Retention Rate: <strong>94.2%</strong></span>
          </div>
        </div>

        {/* Right Column: Payment Gateway Share */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <CreditCard className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Payment Gateway Split
                  </h3>
                  <p className="text-xs text-zinc-500">Volume processed per gateway</p>
                </div>
              </div>
            </div>

            {/* Gateway list */}
            <div className="flex flex-col gap-3.5 mt-5">
              {paymentGateways.map((g) => {
                const Icon = g.icon
                return (
                  <div
                    key={g.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`size-7 rounded-lg ${g.color} text-white flex items-center justify-center`}>
                        <Icon className="size-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900">{g.name}</span>
                        <span className="text-[10px] text-zinc-400">{g.amount}</span>
                      </div>
                    </div>

                    <span className="font-extrabold text-zinc-800 text-xs">
                      {g.share}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Overall Success Rate</span>
            <span className="font-bold text-emerald-600">98.2% Seamless</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Recent Transactions & Expiring Subscriptions Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Transactions (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">
                Recent Payment Ledger
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab("transactions")}
                className="text-xs font-semibold text-[#D97706] hover:text-amber-700 cursor-pointer"
              >
                View All Ledger &rarr;
              </Button>
            </div>

            <div className="flex flex-col divide-y divide-zinc-100 mt-2">
              {recentTransactions.slice(0, 5).map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center font-mono font-bold text-[10px]">
                      TXN
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900">{t.payerName}</span>
                      <span className="text-[11px] text-zinc-400">
                        {t.planOrItem} • {t.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-zinc-900">
                        {t.amount.toLocaleString()} {t.currency}
                      </div>
                      <div className="text-[10px] text-zinc-400">{t.date}</div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Urgent Renewals Attention Box */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-amber-600" />
                <h3 className="text-sm font-bold text-zinc-900">
                  Expiring Within 7 Days
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {expiringSubscribers.length} Students
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {expiringSubscribers.slice(0, 4).map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/60 flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-900">{sub.studentName}</span>
                    <span className="text-[11px] text-zinc-500">
                      {sub.planName} • Parent: {sub.parentPhone}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-amber-800">
                    {sub.remainingDays}d left
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-5">
            <Button
              onClick={() => onSelectTab("subscribers")}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl h-9 text-xs cursor-pointer shadow-2xs"
            >
              Review All Expiring Accounts
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
