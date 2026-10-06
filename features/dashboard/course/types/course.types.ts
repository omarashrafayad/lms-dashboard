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

export interface CourseListItem {
  id: string
  title: string
  category: string
  instructor: string
  level: CourseLevel
  duration?: string
  rating?: number
  lessonsCount: number
  studentsCount: number
  status: CourseStatus
  lastUpdated: string
}

import { QuizQuestion } from "@/features/dashboard/lesson/types/lesson.types"

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

export interface CourseDetail {
  id: string
  title: string
  category: string
  instructor: string
  level: CourseLevel
  duration?: string
  status: CourseStatus
  language?: string
  description: string
  prerequisites?: string | string[]
  targetAudience?: string
  allowVideoDownload?: boolean
  allowPdfDownload?: boolean
  certificateAvailable?: boolean
  stats: {
    totalLessons: number
    totalVideos: number
    estimatedDuration: string
    totalStudents: number
    completionRate: string
  }
  lessons: CourseLessonItem[]
  exam: CourseExamData | null
  students?: StudentProgressItem[]
  analytics?: CourseAnalyticsData
  activityHistory?: CourseActivityItem[]
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
