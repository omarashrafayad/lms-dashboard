"use client"

import * as React from "react"
import Link from "next/link"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import { Teacher, TeacherAvailabilityStatus } from "../types/teacher.types"
import { cn } from "@/lib/utils"
import { TeacherRowActions } from "./TeacherRowActions"

export interface TeacherTableProps {
  data: Teacher[]
}

export function TeacherTable({ data }: TeacherTableProps) {
  const columns = React.useMemo<UniTableColumn<Teacher>[]>(
    () => [
      {
        id: "teacher",
        header: "TEACHER",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => (
          <Link
            href={`/teacher/${teacher.id}`}
            className="flex items-center gap-3 group/teacher cursor-pointer"
          >
            <div
              className={cn(
                "size-9 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 select-none transition-transform group-hover/teacher:scale-105",
                teacher.avatarColorClass
              )}
            >
              {teacher.avatarInitials}
            </div>
            <span className="font-bold text-sm text-zinc-900 leading-tight group-hover/teacher:text-brand-orange transition-colors">
              {teacher.name}
            </span>
          </Link>
        ),
      },
      {
        id: "email_phone",
        header: "EMAIL / PHONE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-700 leading-tight">
              {teacher.email}
            </span>
            <span className="text-xs text-zinc-400 font-normal mt-0.5">
              {teacher.phone}
            </span>
          </div>
        ),
      },
      {
        id: "subjects",
        header: "SUBJECTS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => (
          <span className="text-sm text-zinc-600">
            {teacher.subjects.join(", ")}
          </span>
        ),
      },
      {
        id: "availability",
        header: "AVAILABILITY",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => {
          const status = teacher.availability
          let pillClasses = "text-zinc-600 bg-zinc-50 border-zinc-200"
          let dotColor = "bg-zinc-400"

          if (status === "Available") {
            pillClasses = "text-emerald-700 bg-emerald-50 border-emerald-200/70"
            dotColor = "bg-emerald-500"
          } else if (status === "Busy") {
            pillClasses = "text-amber-700 bg-amber-50 border-amber-200/70"
            dotColor = "bg-amber-500"
          } else if (status === "Offline") {
            pillClasses = "text-zinc-600 bg-zinc-100 border-zinc-200"
            dotColor = "bg-zinc-400"
          } else if (status === "Unavailable") {
            pillClasses = "text-rose-700 bg-rose-50 border-rose-200/70"
            dotColor = "bg-rose-500"
          }

          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                pillClasses
              )}
            >
              <span className={cn("size-1.5 rounded-full", dotColor)} />
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
            {teacher.upcomingSessions}
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, teacher) => {
          const isActive = teacher.status === "Active"
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
              {teacher.status}
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
            {teacher.lastActive}
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
