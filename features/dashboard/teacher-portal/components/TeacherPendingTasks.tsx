"use client"

import * as React from "react"
import Link from "next/link"
import {
  ClipboardCheck,
  FileCheck2,
  HelpCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  FileText,
} from "lucide-react"
import { TeacherPendingTask } from "../types/teacherPortal.types"
import { MOCK_TEACHER_PENDING_TASKS } from "../data/mockTeacherData"

interface TeacherPendingTasksProps {
  tasks?: TeacherPendingTask[]
}

export function TeacherPendingTasks({
  tasks = MOCK_TEACHER_PENDING_TASKS,
}: TeacherPendingTasksProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="size-5 text-brand-orange" />
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">
            Pending Tasks & Grading Queue
          </h2>
        </div>
        <Link
          href="/teacher/grading"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
        >
          <span>Open Grading Workspace</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => {
          const isUrgent = task.priority === "urgent"
          const isHigh = task.priority === "high"

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isUrgent
                  ? "bg-rose-50/40 border-rose-200 ring-1 ring-rose-400/20"
                  : isHigh
                  ? "bg-amber-50/40 border-amber-200"
                  : "bg-zinc-50 border-zinc-200/70"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 mt-0.5 ${
                    isUrgent
                      ? "bg-rose-600 text-white"
                      : isHigh
                      ? "bg-amber-500 text-white"
                      : "bg-zinc-200 text-zinc-700"
                  }`}
                >
                  {task.priority}
                </span>

                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xs font-bold text-zinc-900 leading-snug">
                    {task.title}
                  </h3>
                  <span className="text-[11px] text-zinc-500">
                    {task.course} • {task.creationDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {task.type === "exam" || task.type === "assignment" ? (
                  <Link
                    href="/teacher/grading"
                    className="px-3.5 py-1.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs transition-colors shadow-2xs shadow-brand-orange/20"
                  >
                    Grade Now ({task.count})
                  </Link>
                ) : task.type === "question" ? (
                  <Link
                    href="/teacher/communication"
                    className="px-3.5 py-1.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs transition-colors shadow-2xs shadow-brand-orange/20"
                  >
                    Reply to Student
                  </Link>
                ) : (
                  <Link
                    href="/teacher/content"
                    className="px-3.5 py-1.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs transition-colors"
                  >
                    Edit Draft
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
