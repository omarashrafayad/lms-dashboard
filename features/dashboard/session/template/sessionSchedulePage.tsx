"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Search,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { ScheduleSessionStepper } from "../components/schedule/ScheduleSessionStepper"
import { mockStudentsList, mockTeachersList } from "../data/mockSessions"
import { StudentOptionItem, TeacherOptionItem, SessionType } from "../types/session.types"
import { useCreateSession } from "../hooks/useSessions"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface SlotOption {
  time: string
  status: "Available" | "Booked" | "Unavailable"
}

export const SCHEDULE_TIME_SLOTS: SlotOption[] = [
  { time: "9:00 AM", status: "Booked" },
  { time: "10:00 AM", status: "Available" },
  { time: "11:00 AM", status: "Unavailable" },
  { time: "4:00 PM", status: "Available" },
  { time: "5:00 PM", status: "Available" },
  { time: "6:00 PM", status: "Booked" },
  { time: "7:00 PM", status: "Available" },
  { time: "8:00 PM", status: "Unavailable" },
]

export default function SessionSchedulePage() {
  const router = useRouter()
  const createMutation = useCreateSession()

  const [currentStep, setCurrentStep] = React.useState(1)

  // Step 1: Student (default: Ahmed Ali)
  const [studentSearch, setStudentSearch] = React.useState("")
  const [selectedStudent, setSelectedStudent] = React.useState<StudentOptionItem>(
    mockStudentsList[0]
  )

  // Step 2: Teacher (default: Sara Mohamed)
  const [selectedTeacher, setSelectedTeacher] = React.useState<TeacherOptionItem>(
    mockTeachersList[0]
  )

  // Step 3: Date & Time (default: Oct 01, 2026 & 10:00 AM matching screenshots)
  const [date, setDate] = React.useState("Oct 01, 2026")
  const [startTime, setStartTime] = React.useState("10:00 AM")

  // Step 4: Session Details (Duration, Type, Subject, Notes)
  const [subject, setSubject] = React.useState("Mathematics")
  const [duration, setDuration] = React.useState("60 min")
  const [sessionType, setSessionType] = React.useState<SessionType>("Private 1:1")
  const [notes, setNotes] = React.useState("")

  // Filtered Students for Step 1
  const filteredStudents = mockStudentsList.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.grade.toLowerCase().includes(studentSearch.toLowerCase())
  )

  // Auto-fill subject when teacher changes
  React.useEffect(() => {
    if (selectedTeacher) {
      if (selectedTeacher.subject.includes("Math")) setSubject("Mathematics")
      else if (selectedTeacher.subject.includes("English")) setSubject("English")
      else if (selectedTeacher.subject.includes("Physics")) setSubject("Physics")
      else if (selectedTeacher.subject.includes("Chemistry")) setSubject("Chemistry")
      else if (selectedTeacher.subject.includes("Biology")) setSubject("Biology")
    }
  }, [selectedTeacher])

  const getStudentLevelBadge = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-[#E0F2FE] text-[#0284C7] border border-sky-200/60"
      case "Intermediate":
        return "bg-[#F3E8FF] text-[#7E22CE] border border-purple-200/60"
      case "Advanced":
        return "bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]/60"
      default:
        return "bg-zinc-100 text-zinc-700"
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && !selectedStudent) {
      toast.error("Please select a student")
      return
    }
    if (currentStep === 2 && !selectedTeacher) {
      toast.error("Please select a teacher")
      return
    }
    if (currentStep === 3 && !startTime) {
      toast.error("Please select a time slot")
      return
    }
    if (currentStep === 4 && !subject.trim()) {
      toast.error("Please specify a subject")
      return
    }
    setCurrentStep((prev) => Math.min(5, prev + 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const handleConfirmSchedule = async () => {
    try {
      await createMutation.mutateAsync({
        studentId: selectedStudent.id,
        teacherId: selectedTeacher.id,
        date,
        startTime,
        duration,
        subject,
        sessionType,
        notes,
      })

      toast.success("Session scheduled successfully!")
      router.push("/sessions")
    } catch {
      toast.error("Failed to schedule session.")
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-24 animate-in fade-in duration-200">
        {/* Top Back Link matching Screenshots */}
        <div>
          <Link
            href="/sessions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to All Sessions</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Schedule Session
          </h1>
        </div>

        {/* 5-Step Horizontal Stepper matching Screenshots */}
        <ScheduleSessionStepper
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* =================================================================== */}
        {/* STEP 1: Select Student (Image 4 from previous turn) */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Select Student
            </h2>

            {/* Search students... */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
              />
            </div>

            {/* Student Cards List */}
            <div className="flex flex-col gap-2.5">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudent?.id === student.id

                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#F59E0B] bg-[#FFF9F2]/70 shadow-2xs"
                        : "border-zinc-200/80 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="size-9 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {student.name.charAt(0)}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-900">
                          {student.name}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-normal">
                          {student.grade}
                        </span>
                      </div>
                    </div>

                    {/* Level Badge */}
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${getStudentLevelBadge(
                        student.level
                      )}`}
                    >
                      {student.level}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: Select Teacher (Image 5 from previous turn) */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                Select Teacher
              </h2>
              <p className="text-xs text-zinc-400 font-normal">
                Only teachers who can teach the selected subject/course are shown.
              </p>
            </div>

            {/* Teacher Cards List */}
            <div className="flex flex-col gap-2.5">
              {mockTeachersList.map((teacher) => {
                const isSelected = selectedTeacher?.id === teacher.id

                return (
                  <div
                    key={teacher.id}
                    onClick={() => setSelectedTeacher(teacher)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#F59E0B] bg-[#FFF9F2]/70 shadow-2xs"
                        : "border-zinc-200/80 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900">
                        {teacher.name}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-normal">
                        {teacher.subject}
                      </span>
                    </div>

                    {/* Availability Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        teacher.availability === "Available"
                          ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
                          : "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          teacher.availability === "Available"
                            ? "bg-[#16A34A]"
                            : "bg-[#D97706]"
                        }`}
                      />
                      {teacher.availability}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: Select Date & Time (Image 1 of new user upload) */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Select Date & Time
            </h2>

            {/* DATE · upcoming dates only */}
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
                placeholder="e.g. Oct 01, 2026"
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
              />
            </div>

            {/* AVAILABLE SLOTS — SARA MOHAMED matching Image 1 */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                AVAILABLE SLOTS —{" "}
                {selectedTeacher
                  ? selectedTeacher.name.toUpperCase()
                  : "TEACHER"}
              </label>

              {/* 4 Columns x 2 Rows Grid matching Image 1 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SCHEDULE_TIME_SLOTS.map((slot) => {
                  const isSelectable = slot.status === "Available"
                  const isSelected = startTime === slot.time

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!isSelectable}
                      onClick={() => isSelectable && setStartTime(slot.time)}
                      className={`h-16 rounded-xl flex flex-col items-center justify-center transition-all border ${
                        !isSelectable
                          ? "border-zinc-200/80 bg-zinc-50/70 text-zinc-400 cursor-not-allowed"
                          : isSelected
                          ? "border-[#F59E0B] bg-[#FFF9F2] shadow-2xs cursor-pointer ring-1 ring-[#F59E0B]"
                          : "border-zinc-200 bg-white hover:border-zinc-300 cursor-pointer"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${
                          !isSelectable
                            ? "text-zinc-400"
                            : isSelected
                            ? "text-zinc-900"
                            : "text-zinc-800"
                        }`}
                      >
                        {slot.time}
                      </span>
                      <span
                        className={`text-[11px] font-normal mt-0.5 ${
                          !isSelectable
                            ? "text-zinc-400"
                            : isSelected
                            ? "text-[#D97706] font-medium"
                            : "text-zinc-500"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: Session Details (Image 2 of new user upload) */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Session Details
            </h2>

            {/* SUBJECT / COURSE * */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                SUBJECT / COURSE *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
              />
            </div>

            {/* 2-Column Row: DATE & START TIME matching Image 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  DATE
                </label>
                <div className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 text-xs text-zinc-800 flex items-center font-normal">
                  {date}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  START TIME
                </label>
                <div className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 text-xs text-zinc-800 flex items-center font-normal">
                  {startTime}
                </div>
              </div>
            </div>

            {/* 2-Column Row: DURATION * & SESSION TYPE matching Image 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  SESSION TYPE
                </label>
                <Select
                  value={sessionType}
                  onValueChange={(val: any) => setSessionType(val)}
                >
                  <SelectTrigger className="h-10 px-3.5 rounded-xl border-zinc-200 text-xs text-zinc-900 bg-white shadow-2xs">
                    <SelectValue placeholder="Select type" />
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
                placeholder="Add any notes for this session."
                className="w-full p-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs resize-none"
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: Review (Image 3 of new user upload) */}
        {/* =================================================================== */}
        {currentStep === 5 && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Review
            </h2>

            {/* 2-Column Review Card matching Image 3 */}
            <div className="rounded-2xl border border-zinc-200/80 p-6 sm:p-8 bg-white shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                {/* Column 1 (Left) */}
                <div className="flex flex-col gap-6">
                  {/* STUDENT */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      STUDENT
                    </span>
                    <span className="text-sm font-bold text-zinc-900">
                      {selectedStudent.name}
                    </span>
                  </div>

                  {/* SUBJECT */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      SUBJECT
                    </span>
                    <span className="text-sm font-bold text-zinc-900">
                      {subject}
                    </span>
                  </div>

                  {/* TIME */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      TIME
                    </span>
                    <span className="text-sm font-bold text-zinc-900">
                      {startTime}
                    </span>
                  </div>

                  {/* SESSION TYPE */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      SESSION TYPE
                    </span>
                    <span className="text-sm font-bold text-zinc-900">
                      {sessionType}
                    </span>
                  </div>
                </div>

                {/* Column 2 (Right) */}
                <div className="flex flex-col gap-6">
                  {/* TEACHER */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      TEACHER
                    </span>
                    <span className="text-sm font-bold text-zinc-900">
                      {selectedTeacher.name}
                    </span>
                  </div>

                  {/* DATE */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      DATE
                    </span>
                    <span className="text-sm font-bold text-zinc-900">
                      {date}
                    </span>
                  </div>

                  {/* DURATION */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      DURATION
                    </span>
                    <span className="text-sm font-bold text-zinc-900">
                      {duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Actions matching Images 1, 2, 3 */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/sessions"
            className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
          >
            Cancel
          </Link>

          <div className="flex items-center gap-2.5">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="size-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmSchedule}
                disabled={createMutation.isPending}
                className="h-10 px-7 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                {createMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                <span>Create Session</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
