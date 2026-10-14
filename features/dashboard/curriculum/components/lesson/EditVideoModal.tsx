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
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { LessonVideo } from "../../types/curriculum.types"
import { useUpdateVideo, useVideoById } from "../../hooks/useCurriculum"
import { toast } from "sonner"

export interface EditVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  video?: (LessonVideo & { isOfflineAvailable?: boolean; isFree?: boolean; isPremium?: boolean }) | null
  videoId?: string
  onSave?: (videoId: string, newTitle: string) => void
  lessonId?: string
}

export function EditVideoModal({
  open,
  onOpenChange,
  video,
  videoId,
  onSave,
  lessonId,
}: EditVideoModalProps) {
  const activeVideoId = videoId || video?.id
  const { data: serverVideo, isLoading: isLoadingVideo } = useVideoById(
    open && activeVideoId ? activeVideoId : undefined
  )
  const updateVideoMutation = useUpdateVideo()

  const [title, setTitle] = React.useState("")
  const [order, setOrder] = React.useState<number>(1)
  const [isFree, setIsFree] = React.useState<boolean>(false)
  const [isOfflineAvailable, setIsOfflineAvailable] = React.useState<boolean>(true)

  React.useEffect(() => {
    const current: any = serverVideo || video
    if (current) {
      setTitle(current.title || "")
      setOrder(current.order ?? 1)
      setIsFree(current.access === "Free" || !!current.isFree)
      setIsOfflineAvailable(
        current.offlineAvailable ?? current.isOfflineAvailable ?? true
      )
    }
  }, [serverVideo, video, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !activeVideoId) return

    try {
      if (lessonId) {
        await updateVideoMutation.mutateAsync({
          videoId: activeVideoId,
          lessonId,
          data: {
            title: title.trim(),
            order: Number(order) || 1,
            isFree,
            isPremium: !isFree,
            isOfflineAvailable,
          },
        })
        toast.success("Video updated successfully!")
      }
      onSave?.(activeVideoId, title.trim())
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update video")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
          <DialogDescription>
            Update video details, order, and access properties.
          </DialogDescription>
        </DialogHeader>

        {isLoadingVideo ? (
          <div className="py-10 flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-6 text-brand-orange animate-spin" />
            <span className="text-xs text-zinc-500">Loading video details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">
                Video Title <span className="text-red-500">*</span>
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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">
                Sort Order
              </label>
              <Input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-zinc-800">
                  Free Access
                </span>
                <span className="text-[11px] text-zinc-400">
                  If enabled, students on free plan can watch this video.
                </span>
              </div>
              <Switch checked={isFree} onCheckedChange={setIsFree} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-zinc-800">
                  Offline Download
                </span>
                <span className="text-[11px] text-zinc-400">
                  Allow students to download this video for offline viewing.
                </span>
              </div>
              <Switch
                checked={isOfflineAvailable}
                onCheckedChange={setIsOfflineAvailable}
              />
            </div>

            <DialogFooter className="mt-2">
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
                disabled={updateVideoMutation.isPending}
                className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer gap-1.5"
              >
                {updateVideoMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                <span>Save Changes</span>
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
