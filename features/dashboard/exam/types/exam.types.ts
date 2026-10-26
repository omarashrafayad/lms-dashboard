export type ExamType = "Monthly" | "Subject" | "Course"
export type ExamLevel = "Beginner" | "Intermediate" | "Advanced"
export type ExamStatus = "Published" | "Draft" | "Archived"

export interface ApiExamQuestion {
  id?: string
  examId?: string
  questionText: string
  questionType: string
  points: number
  options: string
  correctAnswer: string
  isRequired: boolean
  order?: number
}

export interface StudentExamRecord {
  id: string
  studentName: string
  level: ExamLevel
  score: string
  correctAnswers: string
  wrongAnswers: string
  result: "Passed" | "Failed" | "Not Attempted"
  attempts: string
  completionTime: string
}

export interface ExamActivityItem {
  id: string
  action: string
  admin: string
  dateTime: string
  previousValue: string
  newValue: string
}

export interface ExamQuestionItem {
  id: string
  number: number
  question: string
  type: "Multiple Choice" | "True / False" | "Short Answer"
  options: { key: string; text: string }[]
  correctAnswer: string
  points: number
  difficulty: ExamLevel
}

export interface ApiExam {
  id: string
  title: string
  description?: string
  examType: ExamType
  level: ExamLevel
  educationStage?: string
  academicYear?: string
  term?: string
  month?: string
  subjects?: string[]
  courseId?: string | null
  courseName?: string | null
  durationMinutes: number
  attemptsAllowed: number
  passingScore: number
  availability: string
  availableFrom?: string | null
  availableTo?: string | null
  status: ExamStatus
  questionCount?: number
  totalPoints?: number
  studentCount?: number
  passedCount?: number
  passRate?: number | string
  createdAt?: string
  updatedAt?: string | null

  // Compatibility helpers for UI tabs
  slug?: string
  type?: ExamType
  subject?: string
  questionsCount?: number
  duration?: string
  passingScorePercent?: number
  studentsCount?: number
  passRatePercent?: number
  failRatePercent?: number
  averageScore?: string
  avgCompletionTime?: string
  lastUpdated?: string
  linkedTo?: {
    type: string
    subject: string
    stage: string
    term: string
  }
  students?: StudentExamRecord[]
  activityHistory?: ExamActivityItem[]
  questions?: any[]
}

export type Exam = ApiExam
export type ExamItem = ApiExam

export interface CreateExamPayload {
  title: string
  description?: string
  examType: string
  level: string
  educationStage?: string
  academicYear?: string
  term?: string
  month?: string
  subjects?: string[]
  courseId?: string | null
  courseName?: string | null
  durationMinutes: number
  attemptsAllowed: number
  passingScore: number
  availability: string
  availableFrom?: string | null
  availableTo?: string | null
  status: string
  questions?: {
    questionText: string
    questionType: string
    points: number
    options: string
    correctAnswer: string
    isRequired: boolean
  }[]
}

export interface UpdateExamPayload {
  title?: string
  description?: string
  examType?: string
  level?: string
  educationStage?: string
  academicYear?: string
  term?: string
  month?: string
  subjects?: string[]
  courseId?: string | null
  courseName?: string | null
  durationMinutes?: number
  attemptsAllowed?: number
  passingScore?: number
  availability?: string
  availableFrom?: string | null
  availableTo?: string | null
  status?: string
}

export interface ExamFilterState {
  tab: "all" | "monthly" | "subject" | "course"
  search: string
  type: string
  level: string
  questions: string
  duration: string
}

export interface ExamQueryParams {
  search?: string
  page?: number
  pageSize?: number
  examType?: string
  level?: string
  status?: string
  subject?: string
  month?: string
  academicYear?: string
}
