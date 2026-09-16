"use client"

import * as React from "react"
import Link from "next/link"
import { UserPlus, GraduationCap, Users, CalendarPlus, ArrowRight } from "lucide-react"

interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
  border: string
}

const actions: QuickAction[] = [
  {
    title: "Add New Student",
    description: "Register and assign a student to grade and system",
    href: "/student/add",
    icon: GraduationCap,
    color: "text-amber-600",
    bg: "bg-amber-50 group-hover:bg-amber-100/70",
    border: "border-amber-200/60",
  },
  {
    title: "Add New Teacher",
    description: "Onboard teacher and assign subjects & availability",
    href: "/teacher/add",
    icon: UserPlus,
    color: "text-purple-600",
    bg: "bg-purple-50 group-hover:bg-purple-100/70",
    border: "border-purple-200/60",
  },
  {
    title: "Browse Students",
    description: "Filter, inspect profiles, and manage enrollment",
    href: "/student/student_list",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50 group-hover:bg-blue-100/70",
    border: "border-blue-200/60",
  },
  {
    title: "Browse Teachers",
    description: "View teacher directory, subjects, and schedules",
    href: "/teacher/teacher_list",
    icon: CalendarPlus,
    color: "text-emerald-600",
    bg: "bg-emerald-50 group-hover:bg-emerald-100/70",
    border: "border-emerald-200/60",
  },
]

export function OverviewQuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">Quick Shortcuts</h2>
        <span className="text-xs text-zinc-400">Frequently used actions</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-sm hover:border-zinc-300 transition-all duration-200 flex items-start gap-3.5 group cursor-pointer"
            >
              <div
                className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${action.bg} ${action.color}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-900 group-hover:text-brand-orange transition-colors">
                    {action.title}
                  </span>
                  <ArrowRight className="size-3.5 text-zinc-300 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                  {action.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
