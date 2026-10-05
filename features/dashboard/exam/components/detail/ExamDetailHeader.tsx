"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Eye,
  Copy,
  Archive,
  Pencil,
  ChevronRight,
} from "lucide-react"
import { ExamItem } from "../../types/exam.types"
import { ExamLevelBadge, ExamStatusBadge } from "../common/ExamBadges"
import { cn } from "@/lib/utils"

export type DetailTabType =
  | "overview"
  | "questions"
  | "students"
  | "analytics"
  | "history"

interface ExamDetailHeaderProps {
  exam: ExamItem
  activeTab: DetailTabType
  onTabChange: (tab: DetailTabType) => void
  onPreview: () => void
  onDuplicate: () => void
  onArchive: () => void
  onEdit: () => void
}

export function ExamDetailHeader({
  exam,
  activeTab,
  onTabChange,
  onPreview,
  onDuplicate,
  onArchive,
  onEdit,
}: ExamDetailHeaderProps) {
  const tabs: { key: DetailTabType; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "questions", label: "Questions" },
    { key: "students", label: "Students & Results" },
    { key: "analytics", label: "Analytics" },
    { key: "history", label: "Activity History" },
  ]

  // Type badge in the header of Image 2 is formatted as "Monthly Exam" (light gray badge)
  const typeDisplay = exam.type === "Monthly" ? "Monthly Exam" : exam.type === "Subject" ? "Subject Exam" : "Course Exam"

  return (
    <div className="flex flex-col gap-6">
      {/* Back to Exams Link matching Image 2 */}
      <div>
        <Link
          href="/academic/exams"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Exams</span>
        </Link>
      </div>

      {/* Title & Action Buttons Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Title & Badges */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
            {exam.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            {/* Gray Type Pill matching Image 2 */}
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-zinc-100/90 text-zinc-700 border border-zinc-200/60 shadow-2xs">
              {typeDisplay}
            </span>

            {/* Level Pill */}
            <ExamLevelBadge level={exam.level} />

            {/* Status Pill */}
            <ExamStatusBadge status={exam.status} />
          </div>
        </div>

        {/* Right Action Buttons matching Image 2 */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Preview Button linking to Student Preview */}
          <Link
            href={`/academic/exams/${exam.slug || exam.id}/preview`}
            className="h-10 px-4 rounded-xl border border-zinc-200/90 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Eye className="size-3.5 text-zinc-500" />
            <span>Preview</span>
          </Link>

          {/* Duplicate Button */}
          <button
            type="button"
            onClick={onDuplicate}
            className="h-10 px-4 rounded-xl border border-zinc-200/90 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Copy className="size-3.5 text-zinc-500" />
            <span>Duplicate</span>
          </button>

          {/* Archive Button */}
          <button
            type="button"
            onClick={onArchive}
            className="h-10 px-4 rounded-xl border border-zinc-200/90 bg-white text-xs font-semibold text-[#DC2626] hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Archive className="size-3.5 text-[#DC2626]" />
            <span>Archive</span>
          </button>

          {/* Edit Exam Button */}
          <button
            type="button"
            onClick={onEdit}
            className="h-10 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Pencil className="size-3.5" />
            <span>Edit Exam</span>
          </button>
        </div>
      </div>

      {/* "LINKED TO" Card matching Images 2, 3, 4, 5 */}
      <div className="w-full bg-white rounded-xl border border-zinc-200/80 px-5 py-3.5 flex flex-wrap items-center gap-3 shadow-2xs text-xs">
        <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
          LINKED TO
        </span>

        {/* Linked Type Pill */}
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60">
          {exam.linkedTo.type || "Subject"}
        </span>

        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2 text-zinc-600">
          <strong className="font-bold text-zinc-900">
            {exam.linkedTo.subject || exam.subject}
          </strong>
          <ChevronRight className="size-3.5 text-zinc-400" />
          <span>{exam.linkedTo.stage || exam.educationStage}</span>
          <ChevronRight className="size-3.5 text-zinc-400" />
          <span>{exam.linkedTo.term || exam.term}</span>
        </div>
      </div>

      {/* Detail Navigation Tabs matching Images 2, 3, 4, 5 */}
      <div className="flex items-center gap-8 border-b border-zinc-200/80 -mb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "pb-3.5 text-sm transition-all relative cursor-pointer",
              activeTab === tab.key
                ? "text-zinc-900 font-semibold"
                : "text-zinc-500 hover:text-zinc-800 font-medium"
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F59E0B] rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
