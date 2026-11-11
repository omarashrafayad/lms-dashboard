"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ContentVideoItem } from "../types/contentCurriculum.types"
import { Video, ExternalLink } from "lucide-react"

export interface VideoPreviewModalProps {
  video: ContentVideoItem | null
  open: boolean
  onClose: () => void
}

export function VideoPreviewModal({ video, open, onClose }: VideoPreviewModalProps) {
  if (!video) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()} className="max-w-3xl w-full">
      <DialogContent
        onClose={onClose}
        className="max-w-3xl w-full p-6 flex flex-col gap-4 rounded-2xl bg-white shadow-2xl border border-zinc-200"
      >
        <DialogHeader className="gap-1 border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/80 flex items-center justify-center shrink-0">
              <Video className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900">
                {video.title || "Video Preview"}
              </DialogTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                Lesson: {video.lessonName || "Unassigned"} • Duration: {video.duration} min
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="w-full aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
          {video.fileUrl ? (
            <video
              src={video.fileUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-zinc-500 text-xs">No video stream URL available</div>
          )}
        </div>

        {video.fileUrl && (
          <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
            <span>Video Source Available</span>
            <a
              href={video.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange font-semibold hover:underline flex items-center gap-1"
            >
              <span>Open Direct Link</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

