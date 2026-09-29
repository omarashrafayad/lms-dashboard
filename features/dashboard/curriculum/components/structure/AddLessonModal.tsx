"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateLessonPayload } from "../../types/curriculum.types"
import { Loader2, FileText } from "lucide-react"

export interface AddLessonModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chapterId?: string | null
  unitId: string | null
  defaultOrder?: number
  onAddLesson: (payload: CreateLessonPayload) => Promise<void> | void
  isSubmitting?: boolean
}

export function AddLessonModal({
  open,
  onOpenChange,
  unitId,
  defaultOrder = 1,
  onAddLesson,
  isSubmitting = false,
}: AddLessonModalProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [lessonOrder, setLessonOrder] = React.useState<number>(defaultOrder)
  const [duration, setDuration] = React.useState<number>(30)
  const [accessType, setAccessType] = React.useState<string>("Premium")
  const [status, setStatus] = React.useState<string>("true")

  React.useEffect(() => {
    if (open) {
      setName("")
      setDescription("")
      setLessonOrder(defaultOrder)
      setDuration(30)
      setAccessType("Premium")
      setStatus("true")
    }
  }, [open, defaultOrder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !unitId) return

    await onAddLesson({
      unitId,
      name: name.trim(),
      description: description.trim(),
      lessonOrder: Number(lessonOrder) || 1,
      duration: Number(duration) || 0,
      accessType,
      status,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[480px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-9 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center shrink-0">
              <FileText className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900">
                Add Lesson
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Configure and add a new lesson to this unit.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Lesson Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Lesson Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lesson 1: Introduction to Quadratic Formula"
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key concepts and summary covered in this lesson..."
              className="w-full p-3 rounded-xl border border-zinc-200/80 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange resize-none transition-all"
            />
          </div>

          {/* Row: Order & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Lesson Order <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min={1}
                value={lessonOrder}
                onChange={(e) => setLessonOrder(parseInt(e.target.value, 10) || 1)}
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min={0}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
                placeholder="e.g. 45"
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
                required
              />
            </div>
          </div>

          {/* Row: Access Type & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Access Type <span className="text-red-500">*</span>
              </label>
              <select
                value={accessType}
                onChange={(e) => setAccessType(e.target.value)}
                className="h-10 px-3 rounded-xl border border-zinc-200/80 bg-white text-xs text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              >
                <option value="Premium">Premium</option>
                <option value="Free">Free</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 px-3 rounded-xl border border-zinc-200/80 bg-white text-xs text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              >
                <option value="true">Active (Published)</option>
                <option value="false">Draft (Inactive)</option>
              </select>
            </div>
          </div>

          <DialogFooter className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="h-10 px-5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              <span>{isSubmitting ? "Adding Lesson..." : "Add Lesson"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
