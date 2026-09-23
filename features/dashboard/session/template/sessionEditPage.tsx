"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Loader2, Save } from "lucide-react"
import { useSessionDetail, useUpdateSession } from "../hooks/useSessions"
import { mockTeachersList } from "../data/mockSessions"
import { SessionType } from "../types/session.types"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface SessionEditPageProps {
  sessionId: string
}

const AVAILABLE_TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
]

export default function SessionEditPage({ sessionId }: SessionEditPageProps) {
  const router = useRouter()
  const { data: session, isLoading } = useSessionDetail(sessionId)
  const updateMutation = useUpdateSession(sessionId)

  const [teacherName, setTeacherName] = React.useState("")
  const [date, setDate] = React.useState("")
  const [startTime, setStartTime] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [duration, setDuration] = React.useState("60 min")
  const [sessionType, setSessionType] = React.useState<SessionType>("Private 1:1")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (session) {
      setTeacherName(session.teacherName || "Sara Mohamed")
      setDate(session.date || "Sep 23, 2026")
      setStartTime(session.startTime || "11:00 AM")
      setSubject(session.subject || "Physics")
      setDuration(session.duration || "60 min")
      setSessionType(session.sessionType || "Private 1:1")
      setNotes(session.notes || "Focus on kinematics revision.")
    }
  }, [session])

  const handleSave = async () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject")
      return
    }

    try {
      await updateMutation.mutateAsync({
        teacherName,
        date,
        startTime,
        subject,
        duration,
        sessionType,
        notes,
      })

      toast.success("Session updated successfully!")
      router.push(`/sessions/${sessionId}`)
    } catch {
      toast.error("Failed to update session.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 className="size-8 animate-spin text-[#F59E0B]" />
        <span className="text-xs text-zinc-500 font-medium">Loading session...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-24 animate-in fade-in duration-200">
        {/* Top Back Link matching Image 3 */}
        <div>
          <Link
            href="/sessions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to All Sessions</span>
          </Link>
        </div>

        {/* Page Title Header matching Image 3 */}
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Edit Session
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Session {session?.sessionNumber || `#${sessionId}`}
          </p>
        </div>

        {/* Edit Form Card matching Image 3 */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6">
          {/* TEACHER */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              TEACHER
            </label>
            <Select value={teacherName} onValueChange={setTeacherName}>
              <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-900 bg-white shadow-2xs">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200">
                {mockTeachersList.map((t) => (
                  <SelectItem key={t.id} value={t.name} className="text-xs">
                    {t.name} ({t.subject})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DATE */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
              <span>DATE</span>
              <span className="text-zinc-400 font-normal normal-case">
                · upcoming dates only
              </span>
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. Sep 23, 2026"
              className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          {/* START TIME: 8 Slot Buttons in 2 Rows matching Image 3 */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              START TIME
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {AVAILABLE_TIME_SLOTS.map((slot) => {
                const isSelected = startTime === slot
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setStartTime(slot)}
                    className={`h-10 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? "border-[#F59E0B] bg-[#FFF9F2] text-zinc-900 font-bold shadow-2xs"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>

          {/* SUBJECT / COURSE * */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              SUBJECT / COURSE *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics"
              className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          {/* 2-Column Row: DURATION * & SESSION TYPE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* DURATION * */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                DURATION *
              </label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-900 bg-white shadow-2xs">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-200">
                  <SelectItem value="30 min" className="text-xs">
                    30 min
                  </SelectItem>
                  <SelectItem value="45 min" className="text-xs">
                    45 min
                  </SelectItem>
                  <SelectItem value="60 min" className="text-xs">
                    60 min
                  </SelectItem>
                  <SelectItem value="90 min" className="text-xs">
                    90 min
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SESSION TYPE */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                SESSION TYPE
              </label>
              <Select
                value={sessionType}
                onValueChange={(val: any) => setSessionType(val)}
              >
                <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-900 bg-white shadow-2xs">
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-200">
                  <SelectItem value="Private 1:1" className="text-xs">
                    Private 1:1
                  </SelectItem>
                  <SelectItem value="Group" className="text-xs">
                    Group
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* NOTES · optional */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
              <span>NOTES</span>
              <span className="text-zinc-400 font-normal normal-case">
                · optional
              </span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any specific session goals, agenda, or reminders..."
              className="w-full p-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs resize-none"
            />
          </div>
        </div>

        {/* Footer Actions Bar matching Image 3 */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/sessions/${sessionId}`}
            className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </main>
    </div>
  )
}
