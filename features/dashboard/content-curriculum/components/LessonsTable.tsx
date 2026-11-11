"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { CurriculumLessonItem } from "../types/contentCurriculum.types"
import {
  GraduationCap,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Trash2,
  Video,
} from "lucide-react"

export interface LessonsTableProps {
  data: CurriculumLessonItem[]
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

export function LessonsTable({
  data,
  pageSize = 10,
  serverPagination,
  onDelete,
}: LessonsTableProps) {
  const columns: UniTableColumn<CurriculumLessonItem>[] = [
    {
      id: "name",
      header: "Lesson Title",
      cell: (_, row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="size-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 text-brand-orange shadow-2xs">
            <GraduationCap className="size-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 truncate">
                {row.name || "Untitled Lesson"}
              </span>
              <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded-md">
                #{row.lessonOrder || 1}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium line-clamp-1">
              {row.description || "Curriculum Lesson Material"}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "unitName",
      header: "Parent Unit",
      cell: (_, row) => (
        <div className="py-1">
          <span className="text-xs font-semibold text-zinc-800">
            {row.unitName || "Course Unit"}
          </span>
        </div>
      ),
    },
    {
      id: "accessType",
      header: "Access Type",
      cell: (_, row) => {
        const isPremium =
          row.accessType?.toLowerCase().includes("premium") ||
          row.accessType?.toLowerCase().includes("paid")
        const isFree = row.accessType?.toLowerCase().includes("free")

        return (
          <div className="py-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                isPremium
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : isFree
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-zinc-100 text-zinc-700 border-zinc-200"
              }`}
            >
              {isPremium && <Sparkles className="size-3 text-amber-600" />}
              <span>{row.accessType || "Standard"}</span>
            </span>
          </div>
        )
      },
    },
    {
      id: "duration",
      header: "Duration",
      cell: (_, row) => (
        <div className="py-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
            <Clock className="size-3.5 text-zinc-500" />
            <span>{row.duration ? `${row.duration} min` : "Standard"}</span>
          </span>
        </div>
      ),
    },
    {
      id: "video",
      header: "Video Media",
      cell: (_, row) => (
        <div className="py-1">
          {row.videoUrl ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
              <Video className="size-3.5" />
              <span>Available</span>
            </span>
          ) : (
            <span className="text-xs text-zinc-400">None</span>
          )}
        </div>
      ),
    },
    {
      id: "offline",
      header: "Offline Access",
      cell: (_, row) => (
        <div className="py-1">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              row.isOfflineAvailable
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-zinc-100 text-zinc-500 border-zinc-200"
            }`}
          >
            {row.isOfflineAvailable ? (
              <>
                <CheckCircle2 className="size-3" />
                <span>Yes</span>
              </>
            ) : (
              <>
                <XCircle className="size-3" />
                <span>No</span>
              </>
            )}
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
            title="Delete Lesson"
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
        itemLabel="Lessons"
        emptyMessage="No lessons found."
      />
    </div>
  )
}

