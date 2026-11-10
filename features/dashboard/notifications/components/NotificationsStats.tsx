"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface NotificationsStatsProps {
  totalCount: number
  publishedCount?: number
  draftCount?: number
  onAddNotification?: () => void
}

export function NotificationsStats({
  totalCount,
  publishedCount = 0,
  draftCount = 0,
  onAddNotification,
}: NotificationsStatsProps) {
  const statsData = [
    {
      title: "Total Broadcasts",
      value: totalCount.toLocaleString(),
      change: "All Time",
      period: "Recorded system notifications",
      dotColor: "bg-cyan-400",
    },
    {
      title: "Published & Active",
      value: publishedCount.toLocaleString(),
      change: "Active",
      period: "Visible to target recipients",
      dotColor: "bg-lime-400",
    },
    {
      title: "Draft Messages",
      value: draftCount.toLocaleString(),
      change: "Pending",
      period: "Unpublished / scheduled drafts",
      dotColor: "bg-amber-400",
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Action and Count Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500">
          {totalCount} notifications found
        </span>
        <Button
          onClick={onAddNotification}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white font-medium rounded-xl h-10 px-4 gap-2 shadow-2xs cursor-pointer transition-all hover:brightness-95"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>New Notification</span>
        </Button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statsData.map((stat) => (
          <div
            key={stat.title}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between"
          >
            {/* Top row: Title and colored indicator dot */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">
                {stat.title}
              </span>
              <span className={cn("size-2 rounded-full", stat.dotColor)} />
            </div>

            {/* Middle row: Number and Status badge */}
            <div className="flex items-center justify-between mt-3 mb-1">
              <span className="text-3xl font-bold text-zinc-900 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-full px-2.5 py-0.5">
                {stat.change}
              </span>
            </div>

            {/* Bottom: Period / subtext */}
            <span className="text-[11px] text-zinc-400 font-normal">
              {stat.period}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

