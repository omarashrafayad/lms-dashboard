"use client"

import * as React from "react"
import { Users, GraduationCap, Calendar, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface OverviewStatItem {
  title: string
  value: string
  change: string
  period: string
  isPositive: boolean
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  dotColor: string
}

const stats: OverviewStatItem[] = [
  {
    title: "Total Students",
    value: "2,450",
    change: "+6.2%",
    period: "vs last month",
    isPositive: true,
    icon: GraduationCap,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    dotColor: "bg-blue-400",
  },
  {
    title: "Total Teachers",
    value: "128",
    change: "+4.1%",
    period: "vs last month",
    isPositive: true,
    icon: Users,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    dotColor: "bg-purple-400",
  },
  {
    title: "Sessions Today",
    value: "42",
    change: "+18%",
    period: "vs yesterday",
    isPositive: true,
    icon: Calendar,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    dotColor: "bg-amber-400",
  },
  {
    title: "Completion Rate",
    value: "94.2%",
    change: "+2.5%",
    period: "vs last month",
    isPositive: true,
    icon: TrendingUp,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    dotColor: "bg-emerald-400",
  },
]

export function OverviewStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between group"
          >
            {/* Top row: Icon & Status Dot */}
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "size-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                  stat.iconBg,
                  stat.iconColor
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className={cn("size-2 rounded-full", stat.dotColor)} />
                <span className="text-[11px] font-medium text-zinc-400">Live</span>
              </div>
            </div>

            {/* Middle: Value and Title */}
            <div className="mt-4 mb-2">
              <span className="text-3xl font-bold text-zinc-900 tracking-tight block">
                {stat.value}
              </span>
              <span className="text-xs font-medium text-zinc-500 mt-1 block">
                {stat.title}
              </span>
            </div>

            {/* Bottom: Change Badge and Period */}
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
              <span
                className={cn(
                  "text-xs font-semibold rounded-full px-2 py-0.5 border",
                  stat.isPositive
                    ? "text-brand-green bg-emerald-50 border-emerald-100"
                    : "text-rose-600 bg-rose-50 border-rose-100"
                )}
              >
                {stat.change}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal">
                {stat.period}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
