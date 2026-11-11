"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { ContentQuizItem } from "../types/contentCurriculum.types"
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  Trash2,
  ListChecks,
} from "lucide-react"

export interface QuizzesTableProps {
  data: ContentQuizItem[]
  pageSize?: number
  serverPagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    onPageChange: (page: number) => void
    pageSizeOptions?: number[]
    onPageSizeChange?: (pageSize: number) => void
  }
  onDelete: (id: string) => void
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-"
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

export function QuizzesTable({
  data,
  pageSize = 10,
  serverPagination,
  onDelete,
}: QuizzesTableProps) {
  const columns: UniTableColumn<ContentQuizItem>[] = [
    {
      id: "title",
      header: "Quiz Title",
      cell: (_, row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="size-10 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs">
            <HelpCircle className="size-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-zinc-900 truncate">
              {row.title || "Untitled Quiz"}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              Assessment Quiz
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "lessonName",
      header: "Linked Lesson",
      cell: (_, row) => (
        <div className="py-1">
          <span className="text-xs font-semibold text-zinc-800">
            {row.lessonName || "General Assessment"}
          </span>
        </div>
      ),
    },
    {
      id: "questions",
      header: "Questions",
      cell: (_, row) => (
        <div className="py-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
            <ListChecks className="size-3.5 text-zinc-500" />
            <span>{row.questionsCount || 0} Questions</span>
          </span>
        </div>
      ),
    },
    {
      id: "passingScore",
      header: "Passing Score",
      cell: (_, row) => (
        <div className="py-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
            <Award className="size-3 text-emerald-600" />
            <span>{row.passingScore}% Min</span>
          </span>
        </div>
      ),
    },
    {
      id: "timeLimit",
      header: "Time Limit",
      cell: (_, row) => (
        <div className="py-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600">
            <Clock className="size-3.5 text-zinc-400" />
            <span>{row.timeLimit > 0 ? `${row.timeLimit} Mins` : "No Limit"}</span>
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Published",
      cell: (_, row) => (
        <div className="py-1">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              row.isPublished
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <CheckCircle2 className="size-3" />
            <span>{row.isPublished ? "Published" : "Draft"}</span>
          </span>
        </div>
      ),
    },
    {
      id: "createdAt",
      header: "Created Date",
      cell: (_, row) => (
        <div className="text-xs text-zinc-500 py-1">{formatDate(row.createdAt)}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDelete(row.id)}
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Quiz"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <UniTable
        data={data}
        columns={columns}
        pageSize={pageSize}
        serverPagination={serverPagination}
        getRowId={(row) => row.id}
        itemLabel="Quizzes"
        emptyMessage="No quizzes found."
      />
    </div>
  )
}

