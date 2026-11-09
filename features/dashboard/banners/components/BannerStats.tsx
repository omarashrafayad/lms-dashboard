"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface BannerStatsProps {
  totalCount: number
  activeCount: number
  inactiveCount: number
  onAddBanner?: () => void
}

export function BannerStats({
  totalCount,
  activeCount,
  inactiveCount,
  onAddBanner,
}: BannerStatsProps) {
  const statsData = [
    {
      title: "Total Banners",
      value: totalCount.toLocaleString(),
      description: "All uploaded promotional banners",
      dotColor: "bg-cyan-400",
    },
    {
      title: "Active Banners",
      value: activeCount.toLocaleString(),
      description: "Currently visible to users",
      dotColor: "bg-lime-400",
    },
    {
      title: "Inactive Banners",
      value: inactiveCount.toLocaleString(),
      description: "Hidden or drafted banners",
      dotColor: "bg-purple-400",
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Action and Count Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500">
          {totalCount} {totalCount === 1 ? "banner" : "banners"} found
        </span>
        <Button
          onClick={onAddBanner}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white font-medium rounded-xl h-10 px-4 gap-2 shadow-2xs cursor-pointer transition-all hover:brightness-95"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Add Banner</span>
        </Button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statsData.map((stat) => (
          <div
            key={stat.title}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`size-2 rounded-full ${stat.dotColor}`} />
              <span className="text-xs font-semibold text-zinc-600">
                {stat.title}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-zinc-900">
                {stat.value}
              </span>
              <span className="text-[11px] text-zinc-400">
                {stat.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

