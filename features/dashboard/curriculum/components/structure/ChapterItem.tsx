"use client"

import * as React from "react"
import { ChevronDown, ChevronRight, BookOpen, Plus } from "lucide-react"
import { Chapter, Unit } from "../../types/curriculum.types"
import { UnitItem } from "./UnitItem"

export interface ChapterItemProps {
  chapter: Chapter
  subjectId: string
  isChapterOpen: boolean
  onToggleChapter: () => void
  expandedUnits: Record<string, boolean>
  onToggleUnit: (unitId: string) => void
  onAddUnit: (chapterId: string) => void
  onAddLesson: (chapterId: string, unitId: string) => void
}

export function ChapterItem({
  chapter,
  subjectId,
  isChapterOpen,
  onToggleChapter,
  expandedUnits,
  onToggleUnit,
  onAddUnit,
  onAddLesson,
}: ChapterItemProps) {
  const units: Unit[] = chapter.units || []

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden transition-all">
      {/* Chapter Header */}
      <button
        type="button"
        onClick={onToggleChapter}
        className="w-full flex items-center justify-between p-4 px-5 hover:bg-zinc-50/70 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {isChapterOpen ? (
            <ChevronDown className="size-4 text-zinc-500" />
          ) : (
            <ChevronRight className="size-4 text-zinc-400" />
          )}

          <div className="size-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <BookOpen className="size-4" />
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-sm text-zinc-900">
              {chapter.name || chapter.title}
            </span>
            {chapter.description && (
              <span className="text-xs text-zinc-400 line-clamp-1">
                {chapter.description}
              </span>
            )}
          </div>
        </div>

        <span className="text-xs text-zinc-400 font-normal">
          {units.length} units
        </span>
      </button>

      {/* Chapter Body: Units */}
      {isChapterOpen && (
        <div className="flex flex-col gap-3.5 p-4 pt-1 border-t border-zinc-100 bg-zinc-50/30">
          {units.length > 0 ? (
            units.map((unit) => (
              <UnitItem
                key={unit.id}
                unit={unit}
                subjectId={subjectId}
                isUnitOpen={!!expandedUnits[unit.id]}
                onToggleUnit={() => onToggleUnit(unit.id)}
                onAddLesson={(unitId) => onAddLesson(chapter.id, unitId)}
              />
            ))
          ) : (
            <div className="p-4 text-center text-xs text-zinc-400">
              No units added yet in this chapter.
            </div>
          )}

          {/* Add Unit Button */}
          <button
            type="button"
            onClick={() => onAddUnit(chapter.id)}
            className="w-full py-2.5 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50/80 text-xs font-medium text-zinc-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="size-3.5 text-zinc-500" />
            <span>Add Unit</span>
          </button>
        </div>
      )}
    </div>
  )
}
