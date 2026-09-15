import { TeacherAvailabilityStatus, TeacherStatus } from "./teacher.types"

export interface TimeSlot {
  id: string
  start: string
  end: string
  status?: "Available" | "Booked" | "Busy" | "Unavailable"
}

export interface DaySchedule {
  day: string
  slots: TimeSlot[]
  isUnavailable?: boolean
}

export interface TeacherSession {
  id: string
  studentId?: string
  studentName: string
  subject: string
  date: string
  time: string
  sessionType: "Private" | "Group"
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled"
}

export interface TeacherProfile {
  id: string
  name: string
  code: string
  avatarInitials: string
  avatarColorClass: string
  status: TeacherStatus
  availabilityStatus: TeacherAvailabilityStatus
  kpis: {
    totalStudents: number
    upcomingSessions: number
    completedSessions: number
    averageRating: number
    teachingHours: number
  }
  personalInfo: {
    fullName: string
    nationalId: string
    dateOfBirth: string
    gender: "Male" | "Female"
    email: string
    phone: string
  }
  professionalInfo: {
    subjects: string[]
    qualifications: string
    yearsOfExperience: string
    teachingLevels: string[]
    bio: string
  }
  teachingSetup: {
    subjects: string[]
    educationStages: string[]
    teachingLevels: string[]
  }
  accountInfo: {
    loginMethod: "Email" | "Phone Number"
    email: string
    phone?: string
    accountStatus: TeacherStatus
  }
  verificationDocuments: {
    degreeCertificate: {
      fileName: string
      fileSize: string
      status: "Pending Review" | "Approved" | "Rejected"
    }
    nationalIdImage?: {
      fileName?: string
      fileSize?: string
      uploaded: boolean
    }
  }
  weeklyAvailability: DaySchedule[]
  upcomingSessions: TeacherSession[]
  previousSessions: TeacherSession[]
}
