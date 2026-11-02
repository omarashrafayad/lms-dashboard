"use client"

import * as React from "react"
import {
  TrendingUp,
  CreditCard,
  Receipt,
  Smartphone,
  Building2,
  Users,
  Plus,
  ArrowRight,
  Clock,
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
  const totalSubscribers =
    plans.reduce((acc, p) => acc + (p.activeSubscribers ?? p.subscribersCount ?? 0), 0) ||
    subscribers.length ||
    1

  const expiringSubscribers = subscribers.filter(
    (s) => (s.daysRemaining ?? s.remainingDays ?? 30) <= 7 && s.status !== "Expired"
  )

  const paymentGateways = [
    { name: "Visa / Mastercard", share: 48, amount: "Card Gateway", color: "bg-blue-500", icon: CreditCard },
    { name: "InstaPay (IPN)", share: 32, amount: "Direct Bank", color: "bg-indigo-500", icon: Receipt },
    { name: "Vodafone Cash", share: 15, amount: "Mobile Wallet", color: "bg-rose-500", icon: Smartphone },
    { name: "Fawry & Cash", share: 5, amount: "Cash Point", color: "bg-amber-500", icon: Building2 },
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
                const count = plan.activeSubscribers ?? plan.subscribersCount ?? 0
                const percentage = Math.min(100, Math.round((count / totalSubscribers) * 100))
                const price = plan.monthlyPrice ?? plan.priceMonthly ?? 0
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
                        <span className="text-zinc-500 font-medium">
                          {count} students ({percentage}%)
                        </span>
                        <span className="font-bold text-zinc-900 min-w-[90px] text-right">
                          {(count * price).toLocaleString()} EGP / mo
                        </span>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-6 flex items-center justify-between text-xs text-zinc-500">
            <span>
              Total active students enrolled: <strong>{totalSubscribers}</strong>
            </span>
            <Button
              size="sm"
              onClick={onAddNewPlan}
              variant="outline"
              className="text-xs h-8 px-3 rounded-xl gap-1 text-zinc-700 cursor-pointer"
            >
              <Plus className="size-3" />
              <span>Create Tier</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Payment Gateway Volume Share */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <CreditCard className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Payment Channels</h3>
                  <p className="text-xs text-zinc-500">Gateway share & collection volume</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 mt-5">
              {paymentGateways.map((gw) => {
                const Icon = gw.icon
                return (
                  <div
                    key={gw.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/70 border border-zinc-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-700 shadow-2xs">
                        <Icon className="size-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-900">{gw.name}</span>
                        <span className="text-[11px] text-zinc-400">{gw.amount}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-zinc-800">{gw.share}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-6 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Live payment channels</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[11px]">
              Active & Healthy
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Recent Ledger Activity + Expiring Renewals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Ledger Entries */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Receipt className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Recent Transactions</h3>
                  <p className="text-xs text-zinc-500">Real-time payment settlements</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab("transactions")}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                Full Ledger &rarr;
              </Button>
            </div>

            <div className="flex flex-col divide-y divide-zinc-100 mt-2">
              {recentTransactions.slice(0, 5).map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-zinc-50 border border-zinc-200/80 flex items-center justify-center font-mono text-[10px] text-zinc-500">
                      {(t.invoiceNumber || t.reference || t.id).slice(0, 4)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900">
                        {t.studentName || t.payerName || "Student"}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {t.itemDescription || t.planName || "Subscription"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-zinc-900">{t.amount} EGP</span>
                    <span className="text-[11px] text-emerald-600 font-medium">
                      {t.status || "Paid"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expiring Soon Action List */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Clock className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Renewals Due in 7 Days</h3>
                  <p className="text-xs text-zinc-500">Students needing term re-enrollment</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab("subscribers")}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                View All &rarr;
              </Button>
            </div>

            <div className="flex flex-col divide-y divide-zinc-100 mt-2">
              {expiringSubscribers.slice(0, 5).map((sub) => {
                const days = sub.daysRemaining ?? sub.remainingDays ?? 3
                return (
                  <div key={sub.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-[11px]">
                        {(sub.studentName || "ST").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900">
                          {sub.studentName || "Student"}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {sub.planName} &bull; {sub.parentPhone || "No contact"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-rose-600">{days} days remaining</span>
                      <span className="text-[11px] text-zinc-400">{sub.amountCharged ?? 0} EGP</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Expiring cohort: <strong>{expiringSubscribers.length}</strong> students
            </span>
            <Button
              onClick={onAssignNew}
              className="bg-[#F59E0B] hover:bg-amber-500 text-white text-xs h-8 px-3 rounded-xl gap-1.5 shadow-2xs cursor-pointer"
            >
              <Users className="size-3.5" />
              <span>Enroll Student</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
