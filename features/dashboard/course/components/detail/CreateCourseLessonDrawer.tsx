"use client"

import * as React from "react"
import { X, UploadCloud, FileVideo } from "lucide-react"
import { toast } from "sonner"
import { CourseLessonItem } from "../../types/course.types"

export interface CreateCourseLessonDrawerProps {
  isOpen: boolean
  onClose: () => void
  onAddLesson: (lesson: CourseLessonItem) => void
  totalExistingLessons: number
}

export function CreateCourseLessonDrawer({
  isOpen,
  onClose,
  onAddLesson,
  totalExistingLessons,
}: CreateCourseLessonDrawerProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [offlineAvailable, setOfflineAvailable] = React.useState(false)
  const [videoFile, setVideoFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please enter a lesson title")
      return
    }

    const newLesson: CourseLessonItem = {
      id: `lesson-custom-${Date.now()}`,
      order: totalExistingLessons + 1,
      title: title.trim(),
      type: "Video",
      duration: "25 min",
      offlineAvailable,
      description: description.trim(),
    }

    onAddLesson(newLesson)
    toast.success("Course lesson created successfully")
    setTitle("")
    setDescription("")
    setOfflineAvailable(false)
    setVideoFile(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header matching Image 4 */}
        <div className="p-6 border-b border-zinc-100 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Create Course Lesson
            </h2>
            <p className="text-xs text-zinc-400 font-normal leading-relaxed">
              Create a lesson specifically for this course. This lesson will only be available inside this course.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-xl border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body matching Image 4 */}
        <form id="create-lesson-form" onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
          {/* Lesson Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              LESSON TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Fractions"
              className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          {/* Short Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              SHORT DESCRIPTION <span className="normal-case font-normal text-zinc-400">· optional</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Briefly describe what this lesson covers..."
              className="w-full p-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs resize-none"
            />
          </div>

          {/* Video Upload Dropzone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              VIDEO UPLOAD
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="video/mp4,video/quicktime"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50/80 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors text-center group"
            >
              {videoFile ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <FileVideo className="size-4" />
                  <span>{videoFile.name}</span>
                </div>
              ) : (
                <>
                  <div className="size-11 rounded-full bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0">
                    <UploadCloud className="size-5 stroke-[2]" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-800">
                    Drag & drop a video here
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                    className="h-8 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    Browse Files
                  </button>
                  <span className="text-[11px] text-zinc-400 font-normal">
                    Supported formats: MP4 / MOV · Maximum size: 2GB
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Offline Available Toggle Card matching Image 4 */}
          <div className="p-4 rounded-2xl border border-zinc-200/80 bg-white shadow-2xs flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-900">
                Offline Available
              </span>
              <span className="text-[11px] text-zinc-400 mt-0.5">
                Allow enrolled students to download this lesson for offline viewing.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setOfflineAvailable(!offlineAvailable)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                offlineAvailable ? "bg-[#F59E0B]" : "bg-zinc-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  offlineAvailable ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </form>

        {/* Footer Actions matching Image 4 */}
        <div className="p-6 border-t border-zinc-100 flex items-center justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-lesson-form"
            className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
          >
            Create Lesson
          </button>
        </div>
      </div>
    </div>
  )
}
