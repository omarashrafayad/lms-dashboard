export interface PagedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ContentCurriculumQueryParams {
  page?: number
  pageSize?: number
  search?: string
}

// 1. Content PDF
export interface ContentPdfItem {
  id: string
  lessonId: string
  title?: string | null
  filePath?: string | null
  fileUrl?: string | null
  bookImagePath?: string | null
  bookImageUrl?: string | null
  fileSize: number
  isOfflineAvailable: boolean
  status?: string | null
  createdAt: string
  lessonName?: string | null
}

// 2. Content Quiz
export interface ContentQuizItem {
  id: string
  lessonId: string
  title?: string | null
  questionsCount: number
  passingScore: number
  timeLimit: number
  isPublished: boolean
  createdAt: string
  groups?: any[] | null
  lessonName?: string | null
}

// 3. Content Video
export interface ContentVideoItem {
  id: string
  lessonId: string
  title?: string | null
  filePath?: string | null
  fileUrl?: string | null
  fileSize: number
  duration: number
  order: number
  isFree: boolean
  isPremium: boolean
  isOfflineAvailable: boolean
  status?: string | null
  createdAt: string
  lessonName?: string | null
}

// 4. Curriculum Chapter
export interface CurriculumChapterItem {
  id: string
  subjectId: string
  subjectName?: string | null
  name?: string | null
  description?: string | null
  order: number
  createdAt: string
}

// 5. Curriculum Unit
export interface CurriculumUnitItem {
  id: string
  chapterId: string
  chapterName?: string | null
  name?: string | null
  description?: string | null
  order: number
  createdAt: string
}

// 6. Curriculum Lesson
export interface CurriculumLessonItem {
  id: string
  courseId?: string | null
  unitId?: string | null
  name?: string | null
  description?: string | null
  lessonOrder: number
  duration?: number | null
  accessType?: string | null
  status?: string | null
  videoUrl?: string | null
  videoFileName?: string | null
  videoFileSize?: number | null
  videoFormat?: string | null
  isOfflineAvailable: boolean
  createdAt: string
  unitName?: string | null
}

