"use client"

import * as React from "react"
import {
  ClipboardCheck,
  CheckCircle2,
  UserPlus,
  FileCheck2,
  MessageSquare,
  Sparkles,
  Clock,
} from "lucide-react"

export function TeacherRecentActivities() {
  const activities = [
    {
      id: "act-1",
      title: "Ahmed Mansour submitted Homework 4 (Lenz's Law)",
      course: "Advanced Physics",
      timestamp: "15 minutes ago",
      icon: ClipboardCheck,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      actionLabel: "Grade Now",
    },
    {
      id: "act-2",
      title: "15 students completed Induction Theory Video Lesson",
      course: "Advanced Physics",
      timestamp: "1 hour ago",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      actionLabel: "View Analytics",
    },
    {
      id: "act-3",
      title: "New student enrolled: Youssef Ibrahim (Grade 11)",
      course: "Secondary Physics Fundamentals",
      timestamp: "3 hours ago",
      icon: UserPlus,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      actionLabel: "View Profile",
    },
    {
      id: "act-4",
      title: "25 students completed Midterm Exam Online",
      course: "Advanced Physics",
      timestamp: "5 hours ago",
      icon: FileCheck2,
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      actionLabel: "Submissions",
    },
    {
      id: "act-5",
      title: "Kareem Adel asked a question: Self-Inductance in Coils",
      course: "Advanced Physics",
      timestamp: "Yesterday",
      icon: MessageSquare,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      actionLabel: "Reply",
    },
    {
      id: "act-6",
      title: "Course unit approved: Modern Quantum Foundations",
      course: "Academic Quality Assurance",
      timestamp: "2 days ago",
      icon: Sparkles,
      iconColor: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      actionLabel: "View",
    },
  ]

  return (
    <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-brand-orange" />
          <h2 className="text-base font-bold text-zinc-900">
            Recent Course & Student Activities
          </h2>
        </div>
        <span className="text-xs text-zinc-400 font-medium">Real-time Stream</span>
      </div>

      <div className="relative pl-6 flex flex-col gap-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-200">
        {activities.map((act) => {
          const Icon = act.icon

          return (
            <div key={act.id} className="relative flex items-center justify-between gap-4 group">
              <div
                className={`absolute -left-6 size-6 rounded-full ${act.bgColor} border ${act.borderColor} flex items-center justify-center -translate-x-1/2 ring-4 ring-white shadow-2xs`}
              >
                <Icon className={`size-3 ${act.iconColor}`} />
              </div>

              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-bold text-zinc-900 group-hover:text-blue-700 transition-colors">
                  {act.title}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {act.course} • {act.timestamp}
                </span>
              </div>

              <span className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-zinc-100 text-zinc-700 shrink-0 border border-zinc-200/60">
                {act.actionLabel}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
