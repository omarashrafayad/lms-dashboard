export interface StudentProfile {
  id: string
  fullName: string
  email: string
  phone: string
  avatar: string
  grade: string
  track: string
  academicYear: string
  semester: string
  studentId: string
  school: string
  enrollmentDate: string
  subscriptionPlan: string
  dateOfBirth: string
  gender: string
  address: string
}

export interface StudentStats {
  totalCourses: number
  activeCourses: number
  completedCourses: number
  courseCompletionRate: number
  totalLearningHours: number
  weeklyLearningHours: number
  averageScore: number
  scoreChangePercent: number
  upcomingExams: number
  availableExamsNow: number
  earnedCertificates: number
  pendingCertificates: number
}

export interface Lesson {
  id: string
  title: string
  type: "video" | "pdf" | "text" | "quiz"
  duration: string
  status: "not_started" | "in_progress" | "completed" | "locked"
  description: string
  videoUrl?: string
  pdfUrl?: string
  textContent?: string
  quizQuestionsCount?: number
  quizDuration?: string
  quizTotalMarks?: number
  attachments?: { name: string; size: string; url: string }[]
  notes?: string
}

export interface Chapter {
  id: string
  title: string
  order: number
  lessonsCount: number
  completedLessonsCount: number
  lessons: Lesson[]
}

export interface Unit {
  id: string
  title: string
  order: number
  chaptersCount: number
  chapters: Chapter[]
}

export interface Course {
  id: string
  title: string
  subject: string
  teacherName: string
  teacherTitle: string
  teacherAvatar: string
  thumbnail: string
  description: string
  grade: string
  unitsCount: number
  chaptersCount: number
  lessonsCount: number
  completedLessonsCount: number
  completedChaptersCount: number
  progressPercentage: number
  totalDuration: string
  remainingHours: string
  lastAccessedLesson: string
  lastAccessedDate: string
  enrollmentDate: string
  status: "in_progress" | "not_started" | "completed"
  units: Unit[]
}

export interface LiveSession {
  id: string
  title: string
  subject: string
  courseName: string
  teacherName: string
  teacherAvatar: string
  description: string
  date: string
  startTime: string
  endTime: string
  duration: string
  type: "live" | "recorded"
  status: "upcoming" | "live_now" | "completed" | "cancelled"
  meetingLink?: string
  recordingUrl?: string
  agenda?: string[]
  materials?: { title: string; size: string; type: string }[]
  attendanceStatus?: "present" | "absent" | "scheduled"
}

export interface ExamQuestion {
  id: string
  questionNumber: number
  type: "mcq" | "multiple_select" | "true_false" | "short_answer" | "essay" | "fill_blank"
  text: string
  marks: number
  image?: string
  options?: string[]
  correctAnswer: string | string[]
  studentAnswer?: string | string[]
  explanation: string
}

export interface Exam {
  id: string
  title: string
  subject: string
  relatedCourse: string
  teacherName: string
  totalQuestions: number
  totalMarks: number
  passingScore: number
  durationMinutes: number
  startDate: string
  startTime: string
  submissionDeadline: string
  attemptsAllowed: number
  attemptsUsed: number
  status: "upcoming" | "available_now" | "in_progress" | "submitted" | "expired"
  scoreObtained?: number
  percentage?: number
  passed?: boolean
  timeTakenMinutes?: number
  submittedDate?: string
  teacherFeedback?: string
  questions: ExamQuestion[]
}

export interface Assignment {
  id: string
  title: string
  subject: string
  course: string
  teacherName: string
  description: string
  instructions: string
  totalMarks: number
  dueDate: string
  status: "new" | "in_progress" | "submitted" | "graded" | "overdue"
  attachmentCount: number
  referenceFiles?: { name: string; size: string }[]
  submittedAt?: string
  submittedText?: string
  submittedFiles?: { name: string; size: string }[]
  gradeObtained?: number
  teacherFeedback?: string
  correctionNotes?: string
}

export interface ExamResultRecord {
  id: string
  examName: string
  subject: string
  course: string
  examDate: string
  obtainedMarks: number
  totalMarks: number
  percentage: number
  status: "passed" | "failed"
  teacherFeedback: string
}

export interface SubjectPerformance {
  subject: string
  averageScore: number
  highestScore: number
  lowestScore: number
  completedExams: number
  completedLessons: number
  progress: number
  status: "excellent" | "good" | "needs_attention"
}

export interface SubscriptionPlan {
  id: string
  name: string
  tagline: string
  price: number
  billingCycle: "monthly" | "semester" | "annual"
  isCurrent?: boolean
  features: string[]
  restrictedFeatures: string[]
  courseAccessLimit: string
  subjectsAvailable: string
  liveSessionsIncluded: boolean
}

export interface PaymentTransaction {
  id: string
  transactionId: string
  planName: string
  amount: number
  discount: number
  paymentMethod: string
  date: string
  status: "paid" | "pending" | "failed" | "refunded"
}

export interface Certificate {
  id: string
  title: string
  courseName: string
  studentName: string
  issueDate: string
  credentialId: string
  completionPercentage: number
  issuer: string
  thumbnail: string
}

export interface StudentNotification {
  id: string
  category: "all" | "courses" | "lessons" | "exams" | "sessions" | "assignments" | "results" | "subscriptions" | "announcements"
  title: string
  description: string
  timestamp: string
  isRead: boolean
  link: string
}

export interface Announcement {
  id: string
  title: string
  description: string
  publisher: string
  publisherRole: string
  date: string
  courseOrSubject: string
  attachmentName?: string
  isPinned?: boolean
}

export interface StudentRecentActivity {
  id: string
  title: string
  subjectOrCourse: string
  date: string
  type: "lesson" | "video" | "exam" | "download" | "session" | "grade" | "unit"
  statusBadge: string
}
