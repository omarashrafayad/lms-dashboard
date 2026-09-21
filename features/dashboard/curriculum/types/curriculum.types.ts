export type EducationStage = "Primary" | "Preparatory" | "Secondary"
export type EducationSystem = "National" | "IGCSE" | "American"
export type SubjectStatus = "Active" | "Inactive"
export type ContentStatus = "Published" | "Draft" | "Archived"

export interface CurriculumSubject {
  id: string
  name: string
  code: string
  avatarLetter: string
  avatarColorClass: string
  stage: EducationStage | string
  year: string
  system: EducationSystem | string
  term: string
  chaptersCount: number
  unitsCount: number
  lessonsCount: number
  status: SubjectStatus
  chapters?: Chapter[]
}

export interface Chapter {
  id: string
  subjectId: string
  title: string
  order: number
  unitsCount: number
  lessonsCount: number
  units: Unit[]
}

export interface Unit {
  id: string
  chapterId: string
  title: string
  order: number
  lessonsCount: number
  lessons: LessonSummary[]
}

export interface LessonSummary {
  id: string
  unitId: string
  chapterId: string
  subjectId: string
  title: string
  order: number
  status?: ContentStatus
}

export interface LessonVideo {
  id: string
  order: number
  title: string
  duration: string
  access: "Free" | "Premium"
  offlineAvailable: boolean
  thumbnailUrl?: string
}

export interface LessonPdf {
  title: string
  size: string
  offlineAvailable: boolean
  pdfUrl?: string
}

export interface LessonQuiz {
  title: string
  status: ContentStatus
  questionsCount: number
  passingScore: string
  timeLimit: string
}

export interface LessonAccessSettings {
  freePlanFirstVideoOnly: boolean
  premiumContent: boolean
  videoOfflineDownload: boolean
  pdfOfflineDownload: boolean
}

export interface LessonDetail {
  id: string
  subjectId: string
  chapterId: string
  unitId: string
  title: string
  order: number
  status: ContentStatus
  stage: string
  year: string
  system: string
  term: string
  subjectName: string
  chapterTitle: string
  unitTitle: string
  overview: {
    description: string
    order: number
    duration: string
    access: string
  }
  videos: LessonVideo[]
  pdf: LessonPdf
  pdfOfflineAvailability: boolean
  quiz: LessonQuiz
  settings: LessonAccessSettings
}

export interface SubjectFilterState {
  search: string
  stage: string
  year: string
  system: string
  term: string
  subject: string
}

export interface CreateSubjectPayload {
  name: string
  stage: string
  year: string
  system: string
  term: string
  status: SubjectStatus
}
