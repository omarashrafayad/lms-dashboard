export type SessionStatus = "In Progress" | "Upcoming" | "Completed" | "Missed" | "Cancelled"
export type PaymentStatus = "Paid" | "Refunded" | "Unpaid" | "Pending"
export type SessionType = "Private 1:1" | "Group"

export interface TimelineItem {
  id: string | number
  title: string
  subtitle?: string
  description?: string
  timestamp?: string
  formattedTime?: string
  status?: string
  completed?: boolean
  isCompleted?: boolean
}

export interface TeacherSlotItem {
  startTime?: string
  endTime?: string
  time?: string
  formattedTime?: string
  status?: string
  isAvailable?: boolean
  isBooked?: boolean
  isUnavailable?: boolean
  sessionId?: string
  sessionTitle?: string
}

export interface SessionItem {
  id: string
  sessionId?: string
  sessionCode?: string
  sessionNumber?: string
  formattedSessionId?: string
  sessionType: string
  studentId?: string
  studentName?: string
  studentGrade?: string
  teacherId?: string
  teacherName?: string
  teacherSubject?: string
  teacherAvailability?: string
  isTeacherAvailable?: boolean
  subject?: string
  subjectOrCourse?: string
  courseId?: string
  courseName?: string
  subjectId?: string
  subjectName?: string
  educationStage?: string
  academicStage?: string
  date?: string
  time?: string
  dateAndTime?: string
  formattedDateTime?: string
  formattedDate?: string
  scheduledStart?: string
  scheduledEnd?: string
  startTime?: string
  endTime?: string
  duration?: string
  durationMinutes?: number
  sessionStatus?: string
  status: string
  payment?: string
  paymentStatus?: string
  isPaid?: boolean
  totalPayment?: string
  amountPoints?: string
  paymentDate?: string
  bookingId?: string
  bookingCode?: string
  requestedDate?: string
  requestedTime?: string
  bookingRequestedDate?: string
  bookingRequestedTime?: string
  bookingCreatedAt?: string
  bookingStatus?: string
  parentName?: string
  meetingUrl?: string
  isLive?: boolean
  notes?: string
  student?: {
    id?: string
    name?: string
    academicYear?: string
    academicStage?: string
    educationStage?: string
    subjectOrCourse?: string
    viewUrl?: string
  }
  teacher?: {
    id?: string
    name?: string
    subject?: string
    availability?: string
    isAvailable?: boolean
    viewUrl?: string
  }
  bookingInformation?: {
    id?: string
    bookingId?: string
    bookingCode?: string
    requestedDate?: string
    requestedTime?: string
    createdAt?: string
    createdAtFormatted?: string
    bookingStatus?: string
    status?: string
  }
  booking?: {
    id?: string
    bookingId?: string
    bookingCode?: string
    requestedDate?: string
    requestedTime?: string
    createdAt?: string
    createdAtFormatted?: string
    bookingStatus?: string
    status?: string
  }
  sessionInformation?: {
    sessionId?: string
    sessionCode?: string
    sessionNumber?: string
    sessionType?: string
    date?: string
    startTime?: string
    endTime?: string
    duration?: string
    durationMinutes?: number
    sessionStatus?: string
    status?: string
    time?: string
  }
  activityTimeline?: TimelineItem[]
  timeline?: TimelineItem[]
  availableSlots?: TeacherSlotItem[]
}

export interface SessionFilterState {
  search: string
  statusTab: string
  date: string
  status: string
  teacher: string
  student: string
}

export interface SessionQueryParams {
  search?: string
  page?: number
  pageSize?: number
  status?: string
  date?: string
  teacher?: string
  student?: string
  statusTab?: string
}

export interface ScheduleSessionPayload {
  studentId: string
  studentName?: string
  teacherId: string
  teacherName?: string
  date: string
  startTime: string
  durationMinutes?: number
  sessionType?: string
  availableTimeSlot?: string
  timeSlot?: string
  subjectId?: string
  subjectName?: string
  courseId?: string
  courseName?: string
  educationStage?: string
  academicStage?: string
  notes?: string
}

export interface UpdateSessionPayload {
  teacherId?: string
  teacherName?: string
  date?: string
  startTime?: string
  durationMinutes?: number
  sessionType?: string
  subjectId?: string
  subjectName?: string
  courseId?: string
  courseName?: string
  educationStage?: string
  academicStage?: string
  notes?: string
  status?: string
  sessionStatus?: string
}

export interface RescheduleRequestItem {
  id: string
  sessionId: string
  sessionTitle?: string | null
  teacherId: string
  teacherName?: string | null
  studentId?: string | null
  studentName?: string | null
  requestedBy?: string | null
  requestedById: string
  requestedByName?: string | null
  requestNote?: string | null
  originalStart: string
  originalEnd: string
  newStart: string
  newEnd: string
  originalDurationMinutes: number
  newDurationMinutes: number
  status?: string | null
  respondedBy?: string | null
  respondedById?: string | null
  responseNote?: string | null
  respondedAt?: string | null
  createdAt: string
  updatedAt?: string | null
  originalDate?: string | null
  originalTimeSlot?: string | null
  newDate?: string | null
  newTimeSlot?: string | null
}

export interface CreateReschedulePayload {
  requestedBy?: string
  requestedById: string
  newStart: string
  requestedByName?: string
  durationMinutes?: number
  note?: string
}

export interface RespondReschedulePayload {
  respondedBy?: string
  respondedById: string
  decision: "Approved" | "Rejected" | string
  note?: string
}

export interface RescheduleQueryParams {
  sessionId?: string
  studentId?: string
  teacherId?: string
  status?: string
  page?: number
  pageSize?: number
}

