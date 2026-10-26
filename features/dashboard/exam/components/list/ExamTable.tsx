"use client"

import * as React from "react"
import Link from "next/link"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import { ApiExam } from "../../types/exam.types"
import {
  ExamLevelBadge,
  ExamStatusBadge,
  ExamTypeBadge,
} from "../common/ExamBadges"
import { ExamRowActions } from "./ExamRowActions"
import EmptyState from "@/components/shared/EmptyState"
import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ExamTableProps {
  exams: ApiExam[]
  onEdit?: (exam: ApiExam) => void
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
  const parts = (name || "E").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "EX"
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

export function ExamTable({ exams, onEdit, serverPagination, pageSize }: ExamTableProps) {
  const columns = React.useMemo<UniTableColumn<ApiExam>[]>(
    () => [
      {
        id: "exam",
        header: "EXAM",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, exam) => {
          const initials = getAvatarInitials(exam.title)
          const colorClass = getAvatarColor(exam.id || exam.title)
          const subtext = exam.month
            ? `${exam.academicYear || ""} · ${exam.month}`
            : exam.courseName
            ? `Course: ${exam.courseName}`
            : exam.academicYear || "Academic Assessment"

          return (
            <Link
              href={`/academic/exams/${exam.slug || exam.id}`}
              className="flex items-center gap-3 group/exam cursor-pointer"
            >
              <div
                className={cn(
                  "size-9 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 select-none transition-transform group-hover/exam:scale-105",
                  colorClass
                )}
              >
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-zinc-900 leading-tight group-hover/exam:text-amber-600 transition-colors">
                  {exam.title}
                </span>
                <span className="text-[11px] text-zinc-400 font-normal mt-0.5">
                  {subtext}
                </span>
              </div>
            </Link>
          )
        },
      },
      {
        id: "type",
        header: "TYPE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, exam) => <ExamTypeBadge type={exam.examType || exam.type || "Monthly"} />,
      },
      {
        id: "level",
        header: "LEVEL",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, exam) => <ExamLevelBadge level={exam.level || "Beginner"} />,
      },
      {
        id: "subject_course",
        header: "SUBJECT / COURSE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, exam) => {
          const label =
            exam.courseName ||
            (exam.subjects && exam.subjects.length > 0 ? exam.subjects.join(", ") : null) ||
            exam.subject ||
            "—"
          return <span className="text-xs font-medium text-zinc-700">{label}</span>
        },
      },
      {
        id: "questions",
        header: "QUESTIONS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, exam) => {
          const count =
            exam.questionCount !== undefined
              ? exam.questionCount
              : exam.questionsCount !== undefined
              ? exam.questionsCount
              : exam.questions?.length || 0
          return (
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-900 leading-tight">
                {count}
              </span>
              <span className="text-[11px] text-zinc-400 leading-tight">Questions</span>
            </div>
          )
        },
      },
      {
        id: "duration",
        header: "DURATION",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, exam) => (
          <span className="text-xs font-medium text-zinc-700">
            {exam.durationMinutes ? `${exam.durationMinutes} min` : exam.duration || "—"}
          </span>
        ),
      },
      {
        id: "students",
        header: "STUDENTS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, exam) => (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-900 leading-tight">
              {exam.studentCount !== undefined ? exam.studentCount : exam.studentsCount || 0}
            </span>
            <span className="text-[11px] text-zinc-400 leading-tight">Students</span>
          </div>
        ),
      },
      {
        id: "pass_rate",
        header: "PASS RATE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, exam) => (
          <span className="text-xs font-medium text-zinc-700">
            {exam.passRate !== undefined ? `${exam.passRate}%` : "—"}
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, exam) => <ExamStatusBadge status={exam.status || "Draft"} />,
      },
      {
        id: "created",
        header: "CREATED",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, exam) => (
          <span className="text-xs text-zinc-500">
            {formatDate(exam.createdAt || exam.lastUpdated)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        className: "w-10 text-right",
        cell: (_, exam) => <ExamRowActions exam={exam} onEdit={onEdit} />,
      },
    ],
    [onEdit]
  )

  return (
    <div className="w-full">
      <UniTable
        data={exams}
        columns={columns}
        enablePagination={false}
        serverPagination={serverPagination}
        pageSize={pageSize}
        itemLabel="exams"
        emptyMessage={
          <EmptyState
            icon={GraduationCap}
            title="No exams found"
            description="No exams found matching your criteria"
            actionLabel="Add Exam"
            actionHref="/academic/exams/add"
          />
        }
        className="rounded-2xl border-zinc-200/80 shadow-2xs"
      />
    </div>
  )
}
