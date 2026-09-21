"use client"

import * as React from "react"
import { Play, FileText, HelpCircle } from "lucide-react"

export interface LessonContentModelProps {
  videosCount?: number
  pdfCount?: number
  quizCount?: number
}

export function LessonContentModelCard({
  videosCount = 3,
  pdfCount = 1,
  quizCount = 1,
}: LessonContentModelProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
      <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
        LESSON CONTENT MODEL
      </span>

      <span className="text-xs font-semibold text-zinc-800">
        Lesson
      </span>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs font-medium text-zinc-700">
          <Play className="size-3.5 text-zinc-400 fill-zinc-400" />
          <span>{videosCount} Videos</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-zinc-700">
          <FileText className="size-3.5 text-zinc-400" />
          <span>{pdfCount} PDF</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-zinc-700">
          <HelpCircle className="size-3.5 text-zinc-400" />
          <span>{quizCount} Quiz</span>
        </div>
      </div>
    </div>
  )
}
