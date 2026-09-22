"use client"

import * as React from "react"
import { X, UploadCloud, Film } from "lucide-react"
import { VideoContentItem } from "../../types/lesson.types"

export interface AddVideoModalProps {
  isOpen: boolean
  onClose: () => void
  onAddVideo: (video: VideoContentItem) => void
  existingVideosCount: number
}

export function AddVideoModal({
  isOpen,
  onClose,
  onAddVideo,
  existingVideosCount,
}: AddVideoModalProps) {
  const nextNumber = existingVideosCount + 1
  const [title, setTitle] = React.useState(`Video ${nextNumber}`)
  const [duration, setDuration] = React.useState("00:00")
  const [offlineDownload, setOfflineDownload] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isOpen) {
      setTitle(`Video ${nextNumber}`)
      setDuration("00:00")
      setOfflineDownload(false)
      setSelectedFile(null)
    }
  }, [isOpen, nextNumber])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      if (!title || title === `Video ${nextNumber}`) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const videoTitle = title.trim() || `Video ${nextNumber}`
    const access: "Free" | "Premium" = existingVideosCount === 0 ? "Free" : "Premium"

    const newVideo: VideoContentItem = {
      id: `vid-${Date.now()}`,
      order: nextNumber,
      title: videoTitle,
      duration: duration.trim() || "05:00",
      access,
      offlineAvailable: offlineDownload,
      file: selectedFile,
      fileName: selectedFile?.name,
    }

    onAddVideo(newVideo)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-[460px] rounded-2xl bg-white border border-zinc-200/90 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Image 5 */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-zinc-100">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Add Video
            </h3>
            <p className="text-xs text-zinc-400 font-normal">
              Provide video details. Upload happens on save.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body Form matching Image 5 */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Video Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Video 2"
              className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          {/* Video File Dropzone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Video File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-28 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50/70 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs group"
            >
              {selectedFile ? (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/70">
                  <Film className="size-4" />
                  <span className="truncate max-w-[260px]">{selectedFile.name}</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="size-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                  <span className="text-xs text-zinc-400 font-normal group-hover:text-zinc-600 transition-colors">
                    Click to upload video file
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Duration & Offline Download Row */}
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Duration */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="00:00"
                className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
              />
            </div>

            {/* Offline Download Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Offline Download
              </label>
              <div className="flex items-center h-10">
                <button
                  type="button"
                  onClick={() => setOfflineDownload(!offlineDownload)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    offlineDownload ? "bg-[#F59E0B]" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      offlineDownload ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Helper Note matching Image 5 */}
          <p className="text-[11px] text-zinc-400 font-normal leading-relaxed -mt-1">
            Access type is set automatically: first video Free, all others Premium.
          </p>

          {/* Footer Buttons matching Image 5 */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
            >
              Add Video
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
