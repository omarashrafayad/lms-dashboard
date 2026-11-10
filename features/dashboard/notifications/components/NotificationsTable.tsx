"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { ApiNotification } from "../types/notifications.types"
import {
  Eye,
  Trash2,
  Globe,
  Clock,
  Users,
  AlertCircle,
  Pencil,
  Send,
  Loader2,
} from "lucide-react"

export interface NotificationsTableProps {
  notifications: ApiNotification[]
  onView: (notification: ApiNotification) => void
  onEdit: (notification: ApiNotification) => void
  onTogglePublish: (notification: ApiNotification) => void
  onDelete: (id: string) => void
  isToggling?: string | null
  isDeleting?: string | null
  serverPagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    onPageChange: (page: number) => void
    pageSizeOptions?: number[]
    onPageSizeChange?: (pageSize: number) => void
  }
}

export function NotificationsTable({
  notifications,
  onView,
  onEdit,
  onTogglePublish,
  onDelete,
  isToggling,
  isDeleting,
  serverPagination,
}: NotificationsTableProps) {
  const getAudienceLabel = (notification: ApiNotification) => {
    if (notification.audienceLabel) return notification.audienceLabel

    switch (notification.audience || notification.targetRole) {
      case "students":
        return "Students Only"
      case "teachers":
        return "Teachers & Instructors"
      case "parents":
        return "Parents & Guardians"
      case "course":
        return "Specific Course"
      case "plan":
        return "Specific Plan"
      default:
        return "All Users (General)"
    }
  }

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/70">
            <AlertCircle className="size-3 text-rose-600" />
            Urgent
          </span>
        )
      case "important":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
            Important
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
            Normal
          </span>
        )
    }
  }

  const columns: UniTableColumn<ApiNotification>[] = [
    {
      id: "title",
      header: "Notification & Summary",
      cell: (_, row) => (
        <div className="flex flex-col min-w-[220px] max-w-[360px] py-1">
          <span className="text-xs font-bold text-zinc-900 line-clamp-1">
            {row.title}
          </span>
          <span className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
            {row.summary || row.content}
          </span>
        </div>
      ),
    },
    {
      id: "audience",
      header: "Target Recipients",
      cell: (_, row) => {
        const aud = row.audience || row.targetRole || "all"
        return (
          <div className="flex items-center gap-1.5 py-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                aud === "all"
                  ? "bg-sky-50 text-sky-800 border-sky-200/60"
                  : aud === "students"
                  ? "bg-purple-50 text-purple-800 border-purple-200/60"
                  : aud === "teachers"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200/60"
                  : "bg-amber-50 text-amber-800 border-amber-200/60"
              }`}
            >
              <Users className="size-3" />
              <span className="truncate max-w-[180px]">{getAudienceLabel(row)}</span>
            </span>
          </div>
        )
      },
    },
    {
      id: "priority",
      header: "Priority & Topic",
      cell: (_, row) => (
        <div className="flex flex-col gap-1 py-1">
          <div>{getPriorityBadge(row.priority)}</div>
          {row.category && (
            <span className="text-[10px] text-zinc-400 capitalize">
              {row.category.replace("_", " ")}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (_, row) => (
        <div className="py-1">
          {row.isPublished ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
              <Clock className="size-3 text-zinc-400" />
              Draft
            </span>
          )}
        </div>
      ),
    },
    {
      id: "createdAt",
      header: "Created / Published",
      cell: (_, row) => {
        const rawDate = row.publishedAt || row.createdAt
        if (!rawDate) return <span className="text-xs text-zinc-400">—</span>
        const d = new Date(rawDate)
        return (
          <span className="text-xs text-zinc-500 whitespace-nowrap">
            {d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onView(row)}
            className="h-8 px-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="View details"
          >
            <Eye className="size-3.5 text-zinc-500" />
            <span>View</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(row)}
            className="size-8 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            title="Edit notification"
          >
            <Pencil className="size-3.5 text-zinc-600" />
          </button>

          <button
            type="button"
            disabled={isToggling === row.id}
            onClick={() => onTogglePublish(row)}
            className={`h-8 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50 ${
              row.isPublished
                ? "border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-800"
                : "border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800"
            }`}
            title={row.isPublished ? "Convert to Draft" : "Publish now"}
          >
            {isToggling === row.id ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Globe className="size-3.5" />
            )}
            <span>{row.isPublished ? "Draft" : "Publish"}</span>
          </button>

          <button
            type="button"
            disabled={isDeleting === row.id}
            onClick={() => onDelete(row.id)}
            className="size-8 rounded-xl border border-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-zinc-400 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            title="Delete notification"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <UniTable
        data={notifications}
        columns={columns}
        enablePagination={true}
        pageSize={10}
        serverPagination={serverPagination}
        getRowId={(row) => row.id}
        itemLabel="Notifications"
        emptyMessage="No notifications or announcements found."
      />
    </div>
  )
}
