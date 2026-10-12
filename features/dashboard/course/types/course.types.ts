export type CourseLevel = "Beginner" | "Intermediate" | "Advanced"
export type CourseStatus = "Published" | "Draft" | "Archived"
export type CourseLessonType = "Video" | "Reading" | "Quiz"

export type CourseCategory =
  | "Computer Science"
  | "Mathematics"
  | "Sciences"
  | "Languages"
  | "Business & Management"
  | "Design & Arts"
  | "Other"

import { QuizQuestion } from "@/features/dashboard/lesson/types/lesson.types"

export interface CourseLessonItem {
  id: string
  order: number
  title: string
  type: CourseLessonType
  duration: string
  offlineAvailable: boolean
  description?: string
  videoUrl?: string
}

export interface CourseExamData {
  title: string
  description?: string
  timeLimit: number
  attemptsAllowed: number
  passingScore: number
  courseLevel?: string
  isPublished: boolean
  questions: QuizQuestion[]
}

export interface StudentProgressItem {
  id: string
  name: string
  progress: number
  score: number
  correctAnswers: string
  wrongAnswers: string
}

export interface CourseAnalyticsData {
  completionRate: string
  avgWatchTime: string
  activeLearners: number
  lessonEngagement: { lesson: string; value: number }[]
}

export interface CourseActivityItem {
  id: string
  action: string
  date: string
}

export interface ApiCourse {
  id: string
  name: string
  description: string
  category: string
  difficultyLevel: string
  leadInstructor: string
  instructionLanguage: string
  targetAudience: string
  prerequisites: string
  estimatedDurationHours: number
  status: string
  coverImageUrl?: string
  order?: number
  settings?: any
  createdAt?: string
  updatedAt?: string

  // Compatibility helpers
  title?: string
  instructor?: string
  level?: CourseLevel
  duration?: string
  rating?: number
  lessonsCount?: number
  studentsCount?: number
  lastUpdated?: string
  lessons?: CourseLessonItem[]
  stats?: {
    totalLessons: number
    totalVideos: number
    estimatedDuration: string
    totalStudents: number
    completionRate: string
  }
  exam?: CourseExamData | null
  students?: StudentProgressItem[]
  analytics?: CourseAnalyticsData
  activityHistory?: CourseActivityItem[]
}

export type Course = ApiCourse
export type CourseListItem = ApiCourse

export interface CreateCoursePayload {
  name: string
  description: string
  category: string
  difficultyLevel: string
  leadInstructor: string
  instructionLanguage: string
  targetAudience: string
  prerequisites: string
  estimatedDurationHours: number
  coverImageUrl?: string
  order?: number
}

export interface UpdateCoursePayload {
  name?: string
  description?: string
  category?: string
  difficultyLevel?: string
  leadInstructor?: string
  instructionLanguage?: string
  targetAudience?: string
  prerequisites?: string
  estimatedDurationHours?: number
  coverImageUrl?: string
  order?: number
  status?: string
}

export interface CourseDetail extends ApiCourse {
  language?: string
  allowVideoDownload?: boolean
  allowPdfDownload?: boolean
  certificateAvailable?: boolean
}

export interface CourseFilterState {
  search: string
  category: string
  level: string
  duration: string
  status: string
}

export interface CreateCourseLessonPayload {
  title: string
  type: CourseLessonType
  duration: string
  offlineAvailable: boolean
  description?: string
}
