"use client"

import * as React from "react"
import { ChevronDown, ChevronRight, Layers, Plus } from "lucide-react"
import { Unit, LessonSummary } from "../../types/curriculum.types"
import { LessonItem } from "./LessonItem"

export interface UnitItemProps {
  unit: Unit
  subjectId: string
  isUnitOpen: boolean
  onToggleUnit: () => void
  onAddLesson: (unitId: string) => void
}

export function UnitItem({
  unit,
  subjectId,
  isUnitOpen,
  onToggleUnit,
  onAddLesson,
}: UnitItemProps) {
  const lessons: LessonSummary[] = unit.lessons || []

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden">
      {/* Unit Header */}
      <button
        type="button"
        onClick={onToggleUnit}
        className="w-full flex items-center justify-between p-3.5 px-4 hover:bg-zinc-50/70 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {isUnitOpen ? (
            <ChevronDown className="size-4 text-zinc-500" />
          ) : (
            <ChevronRight className="size-4 text-zinc-400" />
          )}

          <div className="size-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Layers className="size-3.5" />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-xs text-zinc-900">
              {unit.name || unit.title}
            </span>
            {unit.description && (
              <span className="text-[11px] text-zinc-400 line-clamp-1">
                {unit.description}
              </span>
            )}
          </div>
        </div>

        <span className="text-xs text-zinc-400 font-normal">
          {lessons.length} lessons
        </span>
      </button>

      {/* Unit Lessons List */}
      {isUnitOpen && (
        <div className="flex flex-col border-t border-zinc-100 divide-y divide-zinc-100">
          {lessons.length > 0 ? (
            lessons.map((lesson, idx) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                subjectId={subjectId}
                index={idx}
              />
            ))
          ) : (
            <div className="p-4 text-center text-xs text-zinc-400">
              No lessons added yet.
            </div>
          )}

          {/* Add Lesson Button */}
          <div className="p-2.5 px-12 bg-zinc-50/40">
            <button
              type="button"
              onClick={() => onAddLesson(unit.id)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Lesson</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
