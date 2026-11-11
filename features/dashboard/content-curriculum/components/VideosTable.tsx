"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { ContentVideoItem } from "../types/contentCurriculum.types"
import { VideoPreviewModal } from "./VideoPreviewModal"
import {
  Video,
  Play,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react"

export interface VideosTableProps {
  data: ContentVideoItem[]
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

export function VideosTable({
  data,
  pageSize = 10,
  serverPagination,
  onDelete,
}: VideosTableProps) {
  const [previewVideo, setPreviewVideo] = React.useState<ContentVideoItem | null>(null)

  const columns: UniTableColumn<ContentVideoItem>[] = [
    {
      id: "title",
      header: "Video & Lesson",
      cell: (_, row) => (
        <div className="flex items-center gap-3 py-1">
          <button
            type="button"
            onClick={() => setPreviewVideo(row)}
            className="size-10 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 flex items-center justify-center shrink-0 text-brand-orange group transition-all cursor-pointer shadow-2xs"
            title="Play Video"
          >
            <Play className="size-4.5 fill-brand-orange/20 group-hover:scale-110 transition-transform" />
          </button>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-zinc-900 truncate">
              {row.title || "Untitled Video"}
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
            {row.lessonName || "Unassigned"}
          </span>
        </div>
      ),
    },
    {
      id: "duration",
      header: "Duration",
      cell: (_, row) => (
        <div className="py-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
            <Clock className="size-3.5 text-zinc-500" />
            <span>{row.duration > 0 ? `${row.duration} min` : "Short"}</span>
          </span>
        </div>
      ),
    },
    {
      id: "tier",
      header: "Access Tier",
      cell: (_, row) => (
        <div className="py-1 flex items-center gap-1.5">
          {row.isFree && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Free
            </span>
          )}
          {row.isPremium && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="size-3" />
              <span>Premium</span>
            </span>
          )}
          {!row.isFree && !row.isPremium && (
            <span className="text-xs text-zinc-400">Standard</span>
          )}
        </div>
      ),
    },
    {
      id: "offline",
      header: "Offline Download",
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
      header: "Uploaded Date",
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
            onClick={() => setPreviewVideo(row)}
            className="p-1.5 text-zinc-500 hover:text-brand-orange hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            title="Watch Video"
          >
            <Video className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row.id)}
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Video"
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
        itemLabel="Videos"
        emptyMessage="No educational videos found."
      />

      <VideoPreviewModal
        video={previewVideo}
        open={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
      />
    </div>
  )
}

