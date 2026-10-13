"use client"

import * as React from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import {
  Chapter,
  CurriculumSubject,
  CreateUnitPayload,
  CreateLessonPayload,
} from "../../types/curriculum.types"
import {
  useCreateUnit,
  useCreateLesson,
} from "../../hooks/useCurriculum"
import { AddUnitModal } from "./AddUnitModal"
import { AddLessonModal } from "./AddLessonModal"
import { ChapterItem } from "./ChapterItem"
import { CurriculumStructureHeader } from "./CurriculumStructureHeader"
import { CurriculumStructureEmptyState } from "./CurriculumStructureEmptyState"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

export interface CurriculumStructureProps {
  subject: CurriculumSubject
  chapters: Chapter[]
  isLoading?: boolean
  onEditSubject?: () => void
  onAddChapter?: () => void
}

export function CurriculumStructure({
  subject,
  chapters,
  isLoading = false,
  onEditSubject,
  onAddChapter,
}: CurriculumStructureProps) {
  // Modals state
  const [isAddUnitOpen, setIsAddUnitOpen] = React.useState(false)
  const [targetChapterId, setTargetChapterId] = React.useState<string | null>(null)

  const [isAddLessonOpen, setIsAddLessonOpen] = React.useState(false)
  const [targetUnitId, setTargetUnitId] = React.useState<string | null>(null)

  // Mutations
  const createUnitMutation = useCreateUnit()
  const createLessonMutation = useCreateLesson()

  // Expand state
  const [expandedChapters, setExpandedChapters] = React.useState<
    Record<string, boolean>
  >({})

  const [expandedUnits, setExpandedUnits] = React.useState<
    Record<string, boolean>
  >({})

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const isCurrentlyOpen =
        prev[chapterId] !== undefined
          ? prev[chapterId]
          : chapterId === chapters[0]?.id
      return {
        ...prev,
        [chapterId]: !isCurrentlyOpen,
      }
    })
  }

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }))
  }

  // Handle Add Unit Submit to backend
  const handleAddUnitSubmit = async (payload: CreateUnitPayload) => {
    try {
      await createUnitMutation.mutateAsync(payload)
      toast.success("Unit created successfully!")
      setIsAddUnitOpen(false)
      // Automatically expand this chapter
      setExpandedChapters((prev) => ({ ...prev, [payload.chapterId]: true }))
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  // Handle Add Lesson Submit to backend
  const handleAddLessonSubmit = async (payload: CreateLessonPayload) => {
    try {
      await createLessonMutation.mutateAsync(payload)
      toast.success("Lesson created successfully!")
      setIsAddLessonOpen(false)
      // Automatically expand this unit
      setExpandedUnits((prev) => ({ ...prev, [payload.unitId]: true }))
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px]">
      {/* Top Action Bar */}
      <CurriculumStructureHeader
        subject={subject}
        onEditSubject={onEditSubject}
        onAddChapter={onAddChapter}
      />

      {/* Curriculum Structure Title Section */}
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-bold text-zinc-900 tracking-tight">
          Curriculum Structure
        </h2>
        <span className="text-xs text-zinc-400 font-normal">
          {chapters.length} chapters
        </span>
      </div>

      {/* Chapters Accordion List */}
      {isLoading ? (
        <LoadingSpinner title="Loading curriculum structure..."/>
      ) : chapters.length === 0 ? (
        <CurriculumStructureEmptyState onAddChapter={onAddChapter} />
      ) : (
        <div className="flex flex-col gap-4">
          {chapters.map((chapter) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              subjectId={subject.id}
              isChapterOpen={
                expandedChapters[chapter.id] !== undefined
                  ? expandedChapters[chapter.id]
                  : chapter.id === chapters[0]?.id
              }
              onToggleChapter={() => toggleChapter(chapter.id)}
              expandedUnits={expandedUnits}
              onToggleUnit={toggleUnit}
              onAddUnit={(chapterId) => {
                setTargetChapterId(chapterId)
                setIsAddUnitOpen(true)
              }}
              onAddLesson={(chapterId, unitId) => {
                setTargetChapterId(chapterId)
                setTargetUnitId(unitId)
                setIsAddLessonOpen(true)
              }}
            />
          ))}
        </div>
      )}

      {/* Add Unit Modal */}
      <AddUnitModal
        open={isAddUnitOpen}
        onOpenChange={setIsAddUnitOpen}
        chapterId={targetChapterId}
        onAddUnit={handleAddUnitSubmit}
        isSubmitting={createUnitMutation.isPending}
      />

      {/* Add Lesson Modal */}
      <AddLessonModal
        open={isAddLessonOpen}
        onOpenChange={setIsAddLessonOpen}
        chapterId={targetChapterId}
        unitId={targetUnitId}
        onAddLesson={handleAddLessonSubmit}
        isSubmitting={createLessonMutation.isPending}
      />
    </div>
  )
}

// Re-export subcomponents for flexibility
export { ChapterItem } from "./ChapterItem"
export { UnitItem } from "./UnitItem"
export { LessonItem } from "./LessonItem"
export { CurriculumStructureHeader } from "./CurriculumStructureHeader"
export { CurriculumStructureEmptyState } from "./CurriculumStructureEmptyState"
