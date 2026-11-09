"use client"

import * as React from "react"

export type TeacherTabKey =
  | "overview"
  | "finance"
  | "points_sessions"
  | "payment_requests"
  | "transactions"

export interface TeacherTabsProps {
  activeTab: TeacherTabKey
  onTabChange: (tab: TeacherTabKey) => void
}

const tabs: { key: TeacherTabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "finance", label: "Finance & Earnings" },
  { key: "points_sessions", label: "Points & Private Sessions" },
  { key: "payment_requests", label: "Payment Requests" },
  { key: "transactions", label: "Payments & Transactions" },
]

export function TeacherTabs({ activeTab, onTabChange }: TeacherTabsProps) {
  return (
    <div className="w-full border-b border-zinc-200/80 overflow-x-auto scrollbar-none">
      <nav className="flex items-center gap-8 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`pb-3 text-xs tracking-tight transition-all cursor-pointer relative ${
                isActive
                  ? "font-semibold text-zinc-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D97706]"
                  : "font-medium text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

