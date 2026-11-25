"use client"

import * as React from "react"
import {
  X,
  User,
  BookOpen,
  Award,
  Calendar,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  GraduationCap,
} from "lucide-react"
import { TeacherStudent } from "../types/teacherPortal.types"

interface TeacherStudentDetailModalProps {
  student: TeacherStudent | null
  isOpen: boolean
  onClose: () => void
}

export function TeacherStudentDetailModal({
  student,
  isOpen,
  onClose,
}: TeacherStudentDetailModalProps) {
  const [feedbackText, setFeedbackText] = React.useState("")
  const [feedbackSent, setFeedbackSent] = React.useState(false)

  if (!isOpen || !student) return null

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackText.trim()) return
    setFeedbackSent(true)
    setTimeout(() => {
      setFeedbackSent(false)
      setFeedbackText("")
      alert("Feedback note successfully logged and delivered to student!")
    }, 800)
  }

  const isAtRisk = student.status === "at_risk"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              Student Academic Dossier
            </span>
            <span className="text-xs text-zinc-400 font-mono">ID: {student.studentId}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs text-zinc-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl overflow-hidden bg-zinc-200 border-2 border-zinc-300 shrink-0">
                <img src={student.avatar} alt={student.fullName} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-zinc-900">{student.fullName}</h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isAtRisk
                        ? "bg-rose-100 text-rose-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {student.status.replace("_", " ")}
                  </span>
                </div>
                <span className="text-zinc-500 font-medium">
                  {student.grade} • Enrolled: {student.enrolledCourse}
                </span>
                <span className="text-[11px] text-zinc-400">
                  Last Active: {student.lastActivity}
                </span>
              </div>
            </div>
          </div>

          {/* At-Risk Warning Box if applicable */}
          {isAtRisk && student.riskReasons && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                <AlertTriangle className="size-4 text-rose-600 shrink-0" />
                <span>Academic Risk Indicators Identified:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-rose-800 text-xs">
                {student.riskReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 4 Academic KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
              <span className="text-[11px] text-zinc-400 font-medium">Course Progress</span>
              <span className="text-xl font-extrabold text-blue-700">{student.courseProgress}%</span>
              <span className="text-[10px] text-zinc-400">Syllabus Covered</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
              <span className="text-[11px] text-zinc-400 font-medium">Average Score</span>
              <span className={`text-xl font-extrabold ${student.averageScore >= 75 ? "text-emerald-700" : "text-rose-700"}`}>
                {student.averageScore}%
              </span>
              <span className="text-[10px] text-zinc-400">All Assessments</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
              <span className="text-[11px] text-zinc-400 font-medium">Attendance Rate</span>
              <span className="text-xl font-extrabold text-purple-700">{student.attendanceRate}%</span>
              <span className="text-[10px] text-zinc-400">{student.attendedSessions} / {student.totalSessions} Sessions</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
              <span className="text-[11px] text-zinc-400 font-medium">Missed Sessions</span>
              <span className="text-xl font-extrabold text-zinc-800">{student.missedSessions}</span>
              <span className="text-[10px] text-zinc-400">{student.lateSessions} Late Logins</span>
            </div>
          </div>

          {/* Teacher Private Feedback / Intervention Note Form */}
          <form onSubmit={handleSendFeedback} className="flex flex-col gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <h4 className="font-bold text-zinc-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Send className="size-3.5 text-blue-600" />
              Send Academic Guidance / Private Feedback Note
            </h4>
            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write a constructive message or reminder for the student regarding lectures or assignments..."
              className="w-full p-3 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="submit"
              disabled={feedbackSent}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs w-fit transition-colors cursor-pointer disabled:opacity-50"
            >
              {feedbackSent ? "Sending Note..." : "Dispatch Note to Student"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100 bg-zinc-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white font-semibold text-zinc-700 text-xs hover:bg-zinc-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
