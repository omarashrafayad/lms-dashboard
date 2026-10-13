"use client"

import * as React from "react"
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Zap,
  Clock,
  Film,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { VideoUploadProgress } from "../../types/curriculum.types"

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (!bytes || bytes <= 0) return "0 MB"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function formatRemainingTime(seconds?: number): string {
  if (seconds === undefined || isNaN(seconds) || seconds <= 0) return ""
  if (seconds < 60) {
    return `~${Math.ceil(seconds)}s remaining`
  }
  const mins = Math.floor(seconds / 60)
  const remainingSecs = Math.ceil(seconds % 60)
  return `~${mins}m ${remainingSecs}s remaining`
}

export interface VideoUploadProgressCardProps {
  fileName?: string
  title?: string
  fileSize?: number
  progress: VideoUploadProgress
  onCancel?: () => void
  onDismiss?: () => void
  variant?: "modal" | "banner" | "compact"
  className?: string
}

export function VideoUploadProgressCard({
  fileName,
  title,
  fileSize,
  progress,
  onCancel,
  onDismiss,
  variant = "modal",
  className,
}: VideoUploadProgressCardProps) {
  const percentage = Math.min(100, Math.max(0, progress.percentage || 0))
  const remainingPercentage = Math.max(0, 100 - percentage)
  const isComplete = progress.status === "success"
  const isError = progress.status === "error"
  const isProcessing = progress.status === "processing"
  const isUploading = progress.status === "uploading"

  // Banner variant for lesson videos list
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "p-4 rounded-xl border transition-all duration-300 shadow-2xs flex flex-col gap-3",
          isComplete
            ? "bg-emerald-50/70 border-emerald-200"
            : isError
            ? "bg-red-50/70 border-red-200"
            : "bg-amber-50/40 border-amber-200/80",
          className
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                "size-8 rounded-lg flex items-center justify-center shrink-0",
                isComplete
                  ? "bg-emerald-100 text-emerald-700"
                  : isError
                  ? "bg-red-100 text-red-600"
                  : "bg-amber-100 text-amber-800"
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="size-4" />
              ) : isError ? (
                <AlertCircle className="size-4" />
              ) : isProcessing ? (
                <Loader2 className="size-4 animate-spin text-amber-700" />
              ) : (
                <UploadCloud className="size-4 text-brand-orange animate-pulse" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-900 truncate">
                {title || fileName || "Video upload"}
              </span>
              <span className="text-[11px] text-zinc-500">
                {isComplete ? (
                  "Upload completed successfully (100%)"
                ) : isError ? (
                  progress.error || "Upload failed"
                ) : isProcessing ? (
                  "Upload complete. Processing video on server..."
                ) : (
                  <>
                    <span>Uploading: </span>
                    <strong className="text-zinc-800">{percentage}%</strong>
                    <span className="mx-1 text-zinc-400">•</span>
                    <span className="text-amber-800 font-medium">
                      {remainingPercentage}% remaining
                    </span>
                    {progress.estimated && progress.estimated > 0 && (
                      <>
                        <span className="mx-1 text-zinc-400">•</span>
                        <span>{formatRemainingTime(progress.estimated)}</span>
                      </>
                    )}
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isComplete && !isError && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-2.5 py-1 text-[11px] font-medium text-red-600 hover:text-red-700 hover:bg-red-100/60 rounded-lg transition-colors cursor-pointer"
              >
                Cancel upload
              </button>
            )}
            {(isComplete || isError) && onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!isComplete && !isError && (
          <div className="w-full bg-zinc-200/70 h-2 rounded-full overflow-hidden relative">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300 ease-out",
                isProcessing
                  ? "w-full bg-gradient-to-r from-amber-400 via-brand-orange to-amber-500 animate-pulse"
                  : "bg-gradient-to-r from-amber-400 to-brand-orange"
              )}
              style={{ width: isProcessing ? "100%" : `${percentage}%` }}
            />
          </div>
        )}
      </div>
    )
  }

  // Modal variant - detailed & professional
  return (
    <div
      className={cn(
        "rounded-2xl border p-4.5 transition-all duration-300 shadow-xs flex flex-col gap-3.5",
        isComplete
          ? "bg-emerald-50/50 border-emerald-200/80"
          : isError
          ? "bg-red-50/50 border-red-200/80"
          : "bg-gradient-to-b from-amber-50/40 to-white border-amber-200/80",
        className
      )}
    >
      {/* File & Status Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "size-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs",
              isComplete
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : isError
                ? "bg-red-100 text-red-600 border border-red-200"
                : "bg-amber-100/90 text-amber-800 border border-amber-200/70"
            )}
          >
            {isComplete ? (
              <CheckCircle2 className="size-5" />
            ) : isError ? (
              <AlertCircle className="size-5" />
            ) : isProcessing ? (
              <Loader2 className="size-5 animate-spin text-amber-800" />
            ) : (
              <Film className="size-5 text-brand-orange" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-zinc-900 truncate">
                {title || fileName || "Video Upload"}
              </span>
              {fileName && (
                <span className="text-[10px] text-zinc-400 hidden sm:inline font-mono">
                  ({fileName})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
              <span>
                {formatBytes(progress.loaded || 0)} /{" "}
                {formatBytes(progress.total || fileSize || 0)}
              </span>
              {progress.rate && progress.rate > 0 && !isComplete && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-zinc-600 font-medium">
                    <Zap className="size-3 text-amber-600" />
                    {formatBytes(progress.rate)}/s
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Badge: Percentage & Cancel */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex flex-col items-end">
            <span
              className={cn(
                "text-sm font-extrabold tracking-tight",
                isComplete
                  ? "text-emerald-700"
                  : isError
                  ? "text-red-600"
                  : "text-zinc-900"
              )}
            >
              {isComplete ? "100%" : `${percentage}%`}
            </span>

            {/* Remaining % Tag */}
            {!isComplete && !isError && (
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 border border-amber-200/80">
                {remainingPercentage}% remaining
              </span>
            )}
            {isComplete && (
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                Completed
              </span>
            )}
          </div>

          {!isComplete && !isError && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              title="Cancel upload"
              className="size-7 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar with Gradient & Pulse */}
      <div className="w-full bg-zinc-200/80 h-2.5 rounded-full overflow-hidden p-0.5 relative shadow-inner">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out relative",
            isComplete
              ? "bg-gradient-to-r from-emerald-500 to-green-600"
              : isError
              ? "bg-red-500"
              : isProcessing
              ? "bg-gradient-to-r from-amber-400 via-brand-orange to-amber-500 animate-pulse"
              : "bg-gradient-to-r from-amber-400 via-brand-orange to-orange-500 shadow-xs"
          )}
          style={{ width: isProcessing ? "100%" : `${Math.max(2, percentage)}%` }}
        >
          {/* Subtle sheen highlight */}
          <div className="absolute inset-0 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Status & Remaining Time Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        {/* Left Status Message */}
        <div className="flex items-center gap-1.5 text-zinc-600">
          {isUploading && (
            <>
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-brand-orange" />
              </span>
              <span className="font-medium text-zinc-700">
                Uploading video...
              </span>
            </>
          )}

          {isProcessing && (
            <>
              <Loader2 className="size-3.5 animate-spin text-amber-700" />
              <span className="font-semibold text-amber-800">
                Upload complete! Processing video on server...
              </span>
            </>
          )}

          {isComplete && (
            <>
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span className="font-semibold text-emerald-800">
                Video uploaded and saved successfully!
              </span>
            </>
          )}

          {isError && (
            <>
              <AlertCircle className="size-3.5 text-red-500" />
              <span className="font-semibold text-red-700">
                {progress.error || "An error occurred while uploading the video"}
              </span>
            </>
          )}
        </div>

        {/* Right Info: Time Remaining or Finished */}
        <div className="text-zinc-500 text-[11px] font-medium flex items-center gap-1">
          {isUploading && progress.estimated && progress.estimated > 0 ? (
            <div className="flex items-center gap-1 text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded-md border border-amber-200/50">
              <Clock className="size-3 text-amber-700" />
              <span>{formatRemainingTime(progress.estimated)}</span>
            </div>
          ) : isUploading ? (
            <span className="text-zinc-400">Calculating remaining time...</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
