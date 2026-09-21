"use client"

import * as React from "react"
import { useTeacherSubjects, useTeacherLevels } from "../../hooks/useTeachers"
import { useAcademicStages } from "@/features/dashboard/reference-data/hooks/useReferenceData"
import { cn } from "@/lib/utils"

export interface TeacherTeachingSetupCardProps {
  selectedSubjectIds: string[]
  onToggleSubject: (id: string) => void
  selectedEducationStageIds: string[]
  onToggleEducationStage: (id: string) => void
  selectedTeachingLevelIds: string[]
  onToggleTeachingLevel: (id: string) => void
}

export function TeacherTeachingSetupCard({
  selectedSubjectIds,
  onToggleSubject,
  selectedEducationStageIds,
  onToggleEducationStage,
  selectedTeachingLevelIds,
  onToggleTeachingLevel,
}: TeacherTeachingSetupCardProps) {
  const { data: subjects = [] } = useTeacherSubjects()
  const { data: teachingLevels = [] } = useTeacherLevels()
  const { data: academicStages = [] } = useAcademicStages()

  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
      <h2 className="text-sm font-bold text-zinc-900 mb-1">
        Teaching Setup
      </h2>
      <p className="text-xs text-zinc-500 mb-5">
        Select the subjects, academic stages, and teaching levels this teacher is qualified to teach.
      </p>

      {/* Subjects Multi-select */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-zinc-700 mb-2">
          Subjects <span className="text-amber-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {subjects.map((sub) => {
            const isSelected = selectedSubjectIds.includes(sub.id)
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onToggleSubject(sub.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                  isSelected
                    ? "border-amber-400 bg-[#FFFBEB] text-amber-700 shadow-2xs font-semibold ring-1 ring-amber-400/40"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                )}
              >
                {sub.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Education Stages Multi-select */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-zinc-700 mb-2">
          Education Stages
        </label>
        <div className="flex flex-wrap gap-2">
          {academicStages.map((stage) => {
            const isSelected = selectedEducationStageIds.includes(stage.id)
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onToggleEducationStage(stage.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                  isSelected
                    ? "border-amber-400 bg-[#FFFBEB] text-amber-700 shadow-2xs font-semibold ring-1 ring-amber-400/40"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                )}
              >
                {stage.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Teaching Levels Multi-select */}
      <div>
        <label className="block text-xs font-medium text-zinc-700 mb-2">
          Teaching Levels
        </label>
        <div className="flex flex-wrap gap-2">
          {teachingLevels.map((lvl) => {
            const isSelected = selectedTeachingLevelIds.includes(lvl.id)
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onToggleTeachingLevel(lvl.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                  isSelected
                    ? "border-amber-400 bg-[#FFFBEB] text-amber-700 shadow-2xs font-semibold ring-1 ring-amber-400/40"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                )}
              >
                {lvl.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
