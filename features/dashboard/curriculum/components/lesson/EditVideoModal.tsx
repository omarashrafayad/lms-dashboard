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
import { LessonVideo } from "../../types/curriculum.types"

export interface EditVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  video: LessonVideo | null
  onSave: (videoId: string, newTitle: string) => void
}

export function EditVideoModal({
  open,
  onOpenChange,
  video,
  onSave,
}: EditVideoModalProps) {
  const [title, setTitle] = React.useState("")

  React.useEffect(() => {
    if (video) {
      setTitle(video.title)
    }
  }, [video, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !video) return
    onSave(video.id, title.trim())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
          <DialogDescription>
            Provide a title for this video. Upload happens in the next step.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-700">
              Video Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              required
              autoFocus
            />
          </div>

          <DialogFooter className="mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
