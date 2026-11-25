"use client"

import * as React from "react"
import {
  Play,
  Video as VideoIcon,
  Clock,
  HardDrive,
  Download,
  AlertCircle,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { StudentLessonVideo } from "../types/studentApi.types"

interface StudentVideoPlayerProps {
  videos: StudentLessonVideo[]
  lessonTitle?: string
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return ""
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

export function StudentVideoPlayer({ videos, lessonTitle }: StudentVideoPlayerProps) {
  const sortedVideos = React.useMemo(
    () => [...(videos || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [videos]
  )

  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [blobSrc, setBlobSrc] = React.useState<string | null>(null)
  const [isLoadingBlob, setIsLoadingBlob] = React.useState(false)
  const [videoError, setVideoError] = React.useState<string | null>(null)
  const triedAuthFetchRef = React.useRef<Record<string, boolean>>({})

  const activeVideo = sortedVideos[selectedIndex] || sortedVideos[0]

  // Reset state when switching video
  React.useEffect(() => {
    setVideoError(null)
    setIsLoadingBlob(false)
    if (blobSrc) {
      URL.revokeObjectURL(blobSrc)
      setBlobSrc(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVideo?.id, activeVideo?.url])

  // Cleanup blob on unmount
  React.useEffect(() => {
    return () => {
      if (blobSrc) URL.revokeObjectURL(blobSrc)
    }
  }, [blobSrc])

  const handleVideoError = async () => {
    if (!activeVideo?.url) return

    // If direct stream failed, attempt fetching with Bearer token once
    if (!triedAuthFetchRef.current[activeVideo.id]) {
      triedAuthFetchRef.current[activeVideo.id] = true
      const token = useAuthStore.getState().token
      if (token) {
        try {
          setIsLoadingBlob(true)
          const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`
          const res = await fetch(activeVideo.url, {
            headers: { Authorization: authHeader },
          })
          if (res.ok) {
            const blob = await res.blob()
            const objectUrl = URL.createObjectURL(blob)
            setBlobSrc(objectUrl)
            setVideoError(null)
            return
          }
        } catch {
          // Fall through to error UI
        } finally {
          setIsLoadingBlob(false)
        }
      }
    }

    setVideoError("Unable to stream this video directly inside the player.")
  }

  if (!sortedVideos || sortedVideos.length === 0) {
    return (
      <div className="w-full aspect-video rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-8 text-center gap-3">
        <div className="size-14 rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
          <VideoIcon className="size-7" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-white">No Video Lectures Available</h3>
          <p className="text-xs text-zinc-400 max-w-sm">
            No video files have been attached to {lessonTitle || "this lesson"} yet. Check the study materials or quiz below.
          </p>
        </div>
      </div>
    )
  }

  const playbackUrl = blobSrc || activeVideo.url

  return (
    <div className="flex flex-col gap-4">
      {/* Main Video Container */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-lg">
        {isLoadingBlob ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white">
            <Loader2 className="size-9 animate-spin text-brand-orange" />
            <span className="text-xs font-medium text-zinc-300">
              Loading secure video stream...
            </span>
          </div>
        ) : videoError ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
            <div className="size-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertCircle className="size-6" />
            </div>
            <p className="text-sm font-bold">{videoError}</p>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  triedAuthFetchRef.current[activeVideo.id] = false
                  setVideoError(null)
                }}
                className="px-4 py-2 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Retry Player
              </button>
              <a
                href={activeVideo.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all"
              >
                <ExternalLink className="size-3.5" />
                <span>Open Stream Link</span>
              </a>
            </div>
          </div>
        ) : (
          <video
            key={playbackUrl}
            src={playbackUrl}
            controls
            playsInline
            preload="metadata"
            onError={handleVideoError}
            className="w-full h-full object-contain bg-black"
          />
        )}
      </div>

      {/* Active Video Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <span className="size-9 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60 flex items-center justify-center shrink-0">
            <Play className="size-4 fill-current" />
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-zinc-900 truncate">
              {activeVideo.title || lessonTitle || "Lesson Video"}
            </span>
            <div className="flex items-center gap-3 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {formatDuration(activeVideo.durationSeconds)}
              </span>
              {activeVideo.fileSizeBytes > 0 && (
                <span className="flex items-center gap-1">
                  <HardDrive className="size-3" />
                  {formatFileSize(activeVideo.fileSizeBytes)}
                </span>
              )}
              {activeVideo.isOfflineAvailable && (
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="size-3" />
                  Offline Ready
                </span>
              )}
            </div>
          </div>
        </div>

        <a
          href={playbackUrl}
          download={activeVideo.title || "lesson-video.mp4"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
        >
          <Download className="size-3.5" />
          <span>Open / Download</span>
        </a>
      </div>

      {/* Multi-Video Playlist */}
      {sortedVideos.length > 1 && (
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-2.5">
          <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
            Lesson Playlist ({sortedVideos.length} Videos)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sortedVideos.map((vid, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-orange text-white border-brand-orange shadow-xs"
                      : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`size-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-white text-zinc-700"
                      }`}
                    >
                      {vid.order || idx + 1}
                    </span>
                    <span className="text-xs font-bold truncate">{vid.title}</span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold shrink-0 ${
                      isSelected ? "text-white/90" : "text-zinc-500"
                    }`}
                  >
                    {formatDuration(vid.durationSeconds)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
