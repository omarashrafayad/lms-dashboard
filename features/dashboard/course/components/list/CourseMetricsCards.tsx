"use client"

import * as React from "react"
import { BookOpen, CheckCircle2, FileEdit, Archive } from "lucide-react"

export interface CourseMetricsCardsProps {
  total: number
  published: number
  draft: number
  archived: number
}

export function CourseMetricsCards({
  total = 8,
  published = 5,
  draft = 2,
  archived = 1,
}: CourseMetricsCardsProps) {
  const cards = [
    {
      label: "Total Courses",
      value: total,
      icon: BookOpen,
      iconBg: "bg-[#F3E8FF] text-[#7E22CE]",
    },
    {
      label: "Published",
      value: published,
      icon: CheckCircle2,
      iconBg: "bg-[#E0F2FE] text-[#0284C7]",
    },
    {
      label: "Draft",
      value: draft,
      icon: FileEdit,
      iconBg: "bg-[#FEF9C3] text-[#CA8A04]",
    },
    {
      label: "Archived",
      value: archived,
      icon: Archive,
      iconBg: "bg-[#F4F4F5] text-[#71717A]",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-3 transition-all hover:border-zinc-300"
          >
            <div
              className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
            >
              <Icon className="size-5" />
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                {card.value}
              </span>
              <span className="text-xs font-medium text-zinc-500">
                {card.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
