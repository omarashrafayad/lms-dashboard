export type EducationStage = "Primary" | "Preparatory" | "Secondary"
export type StudentStatus = "Active" | "Inactive"

export interface StudentQueryParams {
  search?: string
  page?: number
  pageSize?: number
  stage?: string
  grade?: string
  system?: string
  status?: string
}

export interface ApiStudent {
  id: string
  email: string
  fullName: string
  phoneNumber: string
  educationStage: string
  grade: string
  role?: string
  createdAt: string
  isActive: boolean
  dateOfBirth: string
  educationSystem: string
  gender: string
  averageScore?: number
  progress?: number
  level?: string
}

export type Student = ApiStudent

export interface StudentProfileData {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  isActive: boolean
  status: string
  dateOfBirth: string
  gender: string
  level: string
  educationStage: string
  grade: string
  educationSystem: string
  profilePhotoUrl?: string
  createdAt: string
}

export interface StudentStatsData {
  overallProgress: number
  averageScore: number
  completedCourses: number
  totalCourses: number
  completedLessons: number
  totalLessons: number
  upcomingSessions: number
}

export interface StudentCourseItem {
  courseId: string
  courseName: string
  progressPercentage: number
  completedLessons: number
  totalLessons: number
  averageScore: number
  status: string
}

export interface StudentLessonProgressItem {
  lessonId: string
  lessonName: string
  courseId: string
  courseName: string
  completedAt: string
  status: string
}

export interface StudentExamProgressItem {
  id: string
  examId: string
  examTitle: string
  courseId: string
  courseName: string
  score: number
  status: string
  completedAt: string
}

export interface StudentSessionProgressItem {
  id: string
  title: string
  courseOrSubject: string
  teacherName: string
  scheduledStart: string
  scheduledEnd: string
  status: string
  displayStatus: string
}

export interface StudentGuardianItem {
  id: string
  fullName: string
  email: string
  phoneNumber: string
}

export interface StudentSubscriptionItem {
  id: string
  planId: string
  planName: string
  tier: string
  billingCycle: string
  status: string
  startsAt: string
  expiresAt: string
  daysRemaining: number
  amountCharged: number
  autoRenew: boolean
}

export interface StudentProfileApiResponse {
  profile: StudentProfileData
  stats: StudentStatsData
  courses: StudentCourseItem[]
  lessons: StudentLessonProgressItem[]
  exams: StudentExamProgressItem[]
  sessions: {
    upcomingCount: number
    previousCount: number
    upcoming: StudentSessionProgressItem[]
    previous: StudentSessionProgressItem[]
  }
  guardians: StudentGuardianItem[]
  subscriptions: StudentSubscriptionItem[]
}

export type ApiStudentWithProfile = ApiStudent & Partial<StudentProfileApiResponse>

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
