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

export interface ApiTeacherSpecialization {
  subjectId: string
  subjectName?: string | null
  teachingLevelId: string
  teachingLevelName?: string | null
  academicStageId: string
  academicStageName?: string | null
}

export interface ApiTeacherAvailabilitySlot {
  id?: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface ApiTeacher {
  id: string
  email: string
  fullName: string
  phoneNumber?: string | null
  nationalId?: string | null
  gender?: string | null
  dateOfBirth?: string | null
  educationStage?: string | null
  educationSystem?: string | null
  qualifications?: string | null
  yearsOfExperience?: number | null
  bio?: string | null
  history?: string | null
  isActive: boolean
  isAvailable?: boolean | null
  profilePhotoUrl?: string | null
  universityDegreeCertificateUrl?: string | null
  nationalIdDocumentUrl?: string | null
  createdAt: string
  role?: string | null
  specializations?: ApiTeacherSpecialization[] | null
  availabilitySlots?: ApiTeacherAvailabilitySlot[] | null
}

export interface ApiSubject {
  id: string
  name: string
  isActive: boolean
  createdAt?: string
}

export interface ApiTeachingLevel {
  id: string
  name: string
  isActive: boolean
  createdAt?: string
}

export interface TeacherAvailabilitySlotPayload {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface CreateTeacherPayload {
  email: string
  password: string
  fullName: string
  phoneNumber: string
  nationalId: string
  dateOfBirth: string
  genderId: string
  academicStageId?: string | null
  educationSystemId?: string | null
  qualifications?: string
  yearsOfExperience?: number
  bio?: string
  history?: string
  isActive?: boolean
  isAvailable?: boolean
  subjectIds?: string[]
  teachingLevelIds?: string[]
  educationStageIds?: string[]
  nationalIdDocument?: File | null
  universityDegreeCertificate?: File | null
  availabilitySlotsJson?: string
}

export interface UpdateTeacherPayload {
  fullName: string
  phoneNumber: string
  nationalId: string
  dateOfBirth: string
  genderId: string
  academicStageId?: string | null
  educationSystemId?: string | null
  qualifications?: string
  yearsOfExperience?: number
  bio?: string
  history?: string
  isActive?: boolean
  isAvailable?: boolean
  subjectIds?: string[]
  teachingLevelIds?: string[]
  educationStageIds?: string[]
  nationalIdDocument?: File | null
  universityDegreeCertificate?: File | null
  availabilitySlotsJson?: string
}
