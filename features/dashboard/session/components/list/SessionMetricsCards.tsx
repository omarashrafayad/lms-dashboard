"use client"

import * as React from "react"
import { Calendar, Clock, Play, CheckCircle2 } from "lucide-react"

export interface SessionMetricsCardsProps {
  total: number
  upcoming: number
  inProgress: number
  completed: number
}

export function SessionMetricsCards({
  total,
  upcoming,
  inProgress,
  completed,
}: SessionMetricsCardsProps) {
  const cards = [
    {
      title: "Total Sessions",
      value: total,
      icon: Calendar,
      iconBg: "bg-[#F3E8FF] text-[#9333EA]",
    },
    {
      title: "Upcoming",
      value: upcoming,
      icon: Clock,
      iconBg: "bg-[#E0F2FE] text-[#0284C7]",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Play,
      iconBg: "bg-[#FEF3C7] text-[#D97706]",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      iconBg: "bg-[#DCFCE7] text-[#16A34A]",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-zinc-200/80 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <div
                className={`size-8 rounded-lg flex items-center justify-center ${card.iconBg}`}
              >
                <Icon className="size-4 stroke-[2]" />
              </div>
            </div>

            <div className="flex flex-col mt-3">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                {card.value}
              </span>
              <span className="text-xs text-zinc-500 font-normal mt-0.5">
                {card.title}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
