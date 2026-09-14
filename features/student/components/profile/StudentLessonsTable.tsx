"use client"

import * as React from "react"
import { StudentLessonItem } from "../../types/studentProfile.types"
import { cn } from "@/lib/utils"

interface StudentLessonsTableProps {
  lessons: StudentLessonItem[]
}

export function StudentLessonsTable({ lessons }: StudentLessonsTableProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs">
      <h2 className="text-sm font-bold text-zinc-900 mb-4">
        Lessons
      </h2>

      <div className="overflow-x-auto rounded-xl border border-zinc-100">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                LESSON
              </th>
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                COURSE
              </th>
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                COMPLETED DATE
              </th>
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {lessons.map((lesson) => {
              const isCompleted = lesson.status === "Completed"
              return (
                <tr key={lesson.id} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-zinc-900">
                    {lesson.name}
                  </td>
                  <td className="py-3 px-4 text-zinc-600">
                    {lesson.course}
                  </td>
                  <td className="py-3 px-4 text-zinc-500">
                    {lesson.completedDate}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                        isCompleted
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                          : "text-amber-700 bg-amber-50 border-amber-200/60"
                      )}
                    >
                      {lesson.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
