"use client"

import * as React from "react"
import { Baby, CreditCard, Sparkles, Banknote } from "lucide-react"

export interface ParentKpiCardsProps {
  kpis: {
    linkedChildren: number
    activeSubscriptions: number
    pointsBalance: number
    pendingRequests: number
  }
}

export function ParentKpiCards({ kpis }: ParentKpiCardsProps) {
  const cards = [
    {
      title: "Linked Children",
      value: kpis.linkedChildren.toLocaleString(),
      icon: Baby,
      iconBg: "bg-[#F3E8FF] text-[#9333EA]",
    },
    {
      title: "Active Subscriptions",
      value: kpis.activeSubscriptions.toLocaleString(),
      icon: CreditCard,
      iconBg: "bg-[#E0F2FE] text-[#0284C7]",
    },
    {
      title: "Points Balance",
      value: kpis.pointsBalance.toLocaleString(),
      icon: Sparkles,
      iconBg: "bg-[#ECFCCB] text-[#65A30D]",
    },
    {
      title: "Pending Payment Requests",
      value: kpis.pendingRequests.toLocaleString(),
      icon: Banknote,
      iconBg: "bg-[#FEF3C7] text-[#D97706]",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between"
          >
            {/* Top Icon */}
            <div className="flex items-center">
              <div
                className={`size-10 rounded-xl flex items-center justify-center ${card.iconBg}`}
              >
                <Icon className="size-5" />
              </div>
            </div>

            {/* Bottom Number and Label */}
            <div className="mt-4">
              <span className="text-3xl font-bold text-zinc-900 tracking-tight block">
                {card.value}
              </span>
              <span className="text-xs font-medium text-zinc-500 mt-1 block">
                {card.title}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
