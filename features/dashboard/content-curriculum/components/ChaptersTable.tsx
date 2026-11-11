"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { CurriculumChapterItem } from "../types/contentCurriculum.types"
import { BookOpen, Trash2, Hash } from "lucide-react"

export interface ChaptersTableProps {
  data: CurriculumChapterItem[]
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

export function ChaptersTable({
  data,
  pageSize = 10,
  serverPagination,
  onDelete,
}: ChaptersTableProps) {
  const columns: UniTableColumn<CurriculumChapterItem>[] = [
    {
      id: "name",
      header: "Chapter Title",
      cell: (_, row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="size-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0 text-blue-600 shadow-2xs">
            <BookOpen className="size-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-zinc-900 truncate">
              {row.name || "Untitled Chapter"}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium line-clamp-1">
              {row.description || "No description provided"}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "order",
      header: "Sequence Order",
      cell: (_, row) => (
        <div className="py-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
            <Hash className="size-3 text-zinc-400" />
            <span>Chapter {row.order}</span>
          </span>
        </div>
      ),
    },
    {
      id: "subjectName",
      header: "Subject / Course",
      cell: (_, row) => (
        <div className="py-1">
          <span className="text-xs font-semibold text-zinc-800">
            {row.subjectName || "Subject Level"}
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
            title="Delete Chapter"
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
        itemLabel="Chapters"
        emptyMessage="No chapters found."
      />
    </div>
  )
}

