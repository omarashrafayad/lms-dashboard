"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { ContentPdfItem } from "../types/contentCurriculum.types"
import {
  FileText,
  ExternalLink,
  Trash2,
  CheckCircle2,
  XCircle,
  FileDown,
} from "lucide-react"

export interface PdfsTableProps {
  data: ContentPdfItem[]
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

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
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

export function PdfsTable({
  data,
  pageSize = 10,
  serverPagination,
  onDelete,
}: PdfsTableProps) {
  const columns: UniTableColumn<ContentPdfItem>[] = [
    {
      id: "title",
      header: "Document & Title",
      cell: (_, row) => (
        <div className="flex items-center gap-3 py-1">
          {row.bookImageUrl ? (
            <img
              src={row.bookImageUrl}
              alt={row.title || "PDF Cover"}
              className="size-10 rounded-xl object-cover border border-zinc-200 shrink-0 shadow-2xs"
            />
          ) : (
            <div className="size-10 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center shrink-0 text-rose-600 shadow-2xs">
              <FileText className="size-5" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-zinc-900 truncate">
              {row.title || "Untitled Document"}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              Size: {formatBytes(row.fileSize)}
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
            {row.lessonName || "General / Unassigned"}
          </span>
        </div>
      ),
    },
    {
      id: "fileUrl",
      header: "Document File",
      cell: (_, row) => {
        if (!row.fileUrl) return <span className="text-xs text-zinc-400">-</span>
        return (
          <a
            href={row.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200/70 transition-colors"
          >
            <FileDown className="size-3.5" />
            <span>Open PDF</span>
            <ExternalLink className="size-3 text-rose-400" />
          </a>
        )
      },
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
                <span>Enabled</span>
              </>
            ) : (
              <>
                <XCircle className="size-3" />
                <span>Disabled</span>
              </>
            )}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (_, row) => (
        <div className="py-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>{row.status || "Active"}</span>
          </span>
        </div>
      ),
    },
    {
      id: "createdAt",
      header: "Added Date",
      cell: (_, row) => (
        <div className="text-xs text-zinc-500 py-1">{formatDate(row.createdAt)}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (_, row) => (
        <div className="flex items-center gap-2">
          {row.fileUrl && (
            <a
              href={row.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              title="View PDF"
            >
              <ExternalLink className="size-4" />
            </a>
          )}
          <button
            type="button"
            onClick={() => onDelete(row.id)}
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Document"
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
        itemLabel="Documents"
        emptyMessage="No PDF documents found."
      />
    </div>
  )
}

