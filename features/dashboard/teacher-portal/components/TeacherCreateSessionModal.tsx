"use client"

import * as React from "react"
import {
  X,
  Calendar,
  Clock,
  Video,
  Users,
  Paperclip,
  CheckCircle2,
  Globe,
  Link as LinkIcon,
} from "lucide-react"

interface TeacherCreateSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (session: any) => void
}

export function TeacherCreateSessionModal({
  isOpen,
  onClose,
  onSave,
}: TeacherCreateSessionModalProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [course, setCourse] = React.useState("Advanced Physics: Mechanics & Modern Physics")
  const [subject, setSubject] = React.useState("Physics")
  const [date, setDate] = React.useState("2025-11-28")
  const [startTime, setStartTime] = React.useState("17:00")
  const [endTime, setEndTime] = React.useState("18:30")
  const [platform, setPlatform] = React.useState("Google Meet")
  const [meetingUrl, setMeetingUrl] = React.useState("https://meet.google.com/lms-room")
  const [maxStudents, setMaxStudents] = React.useState(200)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) {
      alert("Please enter a session title.")
      return
    }
    if (onSave) {
      onSave({
        title,
        description,
        course,
        subject,
        date,
        startTime,
        endTime,
        platform,
        meetingUrl,
        maxStudents,
      })
    }
    alert("Live lecture session scheduled successfully!")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
              Session Scheduler
            </span>
            <h3 className="font-bold text-sm text-zinc-900">
              Schedule New Live Lecture / Webinar
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

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-zinc-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="font-semibold text-zinc-800">Session Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Problem Solving Workshop: AC Dynamos & Motors"
                className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-zinc-800">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-zinc-800">Target Course</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
              >
                <option value="Advanced Physics: Mechanics & Modern Physics">Advanced Physics</option>
                <option value="Secondary Physics Fundamentals & Thermodynamics">Physics Fundamentals</option>
                <option value="Applied Mathematical Physics & Vector Calculus">Applied Mechanics</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-zinc-800">Session Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-zinc-800">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-zinc-800">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-zinc-800">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom Meetings">Zoom Meetings</option>
                <option value="In-App Interactive Classroom">In-App WebRTC Classroom</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-zinc-800">Meeting Room URL</label>
              <input
                type="text"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://..."
                className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="font-semibold text-zinc-800">Description & Agenda</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify the key discussion topics, exercises to solve, and questions..."
                className="px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md cursor-pointer"
            >
              Schedule & Publish Session
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
