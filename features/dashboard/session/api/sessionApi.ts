import clientAxios from "@/lib/axios/clientAxios"
import {
  SessionItem,
  SessionFilterState,
  ScheduleSessionPayload,
} from "../types/session.types"
import {
  mockSessionsList,
  mockStudentsList,
  mockTeachersList,
} from "../data/mockSessions"

let localSessions = [...mockSessionsList]

export const getSessionList = async (
  filters: Partial<SessionFilterState> = {}
): Promise<SessionItem[]> => {
  try {
    const res = await clientAxios.get("/sessions", { params: filters })
    if (Array.isArray(res.data)) return res.data
    if (res.data?.data && Array.isArray(res.data.data)) return res.data.data
  } catch (err) {
    // fallback to local mock
  }

  let filtered = [...localSessions]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (s) =>
        s.studentName.toLowerCase().includes(q) ||
        s.teacherName.toLowerCase().includes(q) ||
        s.sessionNumber.toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q)
    )
  }

  if (filters.statusTab && filters.statusTab !== "All") {
    if (filters.statusTab === "Today") {
      filtered = filtered.filter((s) => s.date.includes("Sep 23"))
    } else {
      filtered = filtered.filter((s) => s.status === filters.statusTab)
    }
  }

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter(
      (s) => s.status.toLowerCase() === filters.status?.toLowerCase()
    )
  }

  if (filters.teacher && filters.teacher !== "all") {
    filtered = filtered.filter(
      (s) => s.teacherName.toLowerCase() === filters.teacher?.toLowerCase()
    )
  }

  if (filters.student && filters.student !== "all") {
    filtered = filtered.filter(
      (s) => s.studentName.toLowerCase() === filters.student?.toLowerCase()
    )
  }

  return filtered
}

export const getSessionById = async (id: string): Promise<SessionItem> => {
  try {
    const res = await clientAxios.get(`/sessions/${id}`)
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // fallback
  }

  const found = localSessions.find((s) => s.id === id)
  if (found) return found

  return localSessions[0]
}

export const updateSession = async (
  id: string,
  updatedData: Partial<SessionItem>
): Promise<SessionItem> => {
  try {
    const res = await clientAxios.put(`/sessions/${id}`, updatedData)
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // fallback
  }

  const index = localSessions.findIndex((s) => s.id === id)
  if (index !== -1) {
    localSessions[index] = {
      ...localSessions[index],
      ...updatedData,
    }
    return localSessions[index]
  }

  return localSessions[0]
}

export const cancelSession = async (id: string): Promise<SessionItem> => {
  return updateSession(id, {
    status: "Cancelled",
    paymentStatus: "Refunded",
  })
}

export const createSession = async (
  payload: ScheduleSessionPayload
): Promise<SessionItem> => {
  try {
    const res = await clientAxios.post("/sessions", payload)
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // fallback
  }

  const student = mockStudentsList.find((s) => s.id === payload.studentId)
  const teacher = mockTeachersList.find((t) => t.id === payload.teacherId)

  const newId = String(10484 + localSessions.length + 1)
  const newSession: SessionItem = {
    id: newId,
    sessionNumber: `#${newId}`,
    sessionType: payload.sessionType || "Private 1:1",
    studentId: payload.studentId,
    studentName: student?.name || "Student",
    studentGrade: student?.grade || "Grade 10",
    teacherId: payload.teacherId,
    teacherName: teacher?.name || "Teacher",
    teacherSubject: teacher?.subject || "Teacher",
    teacherAvailability: teacher?.availability || "Available",
    subject: payload.subject,
    date: payload.date || "Sep 28, 2026",
    startTime: payload.startTime || "10:00 AM",
    endTime: "11:00 AM",
    duration: payload.duration || "60 min",
    status: "Upcoming",
    paymentStatus: "Paid",
    totalPayment: "200 EGP",
    amountPoints: "300 Points",
    paymentDate: "Sep 23, 2026",
    bookingId: `BK-${Math.floor(4400 + Math.random() * 50)}`,
    bookingRequestedDate: payload.date || "Sep 28, 2026",
    bookingRequestedTime: payload.startTime || "10:00 AM",
    bookingCreatedAt: "Sep 23, 2026 · 1:00 PM",
    bookingStatus: "Confirmed",
    parentName: "Parent",
    notes: payload.notes || "",
    timeline: [
      {
        id: "t-1",
        title: "Booking Request Created",
        subtitle: "Sep 23, 2026 · 1:00 PM",
        completed: true,
      },
      {
        id: "t-2",
        title: "Session Confirmed",
        subtitle: "Booking confirmed",
        completed: true,
      },
      {
        id: "t-3",
        title: "Session Scheduled",
        subtitle: `${payload.date} · ${payload.startTime}`,
        completed: true,
      },
    ],
  }

  localSessions = [newSession, ...localSessions]
  return newSession
}
