"use client"

import * as React from "react"
import Link from "next/link"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import { ApiTeacher } from "../types/teacher.types"
import { cn } from "@/lib/utils"
import { TeacherRowActions } from "./TeacherRowActions"

export interface TeacherTableProps {
  data: ApiTeacher[]
}

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
]

function getAvatarInitials(name?: string): string {
  const parts = (name || "T").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "TC"
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

export function TeacherTable({ data }: TeacherTableProps) {
  const columns = React.useMemo<UniTableColumn<ApiTeacher>[]>(
    () => [
      {
        id: "teacher",
        header: "TEACHER",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => {
          const initials = getAvatarInitials(teacher.fullName)
          const colorClass = getAvatarColor(teacher.id || teacher.fullName || "")
          return (
            <Link
              href={`/teacher/${teacher.id}`}
              className="flex items-center gap-3 group/teacher cursor-pointer"
            >
              <div
                className={cn(
                  "size-9 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 select-none transition-transform group-hover/teacher:scale-105",
                  colorClass
                )}
              >
                {initials}
              </div>
              <span className="font-bold text-sm text-zinc-900 leading-tight group-hover/teacher:text-brand-orange transition-colors">
                {teacher.fullName || "Unnamed Teacher"}
              </span>
            </Link>
          )
        },
      },
      {
        id: "email_phone",
        header: "EMAIL / PHONE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-700 leading-tight">
              {teacher.email || "—"}
            </span>
            <span className="text-xs text-zinc-400 font-normal mt-0.5">
              {teacher.phoneNumber || "—"}
            </span>
          </div>
        ),
      },
      {
        id: "subjects",
        header: "SUBJECTS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => {
          const subjectSet = new Set<string>()
          if (teacher.specializations && Array.isArray(teacher.specializations)) {
            teacher.specializations.forEach((s) => {
              if (s.subjectName) subjectSet.add(s.subjectName)
            })
          }
          const subjects = Array.from(subjectSet)
          return (
            <span className="text-sm text-zinc-600">
              {subjects.length > 0 ? subjects.join(", ") : "General"}
            </span>
          )
        },
      },
      {
        id: "availability",
        header: "AVAILABILITY",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => {
          const status =
            teacher.isAvailable === false
              ? "Unavailable"
              : !teacher.isActive
              ? "Offline"
              : "Available"

          const config =
            status === "Available"
              ? { pill: "text-emerald-700 bg-emerald-50 border-emerald-200/70", dot: "bg-emerald-500" }
              : status === "Unavailable"
              ? { pill: "text-rose-700 bg-rose-50 border-rose-200/70", dot: "bg-rose-500" }
              : { pill: "text-zinc-600 bg-zinc-100 border-zinc-200", dot: "bg-zinc-400" }

          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                config.pill
              )}
            >
              <span className={cn("size-1.5 rounded-full", config.dot)} />
              {status}
            </span>
          )
        },
      },
      {
        id: "upcoming_sessions",
        header: "UPCOMING SESSIONS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase text-center",
        className: "text-center",
        cell: (_, teacher) => (
          <span className="text-sm font-bold text-zinc-800">
            {teacher.availabilitySlots?.length ?? 0}
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => {
          const isActive = teacher.isActive
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                isActive
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200/70"
                  : "text-zinc-600 bg-zinc-100 border-zinc-200"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isActive ? "bg-emerald-500" : "bg-zinc-400"
                )}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          )
        },
      },
      {
        id: "last_active",
        header: "LAST ACTIVE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => (
          <span className="text-sm text-zinc-500">
            {formatDate(teacher.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        className: "w-10 text-right",
        cell: (_, teacher) => <TeacherRowActions teacher={teacher} />,
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
        emptyMessage="No teachers found matching your filters"
        className="rounded-2xl border-zinc-200/80 shadow-2xs"
      />
    </div>
  )
}
