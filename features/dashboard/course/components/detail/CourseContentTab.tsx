"use client"

import * as React from "react"
import {
  GripVertical,
  Plus,
  Play,
  FileText,
  HelpCircle,
  Eye,
  Trash2,
  Clock,
} from "lucide-react"
import { CourseLessonItem, CourseLessonType } from "../../types/course.types"
import { CreateCourseLessonDrawer } from "./CreateCourseLessonDrawer"
import { toast } from "sonner"

import { useRouter } from "next/navigation"

export interface CourseContentTabProps {
  initialLessons: CourseLessonItem[]
  courseId?: string
}

export function CourseContentTab({
  initialLessons,
  courseId = "course-math-fundamentals",
}: CourseContentTabProps) {
  const router = useRouter()
  const [lessons, setLessons] = React.useState<CourseLessonItem[]>(initialLessons)
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false)

  const handleDelete = (id: string) => {
    setLessons((prev) => {
      const filtered = prev.filter((l) => l.id !== id)
      return filtered.map((l, i) => ({ ...l, order: i + 1 }))
    })
    toast.success("Lesson removed from course")
  }

  const handleAddLesson = (newLesson: CourseLessonItem) => {
    setLessons((prev) => [...prev, newLesson])
  }

  const getLessonTypeIcon = (type: CourseLessonType) => {
    switch (type) {
      case "Video":
        return <Play className="size-4 fill-amber-500/20 text-[#F59E0B]" />
      case "Reading":
        return <FileText className="size-4 text-[#F59E0B]" />
      case "Quiz":
        return <HelpCircle className="size-4 text-[#F59E0B]" />
    }
  }

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-200">
      {/* Header matching Image 3 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
            Course Content
          </h3>
          <span className="text-xs text-zinc-400 font-normal">
            {lessons.length} lessons · drag to reorder
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreateDrawerOpen(true)}
            className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Create Course Lesson</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateDrawerOpen(true)}
            className="h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Add Lessons</span>
          </button>
        </div>
      </div>

      {/* Lesson Cards List matching Image 3 */}
      <div className="flex flex-col gap-3">
        {lessons.map((lesson, idx) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-4 flex items-center justify-between gap-4 hover:border-zinc-300 transition-all group"
          >
            {/* Left: Drag Handle, Number, Icon, Title & Meta */}
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                className="text-zinc-300 hover:text-zinc-500 cursor-grab active:cursor-grabbing p-1 shrink-0"
              >
                <GripVertical className="size-4" />
              </button>

              <div className="size-7 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-700 font-bold text-xs flex items-center justify-center shrink-0">
                {lesson.order || idx + 1}
              </div>

              {/* Lesson Type Icon Box */}
              <div className="size-9 rounded-xl bg-amber-50/80 flex items-center justify-center shrink-0 border border-amber-100">
                {getLessonTypeIcon(lesson.type)}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-zinc-900 truncate">
                  {lesson.title}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-normal mt-0.5">
                  <span>{lesson.type}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3 text-zinc-400" />
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: View & Delete Actions matching Image 3 */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => router.push(`/courses/${courseId}/lessons/${lesson.id}`)}
                className="h-8 px-3 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="size-3.5 text-zinc-400" />
                <span>View</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(lesson.id)}
                className="size-8 rounded-xl border border-zinc-200 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 hover:border-rose-200 transition-colors flex items-center justify-center cursor-pointer"
                title="Delete lesson"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Drawer */}
      <CreateCourseLessonDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onAddLesson={handleAddLesson}
        totalExistingLessons={lessons.length}
      />
    </div>
  )
}
