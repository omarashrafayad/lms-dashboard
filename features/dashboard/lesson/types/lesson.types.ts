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

