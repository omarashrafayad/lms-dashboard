"use client"

import * as React from "react"
import { X, Loader2 } from "lucide-react"
import { useUpdateLesson } from "../hooks/useLessons"
import { LessonDetailFull } from "../types/lesson.types"
import { toast } from "sonner"

export interface EditLessonModalProps {
  isOpen: boolean
  onClose: () => void
  lesson: LessonDetailFull
  onUpdated?: (updated: LessonDetailFull) => void
}

export function EditLessonModal({
  isOpen,
  onClose,
  lesson,
  onUpdated,
}: EditLessonModalProps) {
  const [title, setTitle] = React.useState(lesson.title)
  const [description, setDescription] = React.useState(lesson.overview.description)
  const [order, setOrder] = React.useState(String(lesson.order))
  const [duration, setDuration] = React.useState(lesson.overview.duration)

  const updateMutation = useUpdateLesson()

  React.useEffect(() => {
    if (isOpen) {
      setTitle(lesson.title)
      setDescription(lesson.overview.description)
      setOrder(String(lesson.order))
      setDuration(lesson.overview.duration)
    }
  }, [isOpen, lesson])

  if (!isOpen) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Lesson Title is required")
      return
    }

    try {
      const updated = await updateMutation.mutateAsync({
        lessonId: lesson.id,
        data: {
          title: title.trim(),
          description: description.trim(),
          order: Number(order) || 1,
          duration: duration.trim() || "30 min",
        },
      })
      toast.success("Lesson updated successfully")
      if (onUpdated) {
        onUpdated(updated)
      }
      onClose()
    } catch (err: any) {
      toast.error(err?.message || "Failed to update lesson")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-[500px] rounded-2xl bg-white border border-zinc-200/90 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Image 1 */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-zinc-100">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Edit Lesson
            </h3>
            <p className="text-xs text-zinc-400 font-normal">
              Update the lesson title and details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body Form matching Image 1 */}
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
          {/* Lesson Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Lesson Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Reading Comprehension — Short Stories"
              className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Strategies for understanding short narrative texts."
              className="w-full p-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs resize-none"
            />
          </div>

          {/* 2-Column Row: Lesson Order & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Lesson Order
              </label>
              <input
                type="text"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1"
                className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="40 min"
                className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Footer Action Buttons matching Image 1 */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateMutation.isPending && (
                <Loader2 className="size-3.5 animate-spin" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
