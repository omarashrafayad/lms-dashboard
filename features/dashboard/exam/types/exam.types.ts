export type ExamType = "Monthly" | "Subject" | "Course"
export type ExamLevel = "Beginner" | "Intermediate" | "Advanced"
export type ExamStatus = "Published" | "Draft" | "Archived"

export interface StudentExamRecord {
  id: string
  studentName: string
  level: ExamLevel
  score: string // e.g. "75%" or "—"
  correctAnswers: string // e.g. "15" or "—"
  wrongAnswers: string // e.g. "5" or "—"
  result: "Passed" | "Failed" | "Not Attempted"
  attempts: string // e.g. "1" or "—"
  completionTime: string // e.g. "24 min" or "—"
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

export interface ExamItem {
  id: string
  slug: string
  title: string
  type: ExamType
  level: ExamLevel
  subject: string
  educationStage: string
  academicYear: string
  term: string
  month?: string
  questionsCount: number
  totalPoints: number
  duration: string
  durationMinutes: number
  attemptsAllowed: number
  passingScore: string
  passingScorePercent: number
  status: ExamStatus
  studentsCount: number
  passRate: string
  passRatePercent: number
  failRatePercent: number
  averageScore: string
  avgCompletionTime: string
  lastUpdated: string
  linkedTo: {
    type: string
    subject: string
    stage: string
    term: string
  }
  students: StudentExamRecord[]
  activityHistory: ExamActivityItem[]
  questions: ExamQuestionItem[]
}

export interface ExamFilterState {
  tab: "all" | "monthly" | "subject" | "course"
  search: string
  type: string
  level: string
  questions: string
  duration: string
}
