export type EducationStage = "Primary" | "Preparatory" | "Secondary"
export type StudentStatus = "Active" | "Inactive"

export interface Student {
  id: string
  name: string
  code: string
  email: string
  phone: string
  stage: EducationStage | string
  grade: string
  system: string
  progress: number
  averageScore: number
  status: StudentStatus
  lastActivity: string
  avatarInitials: string
  avatarColorClass: string
}

export interface ApiStudent {
  id: string
  email: string
  fullName: string
  phoneNumber: string
  educationStage: string
  grade: string
  role: string
  createdAt: string
  isActive: boolean
  dateOfBirth: string
  educationSystem: string
  gender: string
}

export interface CreateStudentPayload {
  email: string
  password: string
  fullName: string
  phoneNumber: string
  academicStageId: string
  gradeId: string
  dateOfBirth: string
  educationSystemId: string
  genderId: string
}
