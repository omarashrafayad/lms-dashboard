import { SessionItem } from "../types/session.types"

export interface NormalizedSessionDetail {
  id: string
  sessionNumber: string
  title: string
  description: string
  status: string
  statusStyle: { badge: string; dot: string }
  subjectOrCourse: string
  courseId: string | null
  courseName: string | null
  subjectId: string | null
  subjectName: string | null
  date: string
  startTime: string
  endTime: string
  duration: string
  meetingUrl: string | null
  isLive: boolean
  maxStudents: number
  bookedCount: number
  seatsLeft: number

  student: {
    id: string
    name: string
    grade: string
    educationStage: string
    viewUrl: string
  }

  teacher: {
    id: string
    name: string
    subject: string
    availability: string
    isAvailable: boolean
    viewUrl: string
  }

  booking: {
    id: string
    code: string
    requestedDate: string
    requestedTime: string
    createdAt: string
    status: string
    paymentStatus: string
    isPaid: boolean
    totalPayment: string
  }

  timeline: Array<{
    id: string | number
    title: string
    subtitle?: string
    description?: string
    formattedTime?: string
    timestamp?: string
    completed?: boolean
  }>
}

export function getSessionStatusBadge(status: string) {
  switch (status) {
    case "In Progress":
      return {
        badge: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
        dot: "bg-[#D97706]",
      }
    case "Upcoming":
    case "Scheduled":
      return {
        badge: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]",
        dot: "bg-[#0284C7]",
      }
    case "Completed":
      return {
        badge: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]",
        dot: "bg-[#16A34A]",
      }
    case "Missed":
      return {
        badge: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]",
        dot: "bg-[#DC2626]",
      }
    case "Cancelled":
      return {
        badge: "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]",
        dot: "bg-[#64748B]",
      }
    default:
      return {
        badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
        dot: "bg-zinc-400",
      }
  }
}

export function normalizeSessionDetail(raw: any): NormalizedSessionDetail {
  if (!raw) {
    throw new Error("No session data provided")
  }

  const rawInfo = raw.sessionInformation || {}
  const rawStudent = raw.student || {}
  const rawTeacher = raw.teacher || {}
  const rawBooking = raw.bookingInformation || raw.booking || {}

  const currentStatus =
    raw.status || raw.sessionStatus || rawInfo.status || rawInfo.sessionStatus || "Upcoming"

  const sessionNumber =
    raw.sessionNumber ||
    raw.sessionId ||
    raw.sessionCode ||
    rawInfo.sessionNumber ||
    rawInfo.sessionId ||
    raw.formattedSessionId ||
    `#${(raw.id || "").slice(0, 8)}`

  const studentId = raw.studentId || rawStudent.id || ""
  const studentName = raw.studentName || rawStudent.name || "Student"
  const studentGrade =
    raw.studentGrade ||
    rawStudent.academicYear ||
    rawStudent.academicStage ||
    raw.academicYear ||
    raw.educationStage ||
    rawStudent.educationStage ||
    "General Grade"

  const teacherId = raw.teacherId || rawTeacher.id || ""
  const teacherName = raw.teacherName || rawTeacher.name || "Teacher"
  const teacherSubject =
    raw.teacherSubject ||
    rawTeacher.subject ||
    raw.subject ||
    raw.subjectName ||
    "Instructor"
  const isTeacherAvailable =
    raw.isTeacherAvailable ?? rawTeacher.isAvailable ?? true
  const teacherAvailability =
    raw.teacherAvailability ||
    rawTeacher.availability ||
    (isTeacherAvailable ? "Available" : "Busy")

  const subjectOrCourse =
    raw.subject ||
    raw.subjectName ||
    raw.courseName ||
    raw.subjectOrCourse ||
    rawStudent.subjectOrCourse ||
    "General"

  const date =
    raw.date ||
    raw.formattedDate ||
    rawInfo.date ||
    (raw.formattedDateTime ? raw.formattedDateTime.split(" ")[0] : null) ||
    (raw.scheduledStart ? new Date(raw.scheduledStart).toLocaleDateString() : "Today")

  const startTime =
    raw.startTime ||
    raw.time ||
    rawInfo.startTime ||
    rawInfo.time ||
    (raw.scheduledStart ? new Date(raw.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "10:00 AM")

  const endTime =
    raw.endTime ||
    rawInfo.endTime ||
    (raw.scheduledEnd ? new Date(raw.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "11:00 AM")

  const duration =
    raw.duration ||
    (raw.durationMinutes ? `${raw.durationMinutes} min` : null) ||
    (rawInfo.durationMinutes ? `${rawInfo.durationMinutes} min` : "60 min")

  const bookingId =
    raw.bookingId ||
    rawBooking.bookingId ||
    raw.bookingCode ||
    rawBooking.bookingCode ||
    `BK-${(raw.id || "").slice(0, 6)}`

  const bookingStatus =
    raw.bookingStatus ||
    rawBooking.bookingStatus ||
    rawBooking.status ||
    "Confirmed"

  const requestedDate =
    raw.requestedDate ||
    rawBooking.requestedDate ||
    date

  const requestedTime =
    raw.requestedTime ||
    rawBooking.requestedTime ||
    startTime

  const bookingCreatedAt =
    raw.bookingCreatedAt ||
    rawBooking.createdAtFormatted ||
    rawBooking.createdAt ||
    date

  const paymentStatus =
    raw.paymentStatus ||
    raw.payment ||
    (raw.isPaid ? "Paid" : "Unpaid")

  const timelineRaw = raw.activityTimeline || raw.timeline || []
  const timeline = Array.isArray(timelineRaw) && timelineRaw.length > 0
    ? timelineRaw.map((t: any, idx: number) => ({
        id: t.id || idx + 1,
        title: t.title || "Session Event",
        subtitle: t.formattedTime || t.description || t.timestamp || "",
        description: t.description,
        formattedTime: t.formattedTime,
        timestamp: t.timestamp,
        completed: t.isCompleted ?? t.completed ?? true,
      }))
    : [
        {
          id: 1,
          title: "Session Scheduled",
          subtitle: `${date} · ${startTime}`,
          completed: true,
        },
      ]

  return {
    id: raw.id,
    sessionNumber,
    title: raw.title || `Session ${sessionNumber}`,
    description: raw.description || "",
    status: currentStatus,
    statusStyle: getSessionStatusBadge(currentStatus),
    subjectOrCourse,
    courseId: raw.courseId || null,
    courseName: raw.courseName || null,
    subjectId: raw.subjectId || null,
    subjectName: raw.subjectName || null,
    date,
    startTime,
    endTime,
    duration,
    meetingUrl: raw.meetingUrl || null,
    isLive: Boolean(raw.isLive),
    maxStudents: raw.maxStudents || 1,
    bookedCount: raw.bookedCount || 1,
    seatsLeft: raw.seatsLeft ?? Math.max(0, (raw.maxStudents || 1) - (raw.bookedCount || 1)),

    student: {
      id: studentId,
      name: studentName,
      grade: studentGrade,
      educationStage: raw.educationStage || rawStudent.educationStage || "",
      viewUrl: rawStudent.viewUrl || (studentId ? `/student/${studentId}` : "#"),
    },

    teacher: {
      id: teacherId,
      name: teacherName,
      subject: teacherSubject,
      availability: teacherAvailability,
      isAvailable: isTeacherAvailable,
      viewUrl: rawTeacher.viewUrl || (teacherId ? `/teacher/${teacherId}` : "#"),
    },

    booking: {
      id: rawBooking.id || raw.id,
      code: bookingId,
      requestedDate,
      requestedTime,
      createdAt: bookingCreatedAt,
      status: bookingStatus,
      paymentStatus,
      isPaid: Boolean(raw.isPaid || paymentStatus === "Paid"),
      totalPayment: raw.totalPayment || "200 EGP",
    },

    timeline,
  }
}
