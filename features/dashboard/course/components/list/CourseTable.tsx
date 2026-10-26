"use client"

import * as React from "react"
import Link from "next/link"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import { ApiCourse } from "../../types/course.types"
import { cn } from "@/lib/utils"
import { CourseRowActions } from "./CourseRowActions"
import EmptyState from "@/components/shared/EmptyState"
import { BookOpen } from "lucide-react"

export interface CourseTableProps {
  courses: ApiCourse[]
  isLoading?: boolean
  serverPagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    onPageChange: (page: number) => void
    pageSizeOptions?: number[]
    onPageSizeChange?: (pageSize: number) => void
  }
  pageSize?: number
}

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
]

function getAvatarInitials(name?: string): string {
  const parts = (name || "C").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "CR"
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

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Recently"
  try {
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }
  } catch {}
  return "Recently"
}

export function CourseTable({ courses, serverPagination, pageSize }: CourseTableProps) {
  const getLevelBadge = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-sky-50 text-[#0284C7] border-sky-200/60"
      case "intermediate":
        return "bg-purple-50 text-[#7E22CE] border-purple-200/60"
      case "advanced":
        return "bg-[#FEF9C3] text-[#A16207] border-[#FDE047]/60"
      default:
        return "bg-zinc-50 text-zinc-600 border-zinc-200"
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "published":
      case "active":
        return {
          badge: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
          dot: "bg-[#16A34A]",
        }
      case "draft":
        return {
          badge: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
          dot: "bg-[#D97706]",
        }
      case "archived":
      case "inactive":
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

  const columns = React.useMemo<UniTableColumn<ApiCourse>[]>(
    () => [
      {
        id: "course",
        header: "COURSE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, course) => {
          const courseName = course.name || course.title || "Untitled Course"
          const instructor = course.leadInstructor || course.instructor || "Lead Instructor"
          const initials = getAvatarInitials(courseName)
          const colorClass = getAvatarColor(course.id || courseName)
          const duration = course.estimatedDurationHours
            ? `${course.estimatedDurationHours}h`
            : course.duration || ""

          return (
            <Link
              href={`/courses/${course.id}`}
              className="flex items-center gap-3 group/course cursor-pointer"
            >
              <div
                className={cn(
                  "size-9 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 select-none transition-transform group-hover/course:scale-105",
                  colorClass
                )}
              >
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-zinc-900 leading-tight group-hover/course:text-amber-600 transition-colors">
                  {courseName}
                </span>
                <span className="text-[11px] text-zinc-400 font-normal mt-0.5">
                  By {instructor}
                  {duration ? ` · ${duration}` : ""}
                </span>
              </div>
            </Link>
          )
        },
      },
      {
        id: "category",
        header: "CATEGORY",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, course) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60 shadow-2xs">
            {course.category || "—"}
          </span>
        ),
      },
      {
        id: "level",
        header: "LEVEL",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, course) => {
          const level = course.difficultyLevel || course.level || "Beginner"
          return (
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                getLevelBadge(level)
              )}
            >
              {level}
            </span>
          )
        },
      },
      {
        id: "language",
        header: "LANGUAGE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, course) => (
          <span className="text-xs text-zinc-600 font-medium">
            {course.instructionLanguage || "English"}
          </span>
        ),
      },
      {
        id: "duration",
        header: "DURATION",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, course) => (
          <span className="text-xs font-bold text-zinc-900">
            {course.estimatedDurationHours !== undefined
              ? `${course.estimatedDurationHours} Hours`
              : course.duration || "—"}
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, course) => {
          const status = course.status || "Draft"
          const statusStyle = getStatusBadge(status)
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                statusStyle.badge
              )}
            >
              <span className={cn("size-1.5 rounded-full", statusStyle.dot)} />
              {status}
            </span>
          )
        },
      },
      {
        id: "createdAt",
        header: "CREATED",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, course) => (
          <span className="text-xs text-zinc-500">
            {formatDate(course.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        className: "w-10 text-right",
        cell: (_, course) => <CourseRowActions course={course} />,
      },
    ],
    []
  )

  return (
    <div className="w-full">
      <UniTable
        data={courses}
        columns={columns}
        enablePagination={false}
        serverPagination={serverPagination}
        pageSize={pageSize}
        itemLabel="courses"
        emptyMessage={
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="No courses found matching your criteria"
            actionLabel="Add Course"
            actionHref="/courses/add"
          />
        }
        className="rounded-2xl border-zinc-200/80 shadow-2xs"
      />
    </div>
  )
}
