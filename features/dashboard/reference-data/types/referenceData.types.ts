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
  academicStage?: AcademicStage | { id: string; name: string } | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string | null
}

export interface CreateReferenceDataPayload {
  name: string
  isActive: boolean
}

export interface UpdateReferenceDataPayload {
  name: string
  isActive: boolean
}

export interface CreateGradePayload {
  name: string
  academicStageId: string
  isActive: boolean
}

export interface UpdateGradePayload {
  name: string
  academicStageId: string
  isActive: boolean
}

export type ReferenceDataTab =
  | "academic-stages"
  | "education-systems"
  | "grades"
  | "genders"
