"use client"

import * as React from "react"
import { StudentProfile } from "../../types/studentProfile.types"

interface StudentLearningProgressProps {
  progress: StudentProfile["learningProgress"]
}

export function StudentLearningProgress({ progress }: StudentLearningProgressProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
      <h2 className="text-sm font-bold text-zinc-900">
        Learning Progress
      </h2>

      {/* Progress Bar & Label */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-normal">Overall Progress</span>
          <span className="text-zinc-500 font-semibold">{progress.overallProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-orange rounded-full transition-all duration-500"
            style={{ width: `${progress.overallProgress}%` }}
          />
        </div>
      </div>

      {/* 4 Metrics below */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-zinc-100">
        <div>
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            CURRENT LEVEL
          </div>
          <div className="text-sm font-bold text-zinc-900">
            {progress.currentLevel}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            COMPLETED LESSONS
          </div>
          <div className="text-sm font-bold text-zinc-900">
            {progress.completedLessons} / {progress.totalLessons}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            COMPLETED COURSES
          </div>
          <div className="text-sm font-bold text-zinc-900">
            {progress.completedCourses} / {progress.totalCourses}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            AVERAGE SCORE
          </div>
          <div className="text-sm font-bold text-zinc-900">
            {progress.averageScore}%
          </div>
        </div>
      </div>
    </div>
  )
}
