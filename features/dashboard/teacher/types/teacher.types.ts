export type TeacherAvailabilityStatus = "Available" | "Busy" | "Offline" | "Unavailable"
export type TeacherStatus = "Active" | "Inactive"

export interface Teacher {
  id: string
  name: string
  code: string
  avatarInitials: string
  avatarColorClass: string
  email: string
  phone: string
  subjects: string[]
  availability: TeacherAvailabilityStatus
  upcomingSessions: number
  status: TeacherStatus
  lastActive: string
}

export interface TeacherFilterState {
  search: string
  subject: string
  status: string
  availability: string
  time: string
}
