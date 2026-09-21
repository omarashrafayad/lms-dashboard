"use client"

import * as React from "react"
import Link from "next/link"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import { CurriculumSubject } from "../types/curriculum.types"
import { cn } from "@/lib/utils"
import { CurriculumRowActions } from "./CurriculumRowActions"

export interface CurriculumTableProps {
  data: CurriculumSubject[]
  onEditSubject: (subject: CurriculumSubject) => void
  onDeleteSubject: (id: string) => void
}

export function CurriculumTable({
  data,
  onEditSubject,
  onDeleteSubject,
}: CurriculumTableProps) {
  const columns = React.useMemo<UniTableColumn<CurriculumSubject>[]>(
    () => [
      {
        id: "subject_name",
        header: "SUBJECT NAME",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, subject) => (
          <Link
            href={`/curriculum/${subject.id}`}
            className="flex items-center gap-3 group/item cursor-pointer"
          >
            <div
              className={cn(
                "size-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 select-none transition-transform group-hover/item:scale-105",
                subject.avatarColorClass
              )}
            >
              {subject.avatarLetter}
            </div>
            <span className="font-semibold text-sm text-zinc-900 group-hover/item:text-brand-orange transition-colors">
              {subject.name}
            </span>
          </Link>
        ),
      },
      {
        id: "stage",
        header: "EDUCATION STAGE",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, subject) => (
          <span className="text-sm text-zinc-600">{subject.stage}</span>
        ),
      },
      {
        id: "year",
        header: "ACADEMIC YEAR",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, subject) => (
          <span className="text-sm text-zinc-600">{subject.year}</span>
        ),
      },
      {
        id: "system",
        header: "EDUCATION SYSTEM",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, subject) => (
          <span className="text-sm text-zinc-600">{subject.system}</span>
        ),
      },
      {
        id: "term",
        header: "TERM",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, subject) => (
          <span className="text-sm text-zinc-600">{subject.term}</span>
        ),
      },
      {
        id: "chapters",
        header: "CHAPTERS",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, subject) => (
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md bg-zinc-100 text-xs font-semibold text-zinc-700">
            {subject.chaptersCount}
          </span>
        ),
      },
      {
        id: "units",
        header: "UNITS",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, subject) => (
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md bg-zinc-100 text-xs font-semibold text-zinc-700">
            {subject.unitsCount}
          </span>
        ),
      },
      {
        id: "lessons",
        header: "LESSONS",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, subject) => (
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md bg-zinc-100 text-xs font-semibold text-zinc-700">
            {subject.lessonsCount}
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, subject) => {
          const isActive = subject.status === "Active"
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
              {subject.status}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "",
        className: "w-10 text-right",
        cell: (_, subject) => (
          <CurriculumRowActions
            subject={subject}
            onEdit={onEditSubject}
            onDelete={onDeleteSubject}
          />
        ),
      },
    ],
    [onEditSubject, onDeleteSubject]
  )

  return (
    <div className="w-full">
      <UniTable
        data={data}
        columns={columns}
        enablePagination={false}
        emptyMessage="No subjects found matching your filters"
        className="rounded-2xl border-zinc-200/80 shadow-2xs"
      />
    </div>
  )
}
