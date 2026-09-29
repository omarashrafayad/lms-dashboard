"use client"

import * as React from "react"
import { Layers, CheckCircle2, XCircle } from "lucide-react"

interface ReferenceDataMetricsProps {
  total: number
  active: number
  inactive: number
  itemLabel?: string
}

export function ReferenceDataMetrics({
  total,
  active,
  inactive,
  itemLabel = "Records",
}: ReferenceDataMetricsProps) {
  const cards = [
    {
      label: `Total ${itemLabel}`,
      value: total,
      subtext: "Configured in system",
      icon: Layers,
      bgIcon: "bg-amber-50 text-[#D97706] border-amber-200/60",
      accent: "from-amber-500/10 to-transparent",
    },
    {
      label: "Active Status",
      value: active,
      subtext: "Visible across platform",
      icon: CheckCircle2,
      bgIcon: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
      accent: "from-emerald-500/10 to-transparent",
    },
    {
      label: "Inactive Status",
      value: inactive,
      subtext: "Hidden or archived",
      icon: XCircle,
      bgIcon: "bg-zinc-100 text-zinc-600 border-zinc-200/60",
      accent: "from-zinc-500/10 to-transparent",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className="relative overflow-hidden bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-2xs flex flex-col justify-between"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${card.accent} rounded-full blur-2xl pointer-events-none -mr-10 -mt-10`}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 tracking-wide">
                {card.label}
              </span>
              <div
                className={`size-9 rounded-xl border flex items-center justify-center shrink-0 ${card.bgIcon}`}
              >
                <Icon className="size-4.5" />
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                {card.value}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal mt-0.5">
                {card.subtext}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
