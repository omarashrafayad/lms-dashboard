"use client"

import * as React from "react"
import { BookOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface CurriculumStructureEmptyStateProps {
  onAddChapter?: () => void
}

export function CurriculumStructureEmptyState({
  onAddChapter,
}: CurriculumStructureEmptyStateProps) {
  return (
    <div className="p-12 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-zinc-200/80 text-center">
      <div className="size-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center">
        <BookOpen className="size-6" />
      </div>
      <h3 className="text-sm font-bold text-zinc-900">No chapters yet</h3>
      <p className="text-xs text-zinc-500 max-w-sm">
        This subject doesn&apos;t have any chapters added to its curriculum yet.
        Click below to create the first chapter.
      </p>
      <Button
        type="button"
        onClick={onAddChapter}
        className="mt-2 h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold cursor-pointer"
      >
        <Plus className="size-4 mr-1.5 stroke-[2.5]" />
        <span>Add Chapter</span>
      </Button>
    </div>
  )
}
