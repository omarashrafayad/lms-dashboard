"use client"

import * as React from "react"
import {
  X,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Edit,
} from "lucide-react"
import { TeacherSession } from "../types/teacherPortal.types"

interface AttendanceRecord {
  id: string
  studentName: string
  studentId: string
  joinTime: string
  leaveTime: string
  duration: string
  status: "present" | "absent" | "late" | "excused"
}

interface TeacherSessionDetailModalProps {
  session: TeacherSession | null
  isOpen: boolean
  onClose: () => void
}

export function TeacherSessionDetailModal({
  session,
  isOpen,
  onClose,
}: TeacherSessionDetailModalProps) {
  const [attendance, setAttendance] = React.useState<AttendanceRecord[]>([
    {
      id: "att-1",
      studentName: "Ahmed Mansour",
      studentId: "STU-88241",
      joinTime: "05:02 PM",
      leaveTime: "06:30 PM",
      duration: "88 mins",
      status: "present",
    },
    {
      id: "att-2",
      studentName: "Mariam El-Shazly",
      studentId: "STU-88119",
      joinTime: "05:00 PM",
      leaveTime: "06:30 PM",
      duration: "90 mins",
      status: "present",
    },
    {
      id: "att-3",
      studentName: "Kareem Adel",
      studentId: "STU-77402",
      joinTime: "—",
      leaveTime: "—",
      duration: "0 mins",
      status: "absent",
    },
    {
      id: "att-4",
      studentName: "Salma Youssef",
      studentId: "STU-66318",
      joinTime: "05:18 PM",
      leaveTime: "06:30 PM",
      duration: "72 mins",
      status: "late",
    },
    {
      id: "att-5",
      studentName: "Nouran Hatem",
      studentId: "STU-99430",
      joinTime: "05:01 PM",
      leaveTime: "06:30 PM",
      duration: "89 mins",
      status: "present",
    },
  ])

  if (!isOpen || !session) return null

  const handleStatusChange = (id: string, newStatus: AttendanceRecord["status"]) => {
    setAttendance((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
  }

  const presentCount = attendance.filter((r) => r.status === "present" || r.status === "late").length
  const absentCount = attendance.filter((r) => r.status === "absent").length
  const attendancePct = Math.round((presentCount / attendance.length) * 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
              Live Session Attendance Logger
            </span>
            <span className="text-xs text-zinc-400">• {session.subject}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs text-zinc-700">
          <div>
            <h2 className="text-base font-bold text-zinc-900 mb-1">
              {session.title}
            </h2>
            <span className="text-zinc-500">
              {session.course} • Scheduled: {session.date} ({session.startTime} - {session.endTime})
            </span>
          </div>

          {/* 4 Attendance Statistics KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col">
              <span className="text-[10px] text-zinc-400 font-medium">Registered Learners</span>
              <span className="text-xl font-extrabold text-zinc-900">{session.registeredStudents}</span>
              <span className="text-[10px] text-zinc-500">Enrolled in Cohort</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col">
              <span className="text-[10px] text-zinc-400 font-medium">Present Attendees</span>
              <span className="text-xl font-extrabold text-emerald-700">{session.attendanceCount || presentCount}</span>
              <span className="text-[10px] text-emerald-600">Joined Classroom</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col">
              <span className="text-[10px] text-zinc-400 font-medium">Absentees</span>
              <span className="text-xl font-extrabold text-rose-700">{session.absentCount || absentCount}</span>
              <span className="text-[10px] text-rose-600">Unexcused</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col">
              <span className="text-[10px] text-zinc-400 font-medium">Attendance Rate</span>
              <span className="text-xl font-extrabold text-purple-700">{attendancePct}%</span>
              <span className="text-[10px] text-purple-600">Live Participation</span>
            </div>
          </div>

          {/* Detailed Attendance Table */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                Student Attendance Audit Log
              </h3>
              <button
                type="button"
                onClick={() => alert("Exporting attendance spreadsheet (XLSX)...")}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-800 cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>Export Attendance Sheet</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-500 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Join Time</th>
                    <th className="py-2.5 px-3">Leave Time</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Attendance Status</th>
                    <th className="py-2.5 px-3 text-right">Manual Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {attendance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-zinc-50">
                      <td className="py-3 px-3 font-semibold text-zinc-900">{rec.studentName}</td>
                      <td className="py-3 px-3 font-mono text-zinc-600">{rec.studentId}</td>
                      <td className="py-3 px-3 text-zinc-600">{rec.joinTime}</td>
                      <td className="py-3 px-3 text-zinc-600">{rec.leaveTime}</td>
                      <td className="py-3 px-3 font-medium text-zinc-800">{rec.duration}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rec.status === "present"
                              ? "bg-emerald-100 text-emerald-800"
                              : rec.status === "late"
                              ? "bg-amber-100 text-amber-800"
                              : rec.status === "excused"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={rec.status}
                          onChange={(e) => handleStatusChange(rec.id, e.target.value as any)}
                          className="px-2 py-1 rounded-lg border border-zinc-200 bg-white text-[11px] font-medium text-zinc-700 cursor-pointer focus:outline-hidden"
                        >
                          <option value="present">Present</option>
                          <option value="late">Late</option>
                          <option value="absent">Absent</option>
                          <option value="excused">Excused</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50">
          <span className="text-xs text-zinc-400">
            Attendance entries automatically sync with the student&apos;s academic record card.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
