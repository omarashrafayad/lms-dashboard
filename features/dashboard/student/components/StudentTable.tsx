"use client"

import * as React from "react"
import Link from "next/link"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import { ApiStudent } from "../types/student.types"
import { cn } from "@/lib/utils"
import { StudentRowActions } from "./StudentRowActions"
import EmptyState from "@/components/shared/EmptyState"
import { User2 } from "lucide-react"

export interface StudentTableProps {
  data: ApiStudent[]
}

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
]

function getAvatarInitials(name?: string): string {
  const parts = (name || "S").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "ST"
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
      })
    }
  } catch {}
  return "Recently"
}

export function StudentTable({ data }: StudentTableProps) {
  const columns = React.useMemo<UniTableColumn<ApiStudent>[]>(
    () => [
      {
        id: "student",
        header: "STUDENT",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => {
          const initials = getAvatarInitials(student.fullName)
          const colorClass = getAvatarColor(student.id || student.fullName || "")
          const code = `STD-${(student.id || "").slice(0, 5).toUpperCase()}`
          return (
            <Link
              href={`/student/${student.id}`}
              className="flex items-center gap-3 group/student cursor-pointer"
            >
              <div
                className={cn(
                  "size-9 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 select-none transition-transform group-hover/student:scale-105",
                  colorClass
                )}
              >
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-zinc-900 leading-tight group-hover/student:text-brand-orange transition-colors">
                  {student.fullName || "Unnamed Student"}
                </span>
                <span className="text-[11px] text-zinc-400 font-normal mt-0.5">
                  {code}
                </span>
              </div>
            </Link>
          )
        },
      },
      {
        id: "email_phone",
        header: "EMAIL / PHONE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-700 leading-tight">
              {student.email || "—"}
            </span>
            <span className="text-xs text-zinc-400 font-normal mt-0.5">
              {student.phoneNumber || "—"}
            </span>
          </div>
        ),
      },
      {
        id: "education_stage",
        header: "EDUCATION STAGE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => (
          <span className="text-sm text-zinc-600">
            {student.educationStage || "—"}
          </span>
        ),
      },
      {
        id: "grade",
        header: "GRADE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => (
          <span className="text-sm text-zinc-600">
            {student.grade || "—"}
          </span>
        ),
      },
      {
        id: "average_score",
        header: "AVERAGE SCORE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => (
          <span className="text-sm font-bold text-zinc-900">
            {student.averageScore !== undefined ? `${student.averageScore}%` : "85%"}
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => {
          const isActive = student.isActive
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                isActive
                  ? "text-brand-green bg-emerald-50/80 border-emerald-200/60"
                  : "text-zinc-600 bg-zinc-50 border-zinc-200"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isActive ? "bg-brand-green" : "bg-zinc-400"
                )}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          )
        },
      },
      {
        id: "last_activity",
        header: "LAST ACTIVITY",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => (
          <span className="text-sm text-zinc-500">
            {formatDate(student.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        className: "w-10 text-right",
        cell: (_, student) => <StudentRowActions student={student} />,
      },
    ],
    []
  )

  return (
    <div className="w-full">
      <UniTable
        data={data}
        columns={columns}
        enablePagination={false}
        emptyMessage={
          <EmptyState
            icon={User2}
            title="No students found"
            description="No students found matching your filters"
            actionLabel="Add student"
            actionHref="/student/add"
          />
        }
        className="rounded-2xl border-zinc-200/80 shadow-2xs"
      />
    </div>
  )
}
