"use client"

import * as React from "react"
import {
  X,
  Plus,
  UploadCloud,
  FileText,
  Video,
  HelpCircle,
  Paperclip,
  CheckCircle2,
  Calendar,
} from "lucide-react"

interface TeacherCreateLessonModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (data: any) => void
}

export function TeacherCreateLessonModal({
  isOpen,
  onClose,
  onSave,
}: TeacherCreateLessonModalProps) {
  const [title, setTitle] = React.useState("")
  const [shortDesc, setShortDesc] = React.useState("")
  const [subject, setSubject] = React.useState("Physics")
  const [course, setCourse] = React.useState("Advanced Physics: Mechanics & Modern Physics")
  const [unit, setUnit] = React.useState("Unit 3: Electromagnetism")
  const [chapter, setChapter] = React.useState("Chapter 1: Faraday's Law")
  const [lessonType, setLessonType] = React.useState<"video" | "pdf" | "text" | "quiz">("video")
  const [durationMins, setDurationMins] = React.useState(45)
  const [videoUrl, setVideoUrl] = React.useState("")
  const [allowPreview, setAllowPreview] = React.useState(true)
  const [allowDownload, setAllowDownload] = React.useState(true)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    if (!title) {
      alert("Please provide a lesson title.")
      return
    }
    if (onSave) {
      onSave({
        title,
        shortDesc,
        subject,
        course,
        unit,
        chapter,
        lessonType,
        durationMins,
        status: publish ? "published" : "draft",
      })
    }
    alert(publish ? "Lesson published successfully to students!" : "Lesson saved as draft!")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              Content Authoring Studio
            </span>
            <h3 className="font-bold text-sm text-zinc-900">
              Create New Lesson Module
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs text-zinc-700">
          {/* Section 1: Basic Information */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-xs text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">
              1. Basic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="font-semibold text-zinc-800">Lesson Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mutual Induction in Coupled Solenoids"
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-zinc-800">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                >
                  <option value="Physics">Physics</option>
                  <option value="Advanced Mechanics">Advanced Mechanics</option>
                  <option value="Mathematics">Mathematics</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-zinc-800">Target Course</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                >
                  <option value="Advanced Physics: Mechanics & Modern Physics">Advanced Physics: Mechanics & Modern Physics</option>
                  <option value="Secondary Physics Fundamentals & Thermodynamics">Secondary Physics Fundamentals & Thermodynamics</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-zinc-800">Curriculum Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-zinc-800">Chapter</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="font-semibold text-zinc-800">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Outline key learning outcomes and prerequisites..."
                  className="px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Lesson Content & Media */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-xs text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">
              2. Lesson Content & Media
            </h4>

            {/* Type Selector */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { type: "video", label: "Video Lecture", icon: Video },
                { type: "pdf", label: "PDF Document", icon: FileText },
                { type: "text", label: "Interactive Text", icon: FileText },
                { type: "quiz", label: "Formative Quiz", icon: HelpCircle },
              ].map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setLessonType(t.type as any)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      lessonType === t.type
                        ? "bg-blue-50 border-blue-500 text-blue-900 shadow-2xs font-bold"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    <Icon className="size-5" />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>

            {lessonType === "video" && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <label className="font-semibold text-zinc-800">Video Storage URL or Upload</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://commondatastorage.googleapis.com/... or Vimeo / YouTube embed URL"
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs focus:outline-hidden"
                />
                <span className="text-[11px] text-zinc-400">
                  Or drag & drop high-definition MP4 lecture video file (up to 2GB supported)
                </span>
              </div>
            )}

            {lessonType === "pdf" && (
              <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-zinc-300 hover:border-blue-500 hover:bg-blue-50/20 transition-all cursor-pointer">
                <UploadCloud className="size-8 text-zinc-400 mb-2" />
                <span className="font-bold text-zinc-700">Click to upload lesson PDF document</span>
                <span className="text-[11px] text-zinc-400 mt-0.5">Supports high-res lecture sheets & worksheets</span>
                <input type="file" className="hidden" />
              </label>
            )}
          </div>

          {/* Section 3: Settings & Permissions */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-xs text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">
              3. Lesson Settings & Access Controls
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-zinc-800">Estimated Duration (Mins)</label>
                <input
                  type="number"
                  value={durationMins}
                  onChange={(e) => setDurationMins(Number(e.target.value))}
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  checked={allowPreview}
                  onChange={(e) => setAllowPreview(e.target.checked)}
                  className="size-4 rounded accent-blue-600"
                />
                <label className="font-semibold text-zinc-700">Allow Free Sample Preview</label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                  className="size-4 rounded accent-blue-600"
                />
                <label className="font-semibold text-zinc-700">Allow Offline Downloads</label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md cursor-pointer"
            >
              Publish to Students
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
