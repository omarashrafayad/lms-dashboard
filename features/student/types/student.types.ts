export type EducationStage = "Primary" | "Preparatory" | "Secondary"
export type StudentStatus = "Active" | "Inactive"

export interface Student {
  id: string
  name: string
  code: string
  email: string
  phone: string
  stage: EducationStage
  grade: string
  system: string
  progress: number
  averageScore: number
  status: StudentStatus
  lastActivity: string
  avatarInitials: string
  avatarColorClass: string
}
