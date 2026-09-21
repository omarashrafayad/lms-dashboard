"use client"

import * as React from "react"
import Link from "next/link"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import { Student } from "../types/student.types"
import { cn } from "@/lib/utils"
import { StudentRowActions } from "./StudentRowActions"

export interface StudentTableProps {
  data: Student[]
}

export function StudentTable({ data }: StudentTableProps) {
  const columns = React.useMemo<UniTableColumn<Student>[]>(
    () => [
      {
        id: "student",
        header: "STUDENT",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => (
          <Link
            href={`/student/${student.id}`}
            className="flex items-center gap-3 group/student cursor-pointer"
          >
            <div
              className={cn(
                "size-9 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 select-none transition-transform group-hover/student:scale-105",
                student.avatarColorClass
              )}
            >
              {student.avatarInitials}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-zinc-900 leading-tight group-hover/student:text-brand-orange transition-colors">
                {student.name}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal mt-0.5">
                {student.code}
              </span>
            </div>
          </Link>
        ),
      },
      {
        id: "email_phone",
        header: "EMAIL / PHONE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-700 leading-tight">
              {student.email}
            </span>
            <span className="text-xs text-zinc-400 font-normal mt-0.5">
              {student.phone}
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
            {student.stage}
          </span>
        ),
      },
      {
        id: "grade",
        header: "GRADE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => (
          <span className="text-sm text-zinc-600">
            {student.grade}
          </span>
        ),
      },
      {
        id: "average_score",
        header: "AVERAGE SCORE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => (
          <span className="text-sm font-bold text-zinc-900">
            {student.averageScore}%
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, student) => {
          const isActive = student.status === "Active"
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
              {student.status}
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
            {student.lastActivity}
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
        emptyMessage="No students found matching your filters"
        className="rounded-2xl border-zinc-200/80 shadow-2xs"
      />
    </div>
  )
}
