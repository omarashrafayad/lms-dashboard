"use client"

import * as React from "react"
import { UploadCloud, Info, Plus, Loader2 } from "lucide-react"
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
import { useUploadVideo } from "../../hooks/useCurriculum"
import { toast } from "sonner"

export interface AddVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lessonId?: string
  defaultOrder?: number
  onAddVideo?: (video: {
    title: string
    duration: string
    offlineAvailable: boolean
  }) => void
}

export function AddVideoModal({
  open,
  onOpenChange,
  lessonId,
  defaultOrder = 1,
  onAddVideo,
}: AddVideoModalProps) {
  const [title, setTitle] = React.useState("")
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [duration, setDuration] = React.useState<number>(300) // seconds
  const [order, setOrder] = React.useState<number>(defaultOrder)
  const [isFree, setIsFree] = React.useState<boolean>(defaultOrder === 1)
  const [isPremium, setIsPremium] = React.useState<boolean>(true)
  const [isOfflineAvailable, setIsOfflineAvailable] = React.useState(true)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const uploadVideoMutation = useUploadVideo()

  React.useEffect(() => {
    setOrder(defaultOrder)
    setIsFree(defaultOrder === 1)
  }, [defaultOrder])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""))
      }

      // Automatically inspect duration
      try {
        const videoElement = document.createElement("video")
        videoElement.preload = "metadata"
        videoElement.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElement.src)
          if (videoElement.duration && !isNaN(videoElement.duration)) {
            setDuration(Math.round(videoElement.duration))
          }
        }
        videoElement.src = URL.createObjectURL(file)
      } catch {
        // Fallback default duration
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please provide a title for the video")
      return
    }
    if (!selectedFile) {
      toast.error("Please choose a video file")
      return
    }

    try {
      if (lessonId) {
        await uploadVideoMutation.mutateAsync({
          lessonId,
          title: title.trim(),
          fileSize: selectedFile.size,
          duration: duration || 300,
          order: Number(order) || defaultOrder,
          isFree: isFree,
          isPremium: isPremium,
          isOfflineAvailable: isOfflineAvailable,
          file: selectedFile,
        })
        toast.success("Video uploaded successfully!")
      }

      const formattedMin = Math.floor(duration / 60)
      const formattedSec = String(duration % 60).padStart(2, "0")

      onAddVideo?.({
        title: title.trim(),
        duration: `${formattedMin}:${formattedSec}`,
        offlineAvailable: isOfflineAvailable,
      })

      setTitle("")
      setSelectedFile(null)
      onOpenChange(false)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Failed to upload video"
      toast.error(msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add Video</DialogTitle>
          <DialogDescription>
            Upload and attach a video to this lesson.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Video Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-800">
              Video Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Fractions"
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              required
              autoFocus
            />
          </div>

          {/* Video File Dropzone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-800">
              Video File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border border-dashed border-zinc-300 hover:border-brand-orange/60 bg-zinc-50/40 hover:bg-amber-50/20 p-7 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
            >
              <div className="size-11 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center shadow-2xs mb-1">
                <UploadCloud className="size-5" />
              </div>

              {selectedFile ? (
                <div className="flex flex-col items-center gap-0.5">
                  <div className="text-xs font-semibold text-zinc-800">
                    {selectedFile.name}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs font-medium text-zinc-700">
                    Drag & drop your video here
                  </div>
                  <div className="text-xs text-zinc-400">
                    or{" "}
                    <span className="text-brand-orange font-semibold hover:underline">
                      Browse Files
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    MP4, MOV, WebM (up to 2 GB)
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Video Order & Duration Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-800">
                Order
              </label>
              <Input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-800">
                Duration (seconds)
              </label>
              <Input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm"
              />
            </div>
          </div>

          {/* Access switches: Free & Premium */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-200/80 p-3 px-3.5 flex items-center justify-between bg-white">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-900">Is Free</span>
                <span className="text-[10px] text-zinc-400">Available to all</span>
              </div>
              <Switch checked={isFree} onCheckedChange={setIsFree} />
            </div>

            <div className="rounded-xl border border-zinc-200/80 p-3 px-3.5 flex items-center justify-between bg-white">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-900">Is Premium</span>
                <span className="text-[10px] text-zinc-400">Premium plan</span>
              </div>
              <Switch checked={isPremium} onCheckedChange={setIsPremium} />
            </div>
          </div>

          {/* Offline Download Card */}
          <div className="rounded-xl border border-zinc-200/80 p-3.5 px-4 flex items-center justify-between bg-white shadow-2xs">
            <div className="flex flex-col pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Offline Download
              </span>
              <span className="text-[11px] text-zinc-400">
                Students can download this video for offline viewing
              </span>
            </div>
            <Switch
              checked={isOfflineAvailable}
              onCheckedChange={setIsOfflineAvailable}
            />
          </div>

          {/* Footer Actions */}
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
              disabled={uploadVideoMutation.isPending}
              className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer"
            >
              {uploadVideoMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Add Video</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

