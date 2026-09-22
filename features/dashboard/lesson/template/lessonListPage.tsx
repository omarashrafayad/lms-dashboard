"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { LessonListFilters } from "../components/LessonListFilters"
import { LessonListTable } from "../components/LessonListTable"
import { useLessonList, useDeleteLesson } from "../hooks/useLessons"
import { LessonFilterState } from "../types/lesson.types"

const initialFilters: LessonFilterState = {
  search: "",
  stage: "all",
  year: "all",
  system: "all",
  term: "all",
  subject: "all",
  chapter: "all",
  unit: "all",
  status: "all",
  access: "all",
  offline: "all",
}

export default function LessonListPage() {
  const router = useRouter()
  const [filters, setFilters] = React.useState<LessonFilterState>(initialFilters)

  const { data: lessons = [], isLoading } = useLessonList(filters)
  const deleteMutation = useDeleteLesson()

  const handleFilterChange = (updated: Partial<LessonFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
  }

  const handleDeleteLesson = (id: string) => {
    deleteMutation.mutate(id)
  }

  const filteredLessons = React.useMemo(() => {
    if (!lessons) return []
    return lessons.filter((lesson) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchTitle = lesson.title.toLowerCase().includes(query)
        const matchSubj = lesson.subject.toLowerCase().includes(query)
        const matchChap = lesson.chapter.toLowerCase().includes(query)
        const matchUnit = lesson.unit.toLowerCase().includes(query)
        if (!matchTitle && !matchSubj && !matchChap && !matchUnit) {
          return false
        }
      }

      if (filters.stage !== "all" && lesson.stage.toLowerCase() !== filters.stage.toLowerCase()) {
        return false
      }

      if (filters.year !== "all" && lesson.year.toLowerCase() !== filters.year.toLowerCase()) {
        return false
      }

      if (filters.system !== "all" && lesson.system.toLowerCase() !== filters.system.toLowerCase()) {
        return false
      }

      if (filters.term !== "all" && lesson.term.toLowerCase() !== filters.term.toLowerCase()) {
        return false
      }

      if (filters.subject !== "all" && lesson.subject.toLowerCase() !== filters.subject.toLowerCase()) {
        return false
      }

      if (filters.chapter !== "all" && lesson.chapter.toLowerCase() !== filters.chapter.toLowerCase()) {
        return false
      }

      if (filters.unit !== "all" && lesson.unit.toLowerCase() !== filters.unit.toLowerCase()) {
        return false
      }

      if (filters.status !== "all" && lesson.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false
      }

      if (filters.access !== "all" && lesson.access.toLowerCase() !== filters.access.toLowerCase()) {
        return false
      }

      if (filters.offline !== "all") {
        if (filters.offline === "Available" && !lesson.offlineAvailable) return false
        if (filters.offline === "Unavailable" && lesson.offlineAvailable) return false
      }

      return true
    })
  }, [lessons, filters])

  return (
    <div className="flex flex-col min-h-full">
      {/* Header matching Screenshot 1 */}
      <PageHeader
        title="Lessons"
        description="Manage lesson content, videos, PDFs, quizzes, and student access."
      />

      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        {/* Action and Count Bar */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              All Lessons
            </h2>
            <span className="text-xs text-zinc-400 font-normal">
              {filteredLessons.length} of {lessons.length} lessons shown
            </span>
          </div>

          <Button
            type="button"
            onClick={() => router.push("/lessons/add")}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white font-medium rounded-xl h-10 px-4 gap-2 shadow-2xs cursor-pointer transition-all hover:brightness-95"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Lesson</span>
          </Button>
        </div>

        {/* 3-Row Filters */}
        <LessonListFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Table / Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs">
            <Loader2 className="size-6 text-brand-orange animate-spin mr-2" />
            <span className="text-sm text-zinc-500">Loading lessons...</span>
          </div>
        ) : (
          <LessonListTable
            data={filteredLessons}
            onDeleteLesson={handleDeleteLesson}
          />
        )}
      </main>
    </div>
  )
}
