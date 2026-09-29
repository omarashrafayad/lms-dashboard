"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GraduationCap, Landmark, Sparkles, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TabItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}

interface ReferenceDataTabsProps {
  counts?: {
    academicStages?: number
    educationSystems?: number
    grades?: number
    genders?: number
  }
}

export function ReferenceDataTabs({ counts }: ReferenceDataTabsProps) {
  const pathname = usePathname()

  const tabs: TabItem[] = [
    {
      id: "academic-stages",
      label: "Academic Stages",
      href: "/reference-data/academic-stages",
      icon: GraduationCap,
      count: counts?.academicStages,
    },
    {
      id: "education-systems",
      label: "Education Systems",
      href: "/reference-data/education-systems",
      icon: Landmark,
      count: counts?.educationSystems,
    },
    {
      id: "grades",
      label: "Grades",
      href: "/reference-data/grades",
      icon: Sparkles,
      count: counts?.grades,
    },
    {
      id: "genders",
      label: "Genders",
      href: "/reference-data/genders",
      icon: Users,
      count: counts?.genders,
    },
  ]

  return (
    <div className="flex items-center gap-2 p-1.5 bg-zinc-100/80 rounded-2xl border border-zinc-200/60 overflow-x-auto select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive =
          pathname === tab.href ||
          (tab.id === "academic-stages" && pathname === "/reference-data")

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
              isActive
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-white/50"
            )}
          >
            <Icon
              className={cn(
                "size-4 transition-colors",
                isActive ? "text-[#D97706]" : "text-zinc-400"
              )}
            />
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors",
                  isActive
                    ? "bg-[#FFF9F2] text-[#D97706] border border-[#FFB543]/40"
                    : "bg-zinc-200/70 text-zinc-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
