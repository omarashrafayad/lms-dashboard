"use client"

import * as React from "react"

export interface SessionStatusTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export const SESSION_TABS = ["All", "Today", "Upcoming", "In Progress", "Completed"]

export function SessionStatusTabs({
  activeTab,
  onTabChange,
}: SessionStatusTabsProps) {
  return (
    <div className="border-b border-zinc-200/80 overflow-x-auto">
      <div className="flex items-center gap-7 min-w-max">
        {SESSION_TABS.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`pb-3 text-xs whitespace-nowrap cursor-pointer transition-all relative ${
                isActive
                  ? "font-bold text-zinc-900 border-b-2 border-[#F59E0B]"
                  : "font-medium text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>
    </div>
  )
}
