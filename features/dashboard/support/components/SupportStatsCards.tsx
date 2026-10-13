"use client"

import * as React from "react"
import {
  LifeBuoy,
  Clock,
  CheckCircle2,
  Smile,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SupportStats } from "../types/support.types"

interface SupportStatsCardsProps {
  stats: SupportStats
  className?: string
}

export function SupportStatsCards({ stats, className }: SupportStatsCardsProps) {
  const cards = [
    {
      title: "Total Inquiries",
      value: stats.totalTickets.toString(),
      subtext: "Lifetime logged tickets",
      icon: LifeBuoy,
      iconBg: "bg-amber-50 text-brand-orange border border-amber-200/60",
      trend: "+12% this month",
      trendColor: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
    },
    {
      title: "Open & Pending",
      value: stats.openTickets.toString(),
      subtext: `${stats.inProgressTickets} currently in progress`,
      icon: AlertCircle,
      iconBg: "bg-amber-100 text-amber-800 border border-amber-200/80",
      trend: "Needs attention",
      trendColor: "text-amber-800 bg-amber-50 border-amber-200/60",
    },
    {
      title: "Avg. Response Time",
      value: stats.avgResponseTime,
      subtext: "Industry standard < 2h",
      icon: Clock,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-200/60",
      trend: "⚡ Super fast",
      trendColor: "text-blue-700 bg-blue-50 border-blue-200/60",
    },
    {
      title: "Resolution Satisfaction",
      value: `${stats.satisfactionRate}%`,
      subtext: `${stats.resolvedCount} tickets resolved`,
      icon: Smile,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
      trend: "99.2% positive",
      trendColor: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
    },
  ]

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-4 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-zinc-500">
                  {card.title}
                </span>
                <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                  {card.value}
                </span>
              </div>
              <div
                className={cn(
                  "size-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105",
                  card.iconBg
                )}
              >
                <Icon className="size-5" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-100">
              <span className="text-zinc-400 font-normal truncate">
                {card.subtext}
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0",
                  card.trendColor
                )}
              >
                {card.trend}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
