export type EducationStage = "Primary" | "Preparatory" | "Secondary"
export type EducationSystem = "National" | "IGCSE" | "American"
export type SubjectStatus = "Active" | "Inactive"
export type ContentStatus = "Published" | "Draft" | "Archived"

export interface CurriculumSubject {
  id: string
  name: string
  code?: string
  avatarLetter?: string
  avatarColorClass?: string
  educationStageId?: string
  educationStageName?: EducationStage | string
  gradeId?: string
  gradeName?: string
  educationSystemId?: string
  educationSystemName?: EducationSystem | string
  term: string
  chaptersCount?: number
  unitsCount?: number
  lessonsCount?: number
  status?: SubjectStatus | string
  chapters?: Chapter[]
  createdAt?: string
  // Backward compatibility aliases
  stage?: string
  year?: string
  system?: string
}

export interface CreateChapterPayload {
  subjectId: string
  name: string
  description?: string
  order: number
}

export interface Chapter {
  id: string
  subjectId: string
  name?: string
  title?: string
  description?: string
  order: number
  unitsCount?: number
  lessonsCount?: number
  units?: Unit[]
}

export interface CreateUnitPayload {
  chapterId: string
  name: string
  description?: string
  order: number
}

export interface Unit {
  id: string
  chapterId: string
  name?: string
  title?: string
  description?: string
  order: number
  lessonsCount?: number
  lessons?: LessonSummary[]
}

export interface CreateLessonPayload {
  unitId: string
  name: string
  description?: string
  lessonOrder: number
  duration: number
  accessType: "Premium" | "Free" | string
  status: "true" | "false" | string
}

export interface LessonSummary {
  id: string
  unitId: string
  chapterId?: string
  subjectId?: string
  name?: string
  title?: string
  description?: string
  lessonOrder?: number
  order?: number
  duration?: number | string
  accessType?: "Premium" | "Free" | string
  status?: ContentStatus | string
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
  id?: string
  title: string
  size: string
  offlineAvailable: boolean
  pdfUrl?: string
}

export interface LessonQuiz {
  id?: string
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
  subjectId?: string
  chapterId?: string
  unitId?: string
  name?: string
  title?: string
  description?: string
  order?: number
  lessonOrder?: number
  duration?: number | string
  access?: string
  accessType?: string
  status?: ContentStatus | string
  stage?: string
  year?: string
  system?: string
  term?: string
  subjectName?: string
  chapterTitle?: string
  unitTitle?: string
  overview?: {
    description?: string
    order?: number
    duration?: string
    access?: string
  }
  videos?: LessonVideo[]
  pdf?: LessonPdf | null
  pdfOfflineAvailability?: boolean
  quiz?: LessonQuiz | null
  settings?: LessonAccessSettings
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
  educationStageId: string
  gradeId: string
  educationSystemId: string
  term: string
  status?: SubjectStatus | string
  // Optional / backward compatibility
  stage?: string
  year?: string
  system?: string
}

// ======================== Content: PDF ========================
export interface CreatePdfPayload {
  lessonId: string
  title: string
  fileSize: number
  isOfflineAvailable: boolean
  file: File
}

export interface ContentPdfResponse {
  id: string
  lessonId: string
  title: string
  filePath?: string
  fileSize: number
  isOfflineAvailable: boolean
  status?: string
  createdAt: string
}

// ======================== Content: Video ========================
export interface CreateVideoPayload {
  lessonId: string
  title: string
  fileSize: number
  duration: number
  order: number
  isFree: boolean
  isPremium: boolean
  isOfflineAvailable: boolean
  file: File
}

export interface ContentVideoResponse {
  id: string
  lessonId: string
  title: string
  filePath?: string
  fileSize: number
  duration: number
  order: number
  isFree: boolean
  isPremium: boolean
  isOfflineAvailable: boolean
  status?: string
  createdAt: string
}

// ======================== Content: Quiz ========================
export interface CreateQuizQuestionPayload {
  questionText: string
  options: string
  correctAnswer: string
  order: number
}

export interface CreateQuizPayload {
  request: {
    lessonId: string
    title: string
    passingScore: number
    timeLimit: number
    isPublished: boolean
  }
  questions: CreateQuizQuestionPayload[]
}

export interface ContentQuizResponse {
  id: string
  lessonId: string
  title: string
  questionsCount?: number
  passingScore: number
  timeLimit: number
  isPublished: boolean
  createdAt: string
}
