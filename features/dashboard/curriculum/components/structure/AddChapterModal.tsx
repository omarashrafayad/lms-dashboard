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
import { CreateChapterPayload } from "../../types/curriculum.types"
import { Loader2, BookOpen } from "lucide-react"

export interface AddChapterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subjectId: string
  defaultOrder?: number
  onAddChapter: (payload: CreateChapterPayload) => Promise<void> | void
  isSubmitting?: boolean
}

export function AddChapterModal({
  open,
  onOpenChange,
  subjectId,
  defaultOrder = 1,
  onAddChapter,
  isSubmitting = false,
}: AddChapterModalProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [order, setOrder] = React.useState<number>(defaultOrder)

  React.useEffect(() => {
    if (open) {
      setName("")
      setDescription("")
      setOrder(defaultOrder)
    }
  }, [open, defaultOrder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !subjectId) return

    await onAddChapter({
      subjectId,
      name: name.trim(),
      description: description.trim(),
      order: Number(order) || 1,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[460px] p-6">
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <BookOpen className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900">
                Add Chapter
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Create a new chapter in this curriculum structure.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Chapter Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Chapter Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chapter 1: Introduction to Algebra"
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
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or learning objectives of this chapter..."
              className="w-full p-3 rounded-xl border border-zinc-200/80 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange resize-none transition-all"
            />
          </div>

          {/* Order */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Order / Sequence <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              required
            />
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
              <span>{isSubmitting ? "Creating Chapter..." : "Create Chapter"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
