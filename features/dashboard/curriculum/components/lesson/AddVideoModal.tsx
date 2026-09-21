"use client"

import * as React from "react"
import { UploadCloud, Info, Plus } from "lucide-react"
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

export interface AddVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddVideo: (video: {
    title: string
    duration: string
    offlineAvailable: boolean
  }) => void
}

export function AddVideoModal({
  open,
  onOpenChange,
  onAddVideo,
}: AddVideoModalProps) {
  const [title, setTitle] = React.useState("")
  const [offlineDownload, setOfflineDownload] = React.useState(true)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [selectedFileName, setSelectedFileName] = React.useState<string | null>(
    null
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFileName(file.name)
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddVideo({
      title: title.trim(),
      duration: "07:30",
      offlineAvailable: offlineDownload,
    })

    setTitle("")
    setSelectedFileName(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add Video</DialogTitle>
          <DialogDescription>
            Add a video to this lesson.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Video Title * */}
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
            />
          </div>

          {/* Video File * Dropzone matching Screenshot 1 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-800">
              Video File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4,video/quicktime"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border border-dashed border-zinc-300 hover:border-brand-orange/60 bg-zinc-50/40 hover:bg-amber-50/20 p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
            >
              <div className="size-11 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center shadow-2xs mb-1">
                <UploadCloud className="size-5" />
              </div>

              {selectedFileName ? (
                <div className="text-xs font-semibold text-zinc-800">
                  {selectedFileName}
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
                </>
              )}

              <div className="text-[11px] text-zinc-400 mt-1">
                MP4, MOV
              </div>
              <div className="text-[10px] text-zinc-400">
                Maximum file size: 2 GB
              </div>
            </div>
          </div>

          {/* Offline Download Card */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-800">
              Offline Download
            </span>
            <div className="rounded-xl border border-zinc-200/80 p-3.5 px-4 flex items-center justify-between bg-white shadow-2xs">
              <div className="flex flex-col pr-4">
                <span className="text-xs font-semibold text-zinc-900">
                  Allow students to download this video for offline viewing
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  Students can watch downloaded videos without an internet connection.
                </span>
              </div>
              <Switch
                checked={offlineDownload}
                onCheckedChange={setOfflineDownload}
              />
            </div>
          </div>

          {/* Access Banner */}
          <div className="flex items-start gap-2.5 p-3 px-3.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 font-normal">
            <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Access is set automatically — the first video is Free, and this video will be added to the end of the list as Premium. You can reorder videos anytime with the drag handle.
            </span>
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
              className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer"
            >
              <Plus className="size-3.5 stroke-[2.5]" />
              <span>Add Video</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
