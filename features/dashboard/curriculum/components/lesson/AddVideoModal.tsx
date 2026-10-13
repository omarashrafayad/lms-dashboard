"use client"

import * as React from "react"
import { UploadCloud, Plus, Loader2, Minimize2 } from "lucide-react"
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
import { VideoUploadProgress } from "../../types/curriculum.types"
import { VideoUploadProgressCard } from "./VideoUploadProgressCard"
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
  onUploadProgressChange?: (
    progress: VideoUploadProgress | null,
    meta?: {
      title: string
      fileName: string
      fileSize: number
      onCancel?: () => void
    }
  ) => void
}

export function AddVideoModal({
  open,
  onOpenChange,
  lessonId,
  defaultOrder = 1,
  onAddVideo,
  onUploadProgressChange,
}: AddVideoModalProps) {
  const [title, setTitle] = React.useState("")
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [duration, setDuration] = React.useState<number>(300) // seconds
  const [order, setOrder] = React.useState<number>(defaultOrder)
  const [isFree, setIsFree] = React.useState<boolean>(defaultOrder === 1)
  const [isPremium, setIsPremium] = React.useState<boolean>(true)
  const [isOfflineAvailable, setIsOfflineAvailable] = React.useState(true)
  const [uploadProgress, setUploadProgress] = React.useState<VideoUploadProgress>({
    percentage: 0,
    loaded: 0,
    total: 0,
    status: "idle",
  })

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const isSimulatingRef = React.useRef<boolean>(false)

  const uploadVideoMutation = useUploadVideo()

  React.useEffect(() => {
    setOrder(defaultOrder)
    setIsFree(defaultOrder === 1)
  }, [defaultOrder])

  // Sync upload progress upwards if parent wants banner or floating notifications
  React.useEffect(() => {
    if (uploadProgress.status === "idle") {
      onUploadProgressChange?.(null)
    } else {
      onUploadProgressChange?.(uploadProgress, {
        title: title || selectedFile?.name || "Video",
        fileName: selectedFile?.name || "video.mp4",
        fileSize: selectedFile?.size || 0,
        onCancel: handleCancelUpload,
      })
    }
  }, [uploadProgress, title, selectedFile])

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

  const handleCancelUpload = () => {
    isSimulatingRef.current = false
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setUploadProgress({
      percentage: 0,
      loaded: 0,
      total: 0,
      status: "idle",
    })
    toast.info("Upload cancelled")
  }

  const resetForm = () => {
    setTitle("")
    setSelectedFile(null)
    setUploadProgress({
      percentage: 0,
      loaded: 0,
      total: 0,
      status: "idle",
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const completeUploadFlow = () => {
    const formattedMin = Math.floor(duration / 60)
    const formattedSec = String(duration % 60).padStart(2, "0")

    onAddVideo?.({
      title: title.trim(),
      duration: `${formattedMin}:${formattedSec}`,
      offlineAvailable: isOfflineAvailable,
    })

    setTimeout(() => {
      resetForm()
      onOpenChange(false)
    }, 1000)
  }

  const simulateProgressUpload = async (file: File) => {
    isSimulatingRef.current = true
    const total = file.size || 15 * 1024 * 1024
    let currentLoaded = 0
    const startTime = Date.now()

    const stepInterval = 200
    const steps = 20
    const chunkSize = total / steps

    for (let i = 1; i <= steps; i++) {
      if (!isSimulatingRef.current) return
      await new Promise((r) => setTimeout(r, stepInterval))
      if (!isSimulatingRef.current) return

      currentLoaded = Math.min(total, currentLoaded + chunkSize)
      const pct = Math.min(100, Math.round((currentLoaded * 100) / total))
      const elapsedSec = (Date.now() - startTime) / 1000
      const rate = elapsedSec > 0 ? currentLoaded / elapsedSec : 1024 * 1024
      const remainingBytes = Math.max(0, total - currentLoaded)
      const estimated = rate > 0 ? remainingBytes / rate : 0

      setUploadProgress({
        percentage: pct,
        loaded: currentLoaded,
        total,
        rate,
        estimated,
        status: pct >= 100 ? "processing" : "uploading",
      })
    }

    // Processing server step
    if (!isSimulatingRef.current) return
    setUploadProgress({
      percentage: 100,
      loaded: total,
      total,
      status: "processing",
    })

    await new Promise((r) => setTimeout(r, 1200))
    if (!isSimulatingRef.current) return

    setUploadProgress({
      percentage: 100,
      loaded: total,
      total,
      status: "success",
    })

    toast.success("Video uploaded successfully!")
    completeUploadFlow()
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

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setUploadProgress({
      percentage: 0,
      loaded: 0,
      total: selectedFile.size,
      status: "uploading",
    })

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
          signal: abortController.signal,
          onProgress: (p) => {
            setUploadProgress(p)
          },
        })

        setUploadProgress({
          percentage: 100,
          loaded: selectedFile.size,
          total: selectedFile.size,
          status: "success",
        })
        toast.success("Video uploaded successfully!")
        completeUploadFlow()
      } else {
        // Standalone or testing mode: simulate realistic upload progress
        await simulateProgressUpload(selectedFile)
      }
    } catch (err: any) {
      if (err?.name === "CanceledError" || err?.name === "AbortError") {
        return // Cancelled by user
      }
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Failed to upload video"
      setUploadProgress((prev) => ({
        ...prev,
        status: "error",
        error: msg,
      }))
      toast.error(msg)
    }
  }

  const isUploading =
    uploadProgress.status === "uploading" ||
    uploadProgress.status === "processing"
  const isSuccess = uploadProgress.status === "success"
  const isError = uploadProgress.status === "error"

  const handleClose = () => {
    if (isUploading) {
      // Allow user to minimize to background
      onOpenChange(false)
      toast.info("Upload continuing in background...")
      return
    }
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? handleClose() : onOpenChange(true))}>
      <DialogContent onClose={handleClose} className="max-w-[560px]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle>Add Video</DialogTitle>
            {isUploading && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                Uploading {uploadProgress.percentage}% ({100 - uploadProgress.percentage}% remaining)
              </span>
            )}
          </div>
          <DialogDescription>
            Upload and attach a video to this lesson with live progress tracking.
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
              disabled={isUploading || isSuccess}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Fractions"
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange disabled:opacity-70"
              required
              autoFocus
            />
          </div>

          {/* Video File / Upload Progress Section */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-800">
                Video File <span className="text-red-500">*</span>
              </label>
              {selectedFile && !isUploading && !isSuccess && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-brand-orange hover:underline font-medium cursor-pointer"
                >
                  Change file
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              disabled={isUploading || isSuccess}
              onChange={handleFileChange}
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
            />

            {/* If upload has started or is in progress/complete/error, show professional progress card */}
            {uploadProgress.status !== "idle" ? (
              <VideoUploadProgressCard
                fileName={selectedFile?.name}
                title={title}
                fileSize={selectedFile?.size}
                progress={uploadProgress}
                onCancel={isUploading ? handleCancelUpload : undefined}
                onDismiss={isError ? () => setUploadProgress({ percentage: 0, loaded: 0, total: 0, status: "idle" }) : undefined}
              />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border border-dashed border-zinc-300 hover:border-brand-orange/60 bg-zinc-50/40 hover:bg-amber-50/20 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
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
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                      {Math.floor(duration / 60)}:
                      {String(duration % 60).padStart(2, "0")}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium mt-1">
                      Ready to upload
                    </span>
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
            )}
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
                disabled={isUploading || isSuccess}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm disabled:opacity-70"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-800">
                Duration (seconds)
              </label>
              <Input
                type="number"
                min={1}
                disabled={isUploading || isSuccess}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm disabled:opacity-70"
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
              <Switch
                disabled={isUploading || isSuccess}
                checked={isFree}
                onCheckedChange={setIsFree}
              />
            </div>

            <div className="rounded-xl border border-zinc-200/80 p-3 px-3.5 flex items-center justify-between bg-white">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-900">Is Premium</span>
                <span className="text-[10px] text-zinc-400">Premium plan</span>
              </div>
              <Switch
                disabled={isUploading || isSuccess}
                checked={isPremium}
                onCheckedChange={setIsPremium}
              />
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
              disabled={isUploading || isSuccess}
              checked={isOfflineAvailable}
              onCheckedChange={setIsOfflineAvailable}
            />
          </div>

          {/* Footer Actions */}
          <DialogFooter className="mt-2 flex items-center justify-between gap-2 sm:justify-between">
            {isUploading ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-10 px-3.5 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50 cursor-pointer gap-1.5"
              >
                <Minimize2 className="size-3.5 text-zinc-500" />
                <span>Run in background</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-10 px-4 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </Button>
            )}

            <div className="flex items-center gap-2">
              {isUploading && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelUpload}
                  className="h-10 px-3.5 rounded-xl border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 cursor-pointer"
                >
                  Cancel upload
                </Button>
              )}

              <Button
                type="submit"
                disabled={isUploading || isSuccess || !selectedFile}
                className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>
                      {uploadProgress.status === "processing"
                        ? "Processing video..."
                        : `Uploading ${uploadProgress.percentage}% (${100 - uploadProgress.percentage}% remaining)...`}
                    </span>
                  </>
                ) : isSuccess ? (
                  <span>Upload complete!</span>
                ) : (
                  <>
                    <Plus className="size-3.5 stroke-[2.5]" />
                    <span>Add Video</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
