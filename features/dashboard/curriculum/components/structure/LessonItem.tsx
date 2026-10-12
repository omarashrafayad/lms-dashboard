"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileText, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { LessonSummary } from "../../types/curriculum.types"

export interface LessonItemProps {
  lesson: LessonSummary
  subjectId: string
  index: number
}

export function LessonItem({ lesson, subjectId, index }: LessonItemProps) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/curriculum/${subjectId}/lesson/${lesson.id}`)}
      className="flex items-center justify-between p-3.5 px-6 pl-12 hover:bg-zinc-50/90 transition-colors cursor-pointer group/lesson"
    >
      <div className="flex items-center gap-3.5">
        <span className="size-6 rounded-md bg-lime-100 text-lime-800 font-bold text-xs flex items-center justify-center shrink-0">
          {lesson.lessonOrder ?? lesson.order ?? index + 1}
        </span>
        <FileText className="size-4 text-zinc-400 group-hover/lesson:text-zinc-600 transition-colors" />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-zinc-800 group-hover/lesson:text-brand-orange transition-colors">
            {lesson.name || lesson.title}
          </span>
          {lesson.description && (
            <span className="text-[11px] text-zinc-400 line-clamp-1">
              {lesson.description}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {lesson.duration ? (
          <span className="text-[11px] text-zinc-400 font-medium">
            {lesson.duration}m
          </span>
        ) : null}
        {lesson.accessType ? (
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
              lesson.accessType === "Free"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-purple-50 text-purple-700 border-purple-200"
            )}
          >
            {lesson.accessType}
          </span>
        ) : null}
        <ChevronRight className="size-4 text-zinc-400 group-hover/lesson:text-zinc-700 transition-colors" />
      </div>
    </div>
  )
}
