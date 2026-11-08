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
  Video,
  Loader2,
} from "lucide-react"
import { CourseLessonItem, CourseLessonType } from "../../types/course.types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useCourseLessons } from "../../hooks/useCourses"
import { useCreateLesson, useDeleteLesson } from "@/features/dashboard/curriculum/hooks/useCurriculum"
import { AddLessonModal } from "@/features/dashboard/curriculum/components/structure/AddLessonModal"
import { AddVideoModal } from "@/features/dashboard/curriculum/components/lesson/AddVideoModal"
import { CreateLessonPayload } from "@/features/dashboard/curriculum/types/curriculum.types"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

export interface CourseContentTabProps {
  initialLessons?: CourseLessonItem[]
  courseId: string
}

export function CourseContentTab({
  initialLessons = [],
  courseId,
}: CourseContentTabProps) {
  const router = useRouter()

  // Real backend lessons for this course
  const {
    data: serverLessons,
    isLoading: isLessonsLoading,
    refetch,
  } = useCourseLessons(courseId)

  // Mutations
  const createLessonMutation = useCreateLesson()
  const deleteLessonMutation = useDeleteLesson()

  // Modal states
  const [isAddLessonOpen, setIsAddLessonOpen] = React.useState(false)
  const [isAddVideoOpen, setIsAddVideoOpen] = React.useState(false)
  const [targetLessonForVideo, setTargetLessonForVideo] = React.useState<{
    id: string
    title: string
  } | null>(null)
  const [deletingLessonId, setDeletingLessonId] = React.useState<string | null>(null)

  // Merged lessons: prioritize server lessons when available
  const lessons: CourseLessonItem[] = React.useMemo(() => {
    if (serverLessons && Array.isArray(serverLessons) && serverLessons.length > 0) {
      return serverLessons.map((item: any, idx: number): CourseLessonItem => ({
        id: item.id,
        order: item.lessonOrder ?? idx + 1,
        title: item.name || item.title || `Lesson ${idx + 1}`,
        type: item.videoUrl ? "Video" : "Reading",
        duration: item.duration ? `${item.duration} min` : "30 min",
        offlineAvailable: item.isOfflineAvailable ?? true,
        description: item.description,
        videoUrl: item.videoUrl,
      }))
    }
    return initialLessons || []
  }, [serverLessons, initialLessons])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return
    try {
      setDeletingLessonId(id)
      await deleteLessonMutation.mutateAsync(id)
      toast.success("Lesson deleted successfully")
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeletingLessonId(null)
    }
  }

  const handleAddLessonSubmit = async (payload: CreateLessonPayload) => {
    try {
      const created = await createLessonMutation.mutateAsync({
        ...payload,
        courseId,
      })
      toast.success("Lesson created successfully!")
      setIsAddLessonOpen(false)
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleOpenAddVideo = (lessonId: string, lessonTitle: string) => {
    setTargetLessonForVideo({ id: lessonId, title: lessonTitle })
    setIsAddVideoOpen(true)
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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
            Course Content
          </h3>
          <span className="text-xs text-zinc-400 font-normal">
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddLessonOpen(true)}
            className="h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Add Lesson</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLessonsLoading && lessons.length === 0 ? (
        <div className="p-12 flex items-center justify-center">
          <LoadingSpinner title="Loading course content..." />
        </div>
      ) : lessons.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-dashed border-zinc-200 text-center flex flex-col items-center justify-center gap-3">
          <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText className="size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-zinc-900">No lessons added yet</p>
            <p className="text-xs text-zinc-500 max-w-sm">
              Click &quot;Add Lesson&quot; to create the first lesson for this course and start attaching videos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddLessonOpen(true)}
            className="mt-2 h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Add Lesson</span>
          </button>
        </div>
      ) : (
        /* Lesson Cards List */
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
                  aria-label="Reorder lesson"
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 truncate">
                      {lesson.title}
                    </span>
                    {lesson.videoUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <Play className="size-2.5 fill-emerald-600" />
                        Video
                      </span>
                    )}
                  </div>
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

              {/* Right: Add Video, View & Delete Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenAddVideo(lesson.id, lesson.title)}
                  className="h-8 px-3 rounded-xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100 text-xs font-semibold text-amber-800 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  title="Add video to this lesson"
                >
                  <Video className="size-3.5 text-amber-600" />
                  <span>Add Video</span>
                </button>

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
                  disabled={deletingLessonId === lesson.id}
                  onClick={() => handleDelete(lesson.id)}
                  className="size-8 rounded-xl border border-zinc-200 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 hover:border-rose-200 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
                  title="Delete lesson"
                >
                  {deletingLessonId === lesson.id ? (
                    <Loader2 className="size-3.5 animate-spin text-rose-500" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Lesson Modal (Exact subjectId design) */}
      <AddLessonModal
        open={isAddLessonOpen}
        onOpenChange={setIsAddLessonOpen}
        courseId={courseId}
        defaultOrder={lessons.length + 1}
        onAddLesson={handleAddLessonSubmit}
        isSubmitting={createLessonMutation.isPending}
      />

      {/* Add Video Modal (Exact lessondetails design) */}
      <AddVideoModal
        open={isAddVideoOpen}
        onOpenChange={(open) => {
          setIsAddVideoOpen(open)
          if (!open) setTargetLessonForVideo(null)
        }}
        lessonId={targetLessonForVideo?.id}
        defaultOrder={1}
        onAddVideo={() => {
          refetch()
          toast.success("Video added to lesson successfully!")
        }}
      />
    </div>
  )
}
