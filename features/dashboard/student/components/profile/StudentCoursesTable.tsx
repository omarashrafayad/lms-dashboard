"use client"

import * as React from "react"
import { StudentCourseProgress } from "../../types/studentProfile.types"
import { cn } from "@/lib/utils"

interface StudentCoursesTableProps {
  courses: StudentCourseProgress[]
}

export function StudentCoursesTable({ courses }: StudentCoursesTableProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs">
      <h2 className="text-sm font-bold text-zinc-900 mb-4">
        Courses
      </h2>

      <div className="overflow-x-auto rounded-xl border border-zinc-100">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                COURSE
              </th>
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                PROGRESS
              </th>
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                SCORE
              </th>
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {courses.map((course) => {
              const isCompleted = course.status === "Completed"
              return (
                <tr key={course.id} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-zinc-900">
                    {course.name}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5 w-36">
                      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-orange rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-zinc-400 font-normal shrink-0">
                        {course.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-zinc-900">
                    {course.score}%
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
                      {course.status}
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
