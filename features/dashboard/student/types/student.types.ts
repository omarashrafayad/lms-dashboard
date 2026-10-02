export type EducationStage = "Primary" | "Preparatory" | "Secondary"
export type StudentStatus = "Active" | "Inactive"

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
  averageScore?: number
  progress?: number
}

export type Student = ApiStudent

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

export interface UpdateStudentPayload {
  email?: string
  password?: string
  fullName?: string
  phoneNumber?: string
  academicStageId?: string
  gradeId?: string
  dateOfBirth?: string
  educationSystemId?: string
  genderId?: string
  isActive?: boolean
}
