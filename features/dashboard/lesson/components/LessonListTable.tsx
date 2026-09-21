"use client"

import * as React from "react"
import Link from "next/link"
import { Play, FileText, HelpCircle, Download, Check, Minus } from "lucide-react"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import { LessonListItem } from "../types/lesson.types"
import { cn } from "@/lib/utils"
import { LessonRowActions } from "./LessonRowActions"

export interface LessonListTableProps {
  data: LessonListItem[]
  onDeleteLesson: (id: string) => void
}

export function LessonListTable({ data, onDeleteLesson }: LessonListTableProps) {
  const columns = React.useMemo<UniTableColumn<LessonListItem>[]>(
    () => [
      {
        id: "lesson",
        header: "LESSON",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, lesson) => (
          <Link
            href={`/lessons/${lesson.id}`}
            className="flex items-center gap-3 group/item cursor-pointer"
          >
            {/* Thumbnail Box */}
            <div className="relative w-12 h-9 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs border border-zinc-700/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-700 opacity-90" />
              <Play className="size-3.5 text-white/80 fill-white/80 relative z-10" />
            </div>

            <span className="font-semibold text-sm text-zinc-900 group-hover/item:text-brand-orange transition-colors">
              {lesson.title}
            </span>
          </Link>
        ),
      },
      {
        id: "subject",
        header: "SUBJECT",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, lesson) => (
          <span className="text-sm text-zinc-600">{lesson.subject}</span>
        ),
      },
      {
        id: "chapter",
        header: "CHAPTER",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, lesson) => (
          <span className="text-sm text-zinc-600">{lesson.chapter}</span>
        ),
      },
      {
        id: "unit",
        header: "UNIT",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, lesson) => (
          <span className="text-sm text-zinc-600">{lesson.unit}</span>
        ),
      },
      {
        id: "videos",
        header: "VIDEOS",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, lesson) => (
          <div className="flex items-center gap-1.5 text-sm text-zinc-700">
            <Play className="size-3 text-zinc-500 fill-zinc-500" />
            <span>{lesson.videosCount}</span>
          </div>
        ),
      },
      {
        id: "pdf",
        header: "PDF",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, lesson) => {
          if (lesson.hasPdf) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-100/70 text-purple-700 text-xs font-semibold">
                <FileText className="size-3.5" />
                <Check className="size-3 stroke-[2.5]" />
              </span>
            )
          }
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-400 text-xs font-semibold">
              <FileText className="size-3.5" />
              <Minus className="size-3 stroke-[2.5]" />
            </span>
          )
        },
      },
      {
        id: "quiz",
        header: "QUIZ",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, lesson) => {
          if (lesson.hasQuiz) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-100/70 text-purple-700 text-xs font-semibold">
                <HelpCircle className="size-3.5" />
                <Check className="size-3 stroke-[2.5]" />
              </span>
            )
          }
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-400 text-xs font-semibold">
              <HelpCircle className="size-3.5" />
              <Minus className="size-3 stroke-[2.5]" />
            </span>
          )
        },
      },
      {
        id: "access",
        header: "ACCESS",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, lesson) => (
          <span className="text-xs font-medium text-zinc-600">{lesson.access}</span>
        ),
      },
      {
        id: "offline",
        header: "OFFLINE",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, lesson) => {
          if (lesson.offlineAvailable) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-100/70 text-purple-700 text-xs font-semibold">
                <Download className="size-3.5" />
                <Check className="size-3 stroke-[2.5]" />
              </span>
            )
          }
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-400 text-xs font-semibold">
              <Download className="size-3.5" />
              <Minus className="size-3 stroke-[2.5]" />
            </span>
          )
        },
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, lesson) => {
          const isPublished = lesson.status === "Published"
          const isDraft = lesson.status === "Draft"

          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                isPublished
                  ? "text-brand-green bg-emerald-50/80 border-emerald-200/60"
                  : isDraft
                  ? "text-sky-700 bg-sky-50 border-sky-200/60"
                  : "text-zinc-600 bg-zinc-100 border-zinc-200"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isPublished
                    ? "bg-brand-green"
                    : isDraft
                    ? "bg-sky-500"
                    : "bg-zinc-400"
                )}
              />
              {lesson.status}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "",
        className: "w-10 text-right",
        cell: (_, lesson) => (
          <LessonRowActions lesson={lesson} onDelete={onDeleteLesson} />
        ),
      },
    ],
    [onDeleteLesson]
  )

  return (
    <div className="w-full">
      <UniTable
        data={data}
        columns={columns}
        enablePagination={false}
        emptyMessage="No lessons found matching your filters"
        className="rounded-2xl border-zinc-200/80 shadow-2xs"
      />
    </div>
  )
}
