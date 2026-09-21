"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface TeacherStatsProps {
  totalCount: number
  activeCount?: number
  availableCount?: number
  upcomingSessionsCount?: number
}

interface StatCardData {
  title: string
  value: string | number
  dotColor: string
}

export function TeacherStats({
  totalCount,
  activeCount,
  availableCount,
  upcomingSessionsCount,
}: TeacherStatsProps) {
  const statsData: StatCardData[] = [
    {
      title: "Total Teachers",
      value: totalCount,
      dotColor: "bg-sky-400",
    },
    {
      title: "Active Teachers",
      value: activeCount !== undefined ? activeCount : totalCount,
      dotColor: "bg-emerald-400",
    },
    {
      title: "Available Now",
      value: availableCount !== undefined ? availableCount : Math.min(totalCount, 42),
      dotColor: "bg-purple-400",
    },
    {
      title: "Upcoming Sessions",
      value: upcomingSessionsCount !== undefined ? upcomingSessionsCount : 0,
      dotColor: "bg-amber-400",
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Top Bar: Count & Add Teacher Button */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500">
          {totalCount} {totalCount === 1 ? "teacher" : "teachers"} found
        </span>
        <Link href="/teacher/add">
          <Button
            className="bg-brand-orange hover:bg-amber-500 text-white font-medium rounded-xl h-10 px-5 gap-2 shadow-2xs cursor-pointer transition-all hover:brightness-95 active:scale-[0.99]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Teacher</span>
          </Button>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsData.map((stat) => (
          <div
            key={stat.title}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between min-h-[105px]"
          >
            {/* Top row: Title and colored indicator dot */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">
                {stat.title}
              </span>
              <span className={cn("size-2 rounded-full", stat.dotColor)} />
            </div>

            {/* Bottom row: Value */}
            <div className="mt-4">
              <span className="text-3xl font-bold text-zinc-900 tracking-tight leading-none">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
