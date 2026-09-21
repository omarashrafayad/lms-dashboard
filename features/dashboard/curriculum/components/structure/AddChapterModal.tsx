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

export interface AddChapterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddChapter: (title: string) => void
}

export function AddChapterModal({
  open,
  onOpenChange,
  onAddChapter,
}: AddChapterModalProps) {
  const [title, setTitle] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAddChapter(title.trim())
    setTitle("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Add Chapter</DialogTitle>
          <DialogDescription>
            Enter a title for the new chapter in this curriculum.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-700">
              Chapter Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 3 — Geometry"
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              required
            />
          </div>

          <DialogFooter className="mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs"
            >
              Create Chapter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
