"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, ExternalLink } from "lucide-react"
import { useStudents } from "@/features/dashboard/student/hooks/useStudents"
import { useTeachers } from "@/features/dashboard/teacher/hooks/useTeachers"
import { cn } from "@/lib/utils"

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
]

function getAvatarInitials(name?: string, fallback = "U"): string {
  const parts = (name || fallback).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return fallback
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function getAvatarColor(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function OverviewRecentLists() {
  const { data: apiStudents } = useStudents()
  const { data: apiTeachers } = useTeachers()

  const studentsList = Array.isArray(apiStudents) ? apiStudents : []
  const teachersList = Array.isArray(apiTeachers) ? apiTeachers : []

  const recentStudents = studentsList.slice(0, 5)
  const recentTeachers = teachersList.slice(0, 4)

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
            {recentStudents.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No students found</p>
            ) : (
              recentStudents.map((student) => {
                const initials = getAvatarInitials(student.fullName, "ST")
                const colorClass = getAvatarColor(student.id || student.fullName || "")
                const code = `STD-${(student.id || "").slice(0, 5).toUpperCase()}`
                const progress = student.progress ?? 75

                return (
                  <div
                    key={student.id}
                    className="py-3 flex items-center justify-between gap-3 group hover:bg-zinc-50/60 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs",
                          colorClass
                        )}
                      >
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <Link
                          href={`/student/${student.id}`}
                          className="text-xs font-semibold text-zinc-900 truncate hover:text-brand-orange transition-colors"
                        >
                          {student.fullName}
                        </Link>
                        <span className="text-[11px] text-zinc-400 truncate">
                          {code} • {student.grade || "Grade"} ({student.educationSystem || "General"})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex flex-col items-end text-right">
                        <span className="text-xs font-semibold text-zinc-700">
                          {progress}%
                        </span>
                        <span className="text-[10px] text-zinc-400">Progress</span>
                      </div>

                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full border",
                          student.isActive
                            ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                            : "text-zinc-600 bg-zinc-50 border-zinc-200"
                        )}
                      >
                        {student.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
          <span>
            Showing latest {Math.min(5, recentStudents.length)} of {studentsList.length} students
          </span>
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
            {recentTeachers.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No teachers found</p>
            ) : (
              recentTeachers.map((teacher) => {
                const initials = getAvatarInitials(teacher.fullName, "TC")
                const colorClass = getAvatarColor(teacher.id || teacher.fullName || "")
                const subjectList = teacher.specializations
                  ? (teacher.specializations.map((s) => s.subjectName).filter(Boolean) as string[])
                  : []
                const subjects = subjectList.length > 0 ? subjectList.join(", ") : "General"
                const upcoming = teacher.availabilitySlots?.length ?? 0
                const availability =
                  teacher.isAvailable === false
                    ? "Unavailable"
                    : !teacher.isActive
                    ? "Offline"
                    : "Available"

                return (
                  <div
                    key={teacher.id}
                    className="py-3.5 flex items-center justify-between gap-3 group hover:bg-zinc-50/60 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs",
                          colorClass
                        )}
                      >
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <Link
                          href={`/teacher/${teacher.id}`}
                          className="text-xs font-semibold text-zinc-900 truncate hover:text-brand-orange transition-colors"
                        >
                          {teacher.fullName}
                        </Link>
                        <span className="text-[11px] text-zinc-400 truncate">
                          {subjects}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-zinc-800">
                          {upcoming}
                        </span>
                        <span className="text-[10px] text-zinc-400 block">
                          Sessions
                        </span>
                      </div>

                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full border",
                          availability === "Available"
                            ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                            : availability === "Unavailable"
                            ? "text-rose-700 bg-rose-50 border-rose-100"
                            : "text-zinc-600 bg-zinc-50 border-zinc-200"
                        )}
                      >
                        {availability}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
          <span>
            Showing {Math.min(4, recentTeachers.length)} of {teachersList.length} teachers
          </span>
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
