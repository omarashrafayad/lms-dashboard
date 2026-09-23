"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { CourseListItem, CourseLevel, CourseStatus } from "../../types/course.types"
import { CourseRowActions } from "./CourseRowActions"

export interface CourseTableProps {
  courses: CourseListItem[]
  isLoading?: boolean
}

export function CourseTable({ courses, isLoading = false }: CourseTableProps) {
  const router = useRouter()

  const getLevelBadge = (level: CourseLevel) => {
    switch (level) {
      case "Beginner":
        return "bg-sky-50 text-[#0284C7] border-sky-200/60"
      case "Intermediate":
        return "bg-purple-50 text-[#7E22CE] border-purple-200/60"
      case "Advanced":
        return "bg-[#FEF9C3] text-[#A16207] border-[#FDE047]/60"
      default:
        return "bg-zinc-50 text-zinc-600 border-zinc-200"
    }
  }

  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case "Published":
        return {
          badge: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
          dot: "bg-[#16A34A]",
        }
      case "Draft":
        return {
          badge: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
          dot: "bg-[#D97706]",
        }
      case "Archived":
        return {
          badge: "bg-zinc-100 text-zinc-600 border-zinc-200",
          dot: "bg-zinc-400",
        }
      default:
        return {
          badge: "bg-zinc-50 text-zinc-600 border-zinc-200",
          dot: "bg-zinc-400",
        }
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="py-3.5 px-5 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                COURSE
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                LEVEL
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                EDUCATION STAGE
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                SUBJECT
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase text-center">
                LESSONS
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase text-center">
                STUDENTS
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                STATUS
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                LAST UPDATED
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-400">
                  No courses found matching your criteria.
                </td>
              </tr>
            ) : (
              courses.map((course) => {
                const statusStyle = getStatusBadge(course.status)

                return (
                  <tr
                    key={course.id}
                    onClick={() => router.push(`/courses/${course.id}`)}
                    className="hover:bg-zinc-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Course Name & Subtitle */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                          {course.title}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-normal mt-0.5">
                          {course.system} · {course.academicYear}
                        </span>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getLevelBadge(
                          course.level
                        )}`}
                      >
                        {course.level}
                      </span>
                    </td>

                    {/* Education Stage */}
                    <td className="py-4 px-4 text-zinc-700 whitespace-nowrap font-medium">
                      {course.stage}
                    </td>

                    {/* Subject */}
                    <td className="py-4 px-4 text-zinc-700 whitespace-nowrap font-medium">
                      {course.subject}
                    </td>

                    {/* Lessons */}
                    <td className="py-4 px-4 text-zinc-700 text-center font-medium">
                      {course.lessonsCount}
                    </td>

                    {/* Students */}
                    <td className="py-4 px-4 text-zinc-700 text-center font-medium">
                      {course.studentsCount}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.badge}`}
                      >
                        <span className={`size-1.5 rounded-full ${statusStyle.dot}`} />
                        {course.status}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="py-4 px-4 text-zinc-500 whitespace-nowrap font-normal">
                      {course.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-4 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CourseRowActions course={course} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
