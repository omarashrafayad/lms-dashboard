"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CurriculumSubject } from "../../types/curriculum.types"

export interface CurriculumStructureHeaderProps {
  subject: CurriculumSubject
  onEditSubject?: () => void
  onAddChapter?: () => void
}

export function CurriculumStructureHeader({
  subject,
  onEditSubject,
  onAddChapter,
}: CurriculumStructureHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Left: Back to Curriculum */}
      <Link
        href="/curriculum"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Curriculum</span>
      </Link>

      {/* Right Actions: Status Badge, Edit Subject, Add Chapter */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border text-brand-green bg-emerald-50/80 border-emerald-200/60">
          <span className="size-1.5 rounded-full bg-brand-green" />
          {subject.status || "Active"}
        </span>

        {onEditSubject && (
          <Button
            type="button"
            variant="outline"
            onClick={onEditSubject}
            className="h-9 px-3.5 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
          >
            <Pencil className="size-3.5" />
            <span>Edit Subject</span>
          </Button>
        )}

        <Button
          type="button"
          onClick={onAddChapter}
          className="h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Add Chapter</span>
        </Button>
      </div>
    </div>
  )
}
