"use client"

import * as React from "react"
import { LayoutGrid, Layers, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

export type SubscriptionsTabKey =
  | "overview"
  | "plans"
  | "subscribers"
  | "transactions"
  | "requests"

interface SubscriptionsNavTabsProps {
  activeTab: SubscriptionsTabKey
  onTabChange: (tab: SubscriptionsTabKey) => void
  subscribersCount?: number
  plansCount?: number
  requestsCount?: number
}

export function SubscriptionsNavTabs({
  activeTab,
  onTabChange,
  subscribersCount = 412,
  plansCount = 4,
  requestsCount = 3,
}: SubscriptionsNavTabsProps) {
  const tabs = [
    {
      key: "overview" as const,
      label: "Overview & Analytics",
      icon: LayoutGrid,
    },
    {
      key: "plans" as const,
      label: "Pricing Plans",
      icon: Layers,
      count: plansCount,
    },
    {
      key: "subscribers" as const,
      label: "Active Subscribers",
      icon: Users,
      count: subscribersCount,
    },
    {
      key: "transactions" as const,
      label: "Transactions & Invoices",
      icon: CreditCard,
    },
    // {
    //   key: "requests" as const,
    //   label: "Offline Verifications",
    //   icon: Clock,
    //   count: requestsCount,
    //   countVariant: "amber",
    // },
  ]

  return (
    <div className="flex items-center gap-1.5 p-1 bg-zinc-100/80 rounded-2xl border border-zinc-200/70 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.key

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer select-none",
              isActive
                ? "bg-white text-zinc-900 font-semibold shadow-2xs border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-white/50"
            )}
          >
            <Icon
              className={cn(
                "size-3.5 transition-colors",
                isActive ? "text-[#D97706]" : "text-zinc-400"
              )}
            />
            <span>{tab.label}</span>

            {tab.count !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-semibold transition-colors",
                  isActive
                    ? "bg-zinc-100 text-zinc-700"
                    : "bg-zinc-200/70 text-zinc-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
