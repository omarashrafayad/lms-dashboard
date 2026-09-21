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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Chapter, CurriculumSubject } from "../../types/curriculum.types"
import { AddUnitModal } from "./AddUnitModal"
import { AddLessonModal } from "./AddLessonModal"

export interface CurriculumStructureProps {
  subject: CurriculumSubject
  chapters: Chapter[]
  onEditSubject: () => void
  onAddChapter?: () => void
}

export function CurriculumStructure({
  subject,
  chapters: initialChapters,
  onEditSubject,
  onAddChapter,
}: CurriculumStructureProps) {
  const router = useRouter()
  const [chapters, setChapters] = React.useState<Chapter[]>(initialChapters)

  // Modals state
  const [isAddUnitOpen, setIsAddUnitOpen] = React.useState(false)
  const [targetChapterId, setTargetChapterId] = React.useState<string | null>(null)

  const [isAddLessonOpen, setIsAddLessonOpen] = React.useState(false)
  const [targetUnitId, setTargetUnitId] = React.useState<string | null>(null)

  // Expand state
  const [expandedChapters, setExpandedChapters] = React.useState<Record<string, boolean>>({
    "ch-1": true,
    [initialChapters[0]?.id || ""]: true,
  })

  const [expandedUnits, setExpandedUnits] = React.useState<Record<string, boolean>>({
    "u-1-1": true,
    [initialChapters[0]?.units[0]?.id || ""]: true,
  })

  React.useEffect(() => {
    setChapters(initialChapters)
  }, [initialChapters])

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }))
  }

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }))
  }

  // Calculate totals
  const totalChapters = chapters.length
  const totalUnits = chapters.reduce((sum, ch) => sum + ch.units.length, 0)
  const totalLessons = chapters.reduce(
    (sum, ch) =>
      sum + ch.units.reduce((uSum, u) => uSum + (u.lessons?.length || 0), 0),
    0
  )

  const handleAddLessonSubmit = (
    chapterId: string,
    unitId: string,
    title: string
  ) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id !== chapterId) return ch
        return {
          ...ch,
          lessonsCount: ch.lessonsCount + 1,
          units: ch.units.map((u) => {
            if (u.id !== unitId) return u
            const newIndex = (u.lessons?.length || 0) + 1
            const newLesson = {
              id: `les-${Date.now()}`,
              unitId,
              chapterId,
              subjectId: subject.id,
              title,
              order: newIndex,
              status: "Published" as const,
            }
            return {
              ...u,
              lessonsCount: u.lessonsCount + 1,
              lessons: [...(u.lessons || []), newLesson],
            }
          }),
        }
      })
    )
  }

  const handleAddUnitSubmit = (chapterId: string, title: string) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id !== chapterId) return ch
        const newUnitIndex = ch.units.length + 1
        const newUnitId = `u-${chapterId}-${Date.now()}`
        const newUnit = {
          id: newUnitId,
          chapterId,
          title,
          order: newUnitIndex,
          lessonsCount: 0,
          lessons: [],
        }
        setExpandedUnits((e) => ({ ...e, [newUnitId]: true }))
        return {
          ...ch,
          unitsCount: ch.unitsCount + 1,
          units: [...ch.units, newUnit],
        }
      })
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px]">
      {/* Top Action Bar matching Screenshot 2 */}
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
            Active
          </span>

          <Button
            type="button"
            variant="outline"
            onClick={onEditSubject}
            className="h-9 px-3.5 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
          >
            <Pencil className="size-3.5" />
            <span>Edit Subject</span>
          </Button>

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
          {totalChapters} chapters • {totalUnits} units • {totalLessons} lessons
        </span>
      </div>

      {/* Chapters Accordion List */}
      <div className="flex flex-col gap-4">
        {chapters.map((chapter) => {
          const isChapterOpen = !!expandedChapters[chapter.id]

          return (
            <div
              key={chapter.id}
              className="rounded-2xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden transition-all"
            >
              {/* Chapter Header */}
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
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

                  <span className="font-bold text-sm text-zinc-900">
                    {chapter.title}
                  </span>
                </div>

                <span className="text-xs text-zinc-400 font-normal">
                  {chapter.units.length} units •{" "}
                  {chapter.units.reduce(
                    (sum, u) => sum + (u.lessons?.length || 0),
                    0
                  )}{" "}
                  lessons
                </span>
              </button>

              {/* Chapter Body: Units */}
              {isChapterOpen && (
                <div className="flex flex-col gap-3.5 p-4 pt-1 border-t border-zinc-100 bg-zinc-50/30">
                  {chapter.units.map((unit) => {
                    const isUnitOpen = !!expandedUnits[unit.id]

                    return (
                      <div
                        key={unit.id}
                        className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden"
                      >
                        {/* Unit Header */}
                        <button
                          type="button"
                          onClick={() => toggleUnit(unit.id)}
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

                            <span className="font-semibold text-xs text-zinc-900">
                              {unit.title}
                            </span>
                          </div>

                          <span className="text-xs text-zinc-400 font-normal">
                            {unit.lessons?.length || 0} lessons
                          </span>
                        </button>

                        {/* Unit Lessons List */}
                        {isUnitOpen && (
                          <div className="flex flex-col border-t border-zinc-100 divide-y divide-zinc-100">
                            {unit.lessons && unit.lessons.length > 0 ? (
                              unit.lessons.map((lesson, idx) => (
                                <div
                                  key={lesson.id}
                                  onClick={() =>
                                    router.push(
                                      `/curriculum/${subject.id}/lesson/${lesson.id}`
                                    )
                                  }
                                  className="flex items-center justify-between p-3.5 px-6 pl-12 hover:bg-zinc-50/90 transition-colors cursor-pointer group/lesson"
                                >
                                  <div className="flex items-center gap-3.5">
                                    <span className="size-6 rounded-md bg-lime-100 text-lime-800 font-bold text-xs flex items-center justify-center shrink-0">
                                      {idx + 1}
                                    </span>
                                    <FileText className="size-4 text-zinc-400 group-hover/lesson:text-zinc-600 transition-colors" />
                                    <span className="text-xs font-medium text-zinc-800 group-hover/lesson:text-brand-orange transition-colors">
                                      {lesson.title}
                                    </span>
                                  </div>

                                  <ChevronRight className="size-4 text-zinc-400 group-hover/lesson:text-zinc-700 transition-colors" />
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
                                onClick={() => {
                                  setTargetChapterId(chapter.id)
                                  setTargetUnitId(unit.id)
                                  setIsAddLessonOpen(true)
                                }}
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
                  })}

                  {/* Add Unit Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setTargetChapterId(chapter.id)
                      setIsAddUnitOpen(true)
                    }}
                    className="w-full py-2.5 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50/80 text-xs font-medium text-zinc-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5 text-zinc-500" />
                    <span>Add Unit</span>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Unit Modal */}
      <AddUnitModal
        open={isAddUnitOpen}
        onOpenChange={setIsAddUnitOpen}
        chapterId={targetChapterId}
        onAddUnit={handleAddUnitSubmit}
      />

      {/* Add Lesson Modal */}
      <AddLessonModal
        open={isAddLessonOpen}
        onOpenChange={setIsAddLessonOpen}
        chapterId={targetChapterId}
        unitId={targetUnitId}
        onAddLesson={handleAddLessonSubmit}
      />
    </div>
  )
}
