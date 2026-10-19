"use client"

import * as React from "react"
import { Building2, User, Bell, Sliders, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { SettingsTabKey } from "../types/settings.types"

interface SettingsNavTabsProps {
  activeTab: SettingsTabKey
  onTabChange: (tab: SettingsTabKey) => void
}

export function SettingsNavTabs({
  activeTab,
  onTabChange,
}: SettingsNavTabsProps) {
  const tabs = [
    {
      key: "general" as const,
      label: "General & Academy",
      icon: Building2,
      description: "Platform identity & regional",
    },
    {
      key: "profile" as const,
      label: "Admin Profile",
      icon: User,
      description: "Personal info & security key",
    },
    {
      key: "notifications" as const,
      label: "Notifications",
      icon: Bell,
      description: "Email, push & SMS triggers",
    },
    {
      key: "system" as const,
      label: "LMS Rules & Bookings",
      icon: Sliders,
      description: "Registration & session rules",
    },
    {
      key: "security" as const,
      label: "Security & Sessions",
      icon: ShieldCheck,
      description: "2FA & connected devices",
    },
  ]

  return (
    <div className="flex items-center gap-1.5 p-1 bg-zinc-100/80 rounded-2xl border border-zinc-200/70 overflow-x-auto no-scrollbar w-full sm:w-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.key

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer select-none",
              isActive
                ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-white/50"
            )}
          >
            <Icon
              className={cn(
                "size-4 transition-colors shrink-0",
                isActive ? "text-brand-orange" : "text-zinc-400"
              )}
            />
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
