export type SessionStatus = "In Progress" | "Upcoming" | "Completed" | "Missed" | "Cancelled"
export type PaymentStatus = "Paid" | "Refunded"
export type SessionType = "Private 1:1" | "Group"

export interface TimelineItem {
  id: string
  title: string
  subtitle: string
  completed: boolean
}

export interface SessionItem {
  id: string
  sessionNumber: string
  sessionType: SessionType
  studentId: string
  studentName: string
  studentGrade: string
  teacherId: string
  teacherName: string
  teacherSubject: string
  teacherAvailability: "Available" | "Busy"
  subject: string
  date: string
  startTime: string
  endTime: string
  duration: string
  status: SessionStatus
  paymentStatus: PaymentStatus
  totalPayment: string
  amountPoints: string
  paymentDate: string
  bookingId: string
  bookingRequestedDate: string
  bookingRequestedTime: string
  bookingCreatedAt: string
  bookingStatus: string
  parentName: string
  notes?: string
  timeline: TimelineItem[]
}

export interface SessionFilterState {
  search: string
  statusTab: string
  date: string
  status: string
  teacher: string
  student: string
}

export interface StudentOptionItem {
  id: string
  name: string
  grade: string
  level: "Beginner" | "Intermediate" | "Advanced"
  avatar?: string
}

export interface TeacherOptionItem {
  id: string
  name: string
  subject: string
  availability: "Available" | "Busy"
  avatar?: string
}

export interface ScheduleSessionPayload {
  studentId: string
  teacherId: string
  date: string
  startTime: string
  duration: string
  subject: string
  sessionType: SessionType
  notes?: string
}
