"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, ExternalLink, Calendar, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DashboardStudentResponse,
  DashboardTeacherResponse,
} from "../types/overview.types"

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
]

function getAvatarInitials(name?: string | null, fallback = "U"): string {
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

export interface OverviewRecentListsProps {
  recentStudents?: DashboardStudentResponse[] | null
  activeTeachers?: DashboardTeacherResponse[] | null
}

export function OverviewRecentLists({
  recentStudents = [],
  activeTeachers = [],
}: OverviewRecentListsProps) {
  const studentsList = recentStudents || []
  const teachersList = activeTeachers || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Recent Students Card */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                <GraduationCap className="size-4.5 text-brand-orange" />
                <span>Recent Students</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Newly registered and active students
              </p>
            </div>
            <Link
              href="/student/student_list"
              className="text-xs font-semibold text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 transition-colors"
            >
              <span>View Directory</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 mt-2">
            {studentsList.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center gap-1.5 text-zinc-400">
                <GraduationCap className="size-7 stroke-[1.5]" />
                <p className="text-xs font-medium">No recent students found</p>
              </div>
            ) : (
              studentsList.map((student) => {
                const initials = getAvatarInitials(student.fullName, "ST")
                const colorClass = getAvatarColor(student.id || student.fullName || "")
                const metaParts = [
                  student.grade,
                  student.academicStage,
                  student.educationSystem,
                ].filter(Boolean)

                return (
                  <div
                    key={student.id}
                    className="py-3 flex items-center justify-between gap-3 group hover:bg-zinc-50/70 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "size-9.5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs",
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
                          {student.fullName || "Student"}
                        </Link>
                        <span className="text-[11px] text-zinc-400 truncate">
                          {student.email ||
                            (metaParts.length > 0 ? metaParts.join(" • ") : "General")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {metaParts.length > 0 && (
                        <div className="hidden sm:flex flex-col items-end text-right">
                          <span className="text-xs font-medium text-zinc-700">
                            {student.grade || student.academicStage}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {student.educationSystem || "Standard"}
                          </span>
                        </div>
                      )}

                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
                          student.isActive
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
                            : "text-zinc-500 bg-zinc-50 border-zinc-200"
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
          <span>Showing latest {studentsList.length} enrolled students</span>
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
              <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                <Calendar className="size-4.5 text-purple-600" />
                <span>Active Teachers</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Faculty members and availability status
              </p>
            </div>
            <Link
              href="/teacher/teacher_list"
              className="text-xs font-semibold text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 transition-colors"
            >
              <span>View Directory</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 mt-2">
            {teachersList.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center gap-1.5 text-zinc-400">
                <Calendar className="size-7 stroke-[1.5]" />
                <p className="text-xs font-medium">No active teachers found</p>
              </div>
            ) : (
              teachersList.map((teacher) => {
                const initials = getAvatarInitials(teacher.fullName, "TC")
                const colorClass = getAvatarColor(teacher.id || teacher.fullName || "")
                const availabilityText = teacher.isAvailable
                  ? "Available"
                  : !teacher.isActive
                  ? "Inactive"
                  : "Busy / In Session"

                return (
                  <div
                    key={teacher.id}
                    className="py-3 flex items-center justify-between gap-3 group hover:bg-zinc-50/70 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {teacher.profilePhotoUrl ? (
                        <img
                          src={teacher.profilePhotoUrl}
                          alt={teacher.fullName || "Teacher"}
                          className="size-9.5 rounded-full object-cover shrink-0 border border-zinc-200"
                        />
                      ) : (
                        <div
                          className={cn(
                            "size-9.5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs",
                            colorClass
                          )}
                        >
                          {initials}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <Link
                          href={`/teacher/${teacher.id}`}
                          className="text-xs font-semibold text-zinc-900 truncate hover:text-brand-orange transition-colors"
                        >
                          {teacher.fullName || "Teacher"}
                        </Link>
                        <span className="text-[11px] text-zinc-400 truncate">
                          {teacher.email || "Faculty Member"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
                          teacher.isAvailable
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
                            : "text-amber-700 bg-amber-50 border-amber-200/80"
                        )}
                      >
                        {availabilityText}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
          <span>Showing {teachersList.length} faculty instructors</span>
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
