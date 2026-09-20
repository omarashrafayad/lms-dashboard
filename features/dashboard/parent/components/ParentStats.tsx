"use client"

import * as React from "react"
import { Users, UserCheck, Baby, CreditCard, Plus, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface ParentStatsProps {
  totalCount: number
  activeCount?: number
  withChildrenCount?: number
  activeSubscriptionsCount?: number
  onAddParent?: () => void
}

export function ParentStats({
  totalCount = 6,
  activeCount = 5,
  withChildrenCount = 5,
  activeSubscriptionsCount = 4,
  onAddParent,
}: ParentStatsProps) {
  const statCards = [
    {
      title: "Total Parents",
      value: totalCount,
      change: "+4.9%",
      icon: Users,
      iconBg: "bg-[#F3E8FF] text-[#9333EA]", // Light purple
    },
    {
      title: "Active Parents",
      value: activeCount,
      change: "+2.6%",
      icon: UserCheck,
      iconBg: "bg-[#E0F2FE] text-[#0284C7]", // Light blue
    },
    {
      title: "Parents with Linked Children",
      value: withChildrenCount,
      change: "+5.3%",
      icon: Baby,
      iconBg: "bg-[#ECFCCB] text-[#65A30D]", // Light lime/olive
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptionsCount,
      change: "+8.1%",
      icon: CreditCard,
      iconBg: "bg-[#FEF3C7] text-[#D97706]", // Light amber
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header Row: Title/Count on Left, + Add Parent Button on Right */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-base font-bold text-zinc-900 leading-tight">
            Parent Directory
          </h2>
          <span className="text-xs text-zinc-500 font-normal mt-0.5">
            {totalCount} of {totalCount} parents shown
          </span>
        </div>

        <Link href="/parent/add">
          <Button
            onClick={onAddParent}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-medium rounded-xl h-10 px-4 gap-2 shadow-2xs cursor-pointer transition-all hover:brightness-95 active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Parent</span>
          </Button>
        </Link>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between"
            >
              {/* Top row: Icon & percentage pill */}
              <div className="flex items-center justify-between">
                <div
                  className={`size-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full px-2 py-0.5">
                  <ArrowUpRight className="size-3.5" />
                  <span>{stat.change}</span>
                </div>
              </div>

              {/* Bottom: Big number & Label */}
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 tracking-tight block">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-zinc-500 mt-1 block">
                  {stat.title}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
