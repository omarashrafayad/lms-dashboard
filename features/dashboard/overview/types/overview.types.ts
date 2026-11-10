export interface DashboardStudentResponse {
  id: string
  fullName?: string | null
  email?: string | null
  academicStage?: string | null
  grade?: string | null
  educationSystem?: string | null
  isActive: boolean
  createdAt: string
}

export interface DashboardTeacherResponse {
  id: string
  fullName?: string | null
  email?: string | null
  isActive: boolean
  isAvailable: boolean
  profilePhotoUrl?: string | null
  createdAt: string
}

export interface EducationSystemDistributionResponse {
  educationSystemId?: string | null
  educationSystem?: string | null
  studentCount: number
  percentage: number
}

export interface DashboardOverviewResponse {
  totalStudents: number
  activeStudents: number
  newStudentsThisMonth: number
  studentsGrowthPercent: number
  totalTeachers: number
  activeTeachers: number
  availableTeachers: number
  teachersGrowthPercent: number
  recentStudents?: DashboardStudentResponse[] | null
  activeTeacherList?: DashboardTeacherResponse[] | null
  educationSystems?: EducationSystemDistributionResponse[] | null
}

export interface DashboardOverviewParams {
  recentStudentsLimit?: number
  recentTeachersLimit?: number
}

