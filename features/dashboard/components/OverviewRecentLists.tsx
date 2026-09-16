"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, ExternalLink } from "lucide-react"
import { mockStudents } from "@/features/student/data/mockStudents"
import { mockTeachers } from "@/features/teacher/data/mockTeachers"
import { cn } from "@/lib/utils"

export function OverviewRecentLists() {
  const recentStudents = mockStudents.slice(0, 5)
  const recentTeachers = mockTeachers.slice(0, 4)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Recent Students Card */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Recent Students
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Newly registered and active students
              </p>
            </div>
            <Link
              href="/student/student_list"
              className="text-xs font-semibold text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 mt-2">
            {recentStudents.map((student) => (
              <div
                key={student.id}
                className="py-3 flex items-center justify-between gap-3 group hover:bg-zinc-50/60 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs",
                      student.avatarColorClass
                    )}
                  >
                    {student.avatarInitials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <Link
                      href={`/student/${student.id}`}
                      className="text-xs font-semibold text-zinc-900 truncate hover:text-brand-orange transition-colors"
                    >
                      {student.name}
                    </Link>
                    <span className="text-[11px] text-zinc-400 truncate">
                      {student.code} • {student.grade} ({student.system})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col items-end text-right">
                    <span className="text-xs font-semibold text-zinc-700">
                      {student.progress}%
                    </span>
                    <span className="text-[10px] text-zinc-400">Progress</span>
                  </div>

                  <span
                    className={cn(
                      "text-[11px] font-medium px-2 py-0.5 rounded-full border",
                      student.status === "Active"
                        ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                        : "text-zinc-600 bg-zinc-50 border-zinc-200"
                    )}
                  >
                    {student.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
          <span>Showing latest 5 of {mockStudents.length} students</span>
          <Link
            href="/student/add"
            className="text-xs font-medium text-zinc-700 hover:text-brand-orange flex items-center gap-1 transition-colors"
          >
            <span>Add Student</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>

      {/* Active Teachers Card */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Active Teachers
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Faculty availability and upcoming schedules
              </p>
            </div>
            <Link
              href="/teacher/teacher_list"
              className="text-xs font-semibold text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 mt-2">
            {recentTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="py-3.5 flex items-center justify-between gap-3 group hover:bg-zinc-50/60 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs",
                      teacher.avatarColorClass
                    )}
                  >
                    {teacher.avatarInitials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <Link
                      href={`/teacher/${teacher.id}`}
                      className="text-xs font-semibold text-zinc-900 truncate hover:text-brand-orange transition-colors"
                    >
                      {teacher.name}
                    </Link>
                    <span className="text-[11px] text-zinc-400 truncate">
                      {teacher.subjects.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-zinc-800">
                      {teacher.upcomingSessions}
                    </span>
                    <span className="text-[10px] text-zinc-400 block">
                      Sessions
                    </span>
                  </div>

                  <span
                    className={cn(
                      "text-[11px] font-medium px-2 py-0.5 rounded-full border",
                      teacher.availability === "Available"
                        ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                        : teacher.availability === "Busy"
                        ? "text-amber-700 bg-amber-50 border-amber-100"
                        : "text-zinc-600 bg-zinc-50 border-zinc-200"
                    )}
                  >
                    {teacher.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
          <span>Showing 4 of {mockTeachers.length} teachers</span>
          <Link
            href="/teacher/add"
            className="text-xs font-medium text-zinc-700 hover:text-brand-orange flex items-center gap-1 transition-colors"
          >
            <span>Add Teacher</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
