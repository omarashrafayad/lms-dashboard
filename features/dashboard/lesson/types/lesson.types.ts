export type LessonStatus = "Published" | "Draft" | "Archived"

export interface LessonListItem {
  id: string
  title: string
  thumbnailUrl?: string
  subject: string
  chapter: string
  unit: string
  stage: string
  year: string
  system: string
  term: string
  videosCount: number
  hasPdf: boolean
  hasQuiz: boolean
  access: "Free + Premium" | "Free" | "Premium"
  offlineAvailable: boolean
  status: LessonStatus
}

export interface LessonFilterState {
  search: string
  stage: string
  year: string
  system: string
  term: string
  subject: string
  chapter: string
  unit: string
  status: string
  access: string
  offline: string
}

export interface ActivityHistoryItem {
  id: string
  action: string
  date: string
  author: string
}

export interface LessonDetailFull {
  id: string
  title: string
  order: number
  status: LessonStatus
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
  videos: {
    id: string
    order: number
    title: string
    duration: string
    access: "Free" | "Premium"
    offlineAvailable: boolean
  }[]
  pdf: {
    title: string
    size: string
    offlineAvailable: boolean
  } | null
  pdfOfflineAvailability: boolean
  quiz: {
    title: string
    status: LessonStatus
    questionsCount: number
    passingScore: string
    timeLimit: string
  }
  settings: {
    freePlanFirstVideoOnly: boolean
    premiumContent: boolean
    videoOfflineDownload: boolean
    pdfOfflineDownload: boolean
  }
  history: ActivityHistoryItem[]
}

export interface VideoContentItem {
  id: string
  order: number
  title: string
  duration: string
  access: "Free" | "Premium"
  offlineAvailable: boolean
  file?: File | null
  fileName?: string
}

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  text: string
  type: "Multiple Choice" | "True / False" | "Short Answer"
  points: number
  options: QuizOption[]
  required: boolean
}

export interface LessonQuizData {
  title: string
  description?: string
  timeLimit: number
  passingScore: number
  courseLevel?: string
  questions: QuizQuestion[]
  isPublished?: boolean
}

export interface CreateLessonPayload {
  stage: string
  year: string
  system: string
  term: string
  subject: string
  chapter: string
  unit: string
  title: string
  description: string
  order: number
  duration: string
  thumbnailUrl?: string
  videos: VideoContentItem[]
  pdf?: {
    title: string
    size: string
    offlineAvailable: boolean
    file?: File | null
  } | null
  quiz?: {
    enabled: boolean
    title: string
    questionsCount: number
    passingScore: string
    timeLimit: string
    data?: LessonQuizData
  } | null
  settings: {
    freePlanFirstVideoOnly: boolean
    premiumContent: boolean
    videoOfflineDownload: boolean
    pdfOfflineDownload: boolean
  }
  status?: LessonStatus
}

export interface UpdateLessonPayload {
  title: string
  description: string
  order: number
  duration: string
}

export interface LessonFormValues {
  // Step 1
  stage: string
  year: string
  system: string
  term: string
  subject: string
  chapter: string
  unit: string

  // Step 2
  title: string
  description: string
  order: string
  duration: string
  thumbnailFile: File | null
  thumbnailPreview: string | null

  // Step 3
  videos: VideoContentItem[]

  // Step 4
  hasPdf: boolean
  pdfTitle: string
  pdfOffline: boolean
  pdfFile: File | null

  // Step 5
  quiz: LessonQuizData

  // Step 6
  allowVideoDownload: boolean
  allowPdfDownload: boolean

  // Status
  status: LessonStatus
}

