"use client"

import * as React from "react"
import { LifeBuoy, HelpCircle, Activity, PhoneCall } from "lucide-react"
import { cn } from "@/lib/utils"
import { SupportTabKey } from "../types/support.types"

interface SupportNavTabsProps {
  activeTab: SupportTabKey
  onTabChange: (tab: SupportTabKey) => void
  openTicketsCount?: number
  faqCount?: number
}

export function SupportNavTabs({
  activeTab,
  onTabChange,
  openTicketsCount = 12,
  faqCount = 7,
}: SupportNavTabsProps) {
  const tabs = [
    {
      key: "tickets" as const,
      label: "Support Tickets",
      icon: LifeBuoy,
      count: openTicketsCount,
      countLabel: "open",
    },
    {
      key: "faq" as const,
      label: "Knowledge Base & FAQs",
      icon: HelpCircle,
      count: faqCount,
    },
    {
      key: "status" as const,
      label: "System Health & Uptime",
      icon: Activity,
      isLive: true,
    },
    {
      key: "contact" as const,
      label: "Direct Support Channels",
      icon: PhoneCall,
    },
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
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer select-none",
              isActive
                ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-white/50"
            )}
          >
            <Icon
              className={cn(
                "size-3.5 transition-colors",
                isActive ? "text-brand-orange" : "text-zinc-400"
              )}
            />
            <span>{tab.label}</span>

            {tab.count !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-semibold transition-colors",
                  tab.countLabel === "open"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : isActive
                    ? "bg-zinc-100 text-zinc-700"
                    : "bg-zinc-200/70 text-zinc-600"
                )}
              >
                {tab.count}
              </span>
            )}

            {tab.isLive && (
              <span className="flex items-center gap-1 ml-0.5">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold hidden sm:inline">
                  99.98%
                </span>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
