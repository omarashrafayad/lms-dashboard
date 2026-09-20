export interface Gender {
  id: string
  name: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string | null
}

export interface EducationSystem {
  id: string
  name: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string | null
}

export interface AcademicStage {
  id: string
  name: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string | null
}

export interface Grade {
  id: string
  name: string
  academicStageId: string
  academicStage?: any
  isActive?: boolean
  createdAt?: string
  updatedAt?: string | null
}
