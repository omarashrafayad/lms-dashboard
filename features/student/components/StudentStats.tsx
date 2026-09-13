"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface StudentStatsProps {
  totalCount: number
  onAddStudent?: () => void
}

interface StatCardData {
  title: string
  value: string
  change: string
  period: string
  dotColor: string
}

const statsData: StatCardData[] = [
  {
    title: "Total Students",
    value: "2,450",
    change: "+6.2%",
    period: "vs. last month",
    dotColor: "bg-cyan-400",
  },
  {
    title: "Active Students",
    value: "2,120",
    change: "+3.8%",
    period: "vs. last month",
    dotColor: "bg-lime-400",
  },
  {
    title: "New This Month",
    value: "185",
    change: "+12.5%",
    period: "vs. last month",
    dotColor: "bg-purple-400",
  },
]

export function StudentStats({ totalCount, onAddStudent }: StudentStatsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Action and Count Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500">
          {totalCount} students found
        </span>

        <Button
          onClick={onAddStudent}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white font-medium rounded-xl h-10 px-4 gap-2 shadow-2xs cursor-pointer transition-all hover:brightness-95"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Add Student</span>
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

            {/* Middle row: Number and Percentage badge */}
            <div className="flex items-center justify-between mt-3 mb-1">
              <span className="text-3xl font-bold text-zinc-900 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-semibold text-brand-green bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                {stat.change}
              </span>
            </div>

            {/* Bottom: vs. period text */}
            <span className="text-[11px] text-zinc-400 font-normal">
              {stat.period}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
