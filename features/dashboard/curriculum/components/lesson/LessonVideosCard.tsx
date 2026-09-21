"use client"

import * as React from "react"
import {
  Play,
  Plus,
  GripVertical,
  Eye,
  Pencil,
  MoreHorizontal,
  Download,
  DownloadCloud,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LessonVideo } from "../../types/curriculum.types"
import { AddVideoModal } from "./AddVideoModal"
import { EditVideoModal } from "./EditVideoModal"

export interface LessonVideosProps {
  videos: LessonVideo[]
  onVideosChange?: (videos: LessonVideo[]) => void
}

export function LessonVideosCard({
  videos: initialVideos,
  onVideosChange,
}: LessonVideosProps) {
  const [videos, setVideos] = React.useState<LessonVideo[]>(initialVideos)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [videoToEdit, setVideoToEdit] = React.useState<LessonVideo | null>(null)

  React.useEffect(() => {
    setVideos(initialVideos)
  }, [initialVideos])

  const handleAddVideo = (newVideoData: {
    title: string
    duration: string
    offlineAvailable: boolean
  }) => {
    const nextOrder = videos.length + 1
    const newVideo: LessonVideo = {
      id: `v-${Date.now()}`,
      order: nextOrder,
      title: newVideoData.title,
      duration: newVideoData.duration || "00:00",
      access: nextOrder === 1 ? "Free" : "Premium",
      offlineAvailable: newVideoData.offlineAvailable,
    }
    const updated = [...videos, newVideo]
    setVideos(updated)
    onVideosChange?.(updated)
  }

  const handleEditVideo = (videoId: string, newTitle: string) => {
    const updated = videos.map((v) =>
      v.id === videoId ? { ...v, title: newTitle } : v
    )
    setVideos(updated)
    onVideosChange?.(updated)
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
            <Play className="size-4 fill-zinc-600" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm text-zinc-900">Video Content</h3>
            <span className="text-xs text-zinc-400">
              Videos play in order. Reorder them with the drag handle.
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Add Video</span>
        </Button>
      </div>

      {/* Info Alert Banner matching Screenshot 5 */}
      <div className="flex items-center gap-2.5 p-3 px-4 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 font-normal">
        <Info className="size-4 text-amber-600 shrink-0" />
        <span>
          The first video is available to Free Plan students. Additional videos require a Premium plan.
        </span>
      </div>

      {/* Videos List */}
      <div className="flex flex-col gap-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50/50 transition-all shadow-2xs"
          >
            {/* Left: Drag handle, Order, Thumbnail, Title & Meta */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Drag Handle */}
              <button
                type="button"
                className="text-zinc-300 hover:text-zinc-500 cursor-grab active:cursor-grabbing p-0.5"
                aria-label="Reorder"
              >
                <GripVertical className="size-4" />
              </button>

              {/* Order Number */}
              <span className="text-xs font-semibold text-zinc-400 w-3 text-center">
                {video.order}
              </span>

              {/* Video Thumbnail with Duration badge */}
              <div className="relative w-20 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 shadow-xs border border-zinc-700/30">
                {/* Background gradient or subtle thumbnail pattern */}
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-700 opacity-90" />
                <Play className="size-4 text-white/80 fill-white/80 relative z-10" />

                {/* Duration tag overlay */}
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] font-medium text-white tracking-tight leading-none z-10">
                  {video.duration}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col min-w-0 gap-1">
                <span className="font-semibold text-xs text-zinc-900 truncate">
                  {video.title}
                </span>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span>{video.duration}</span>
                  <span>•</span>

                  {/* Access Badge */}
                  <span
                    className={cn(
                      "px-2 py-0.2 rounded-full text-[10px] font-semibold border",
                      video.access === "Free"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}
                  >
                    {video.access}
                  </span>

                  <span>•</span>

                  {/* Offline status */}
                  <div className="flex items-center gap-1">
                    {video.offlineAvailable ? (
                      <>
                        <Download className="size-3 text-zinc-400" />
                        <span>Offline available</span>
                      </>
                    ) : (
                      <>
                        <DownloadCloud className="size-3 text-zinc-400" />
                        <span>No offline</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions (Preview, Edit, ...) */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
              >
                <Eye className="size-3.5 text-zinc-500" />
                <span>Preview</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setVideoToEdit(video)}
                className="h-8 px-3 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
              >
                <Pencil className="size-3.5 text-zinc-500" />
                <span>Edit</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Video Modal */}
      <AddVideoModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onAddVideo={handleAddVideo}
      />

      {/* Edit Video Modal */}
      <EditVideoModal
        open={!!videoToEdit}
        onOpenChange={(open) => !open && setVideoToEdit(null)}
        video={videoToEdit}
        onSave={handleEditVideo}
      />
    </div>
  )
}
