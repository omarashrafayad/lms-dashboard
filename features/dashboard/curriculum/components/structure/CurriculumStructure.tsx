"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Layers,
  FileText,
  Plus,
  ArrowLeft,
  Pencil,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Chapter,
  Unit,
  LessonSummary,
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
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export interface CurriculumStructureProps {
  subject: CurriculumSubject
  chapters: Chapter[]
  isLoading?: boolean
  onEditSubject?: () => void
  onAddChapter?: () => void
}

// ----------------- Unit Component -----------------
function UnitItem({
  unit,
  subjectId,
  isUnitOpen,
  onToggleUnit,
  onAddLesson,
}: {
  unit: Unit
  subjectId: string
  isUnitOpen: boolean
  onToggleUnit: () => void
  onAddLesson: (unitId: string) => void
}) {
  const router = useRouter()
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
              <div
                key={lesson.id}
                onClick={() =>
                  router.push(`/curriculum/${subjectId}/lesson/${lesson.id}`)
                }
                className="flex items-center justify-between p-3.5 px-6 pl-12 hover:bg-zinc-50/90 transition-colors cursor-pointer group/lesson"
              >
                <div className="flex items-center gap-3.5">
                  <span className="size-6 rounded-md bg-lime-100 text-lime-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {lesson.lessonOrder ?? lesson.order ?? idx + 1}
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

// ----------------- Chapter Component -----------------
function ChapterItem({
  chapter,
  subjectId,
  isChapterOpen,
  onToggleChapter,
  expandedUnits,
  onToggleUnit,
  onAddUnit,
  onAddLesson,
}: {
  chapter: Chapter
  subjectId: string
  isChapterOpen: boolean
  onToggleChapter: () => void
  expandedUnits: Record<string, boolean>
  onToggleUnit: (unitId: string) => void
  onAddUnit: (chapterId: string) => void
  onAddLesson: (chapterId: string, unitId: string) => void
}) {
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

// ----------------- Main Structure Component -----------------
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
  >({
    [chapters[0]?.id || ""]: true,
  })

  const [expandedUnits, setExpandedUnits] = React.useState<
    Record<string, boolean>
  >({})

  // If first chapter loads, expand it by default
  React.useEffect(() => {
    if (chapters.length > 0 && !expandedChapters[chapters[0].id]) {
      setExpandedChapters((prev) => ({
        ...prev,
        [chapters[0].id]: true,
      }))
    }
  }, [chapters])

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }))
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back to Curriculum */}
        <Link
          href="/curriculum"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
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
        <div className="p-12 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-zinc-200/80">
          <Loader2 className="size-6 animate-spin text-brand-orange" />
          <span className="text-xs text-zinc-500 font-medium">
            Loading chapters...
          </span>
        </div>
      ) : chapters.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-zinc-200/80 text-center">
          <div className="size-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center">
            <BookOpen className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900">No chapters yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            This subject doesn&apos;t have any chapters added to its curriculum
            yet. Click below to create the first chapter.
          </p>
          <Button
            type="button"
            onClick={onAddChapter}
            className="mt-2 h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold"
          >
            <Plus className="size-4 mr-1.5" />
            <span>Add Chapter</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {chapters.map((chapter) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              subjectId={subject.id}
              isChapterOpen={!!expandedChapters[chapter.id]}
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
