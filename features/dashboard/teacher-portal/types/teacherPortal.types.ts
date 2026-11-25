export interface TeacherProfile {
  id: string
  fullName: string
  title: string
  specialization: string
  email: string
  phone: string
  avatar: string
  assignedSubjects: string[]
  academicYear: string
  semester: string
  experienceYears: number
  education: string
  qualifications: string[]
  bio: string
  address: string
  dateOfBirth: string
}

export interface TeacherStats {
  totalStudents: number
  activeStudents: number
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalSessions: number
  completedSessions: number
  upcomingSessions: number
  sessionsToday: number
  pendingSubmissions: number
  examsRequiringGrading: number
  assignmentsWaiting: number
  averageStudentScore: number
  scoreChangePercent: number
}

export interface TeacherCourse {
  id: string
  title: string
  subject: string
  grade: string
  thumbnail: string
  description: string
  enrolledStudentsCount: number
  activeStudentsCount: number
  completedStudentsCount: number
  unitsCount: number
  chaptersCount: number
  lessonsCount: number
  courseProgressPercentage: number
  averageExamScore: number
  lastUpdated: string
  status: "published" | "draft" | "pending_approval" | "archived"
}

export interface TeacherStudent {
  id: string
  fullName: string
  studentId: string
  avatar: string
  grade: string
  enrolledCourse: string
  courseProgress: number
  averageScore: number
  attendanceRate: number
  lastActivity: string
  status: "active" | "inactive" | "at_risk"
  riskReasons?: string[]
  totalSessions: number
  attendedSessions: number
  missedSessions: number
  lateSessions: number
}

export interface TeacherSession {
  id: string
  title: string
  course: string
  subject: string
  date: string
  startTime: string
  endTime: string
  duration: string
  registeredStudents: number
  expectedAttendees: number
  attendanceCount?: number
  absentCount?: number
  type: "live" | "recorded"
  status: "upcoming" | "live_now" | "completed" | "cancelled"
  meetingLink?: string
  recordingUrl?: string
  agenda?: string[]
}

export interface TeacherPendingTask {
  id: string
  title: string
  course: string
  creationDate: string
  priority: "urgent" | "high" | "medium"
  status: "waiting_grading" | "waiting_reply" | "draft"
  type: "exam" | "assignment" | "question" | "lesson"
  count?: number
}

export interface TeacherContentItem {
  id: string
  title: string
  type: "unit" | "chapter" | "lesson" | "video" | "pdf" | "quiz"
  subject: string
  course: string
  unitName: string
  chapterName: string
  creationDate: string
  lastUpdated: string
  status: "draft" | "published" | "pending_approval" | "rejected" | "archived"
  fileSize?: string
  duration?: string
  rejectionReason?: string
}

export interface TeacherExam {
  id: string
  title: string
  subject: string
  course: string
  questionsCount: number
  totalMarks: number
  passingMarks: number
  duration: string
  startDate: string
  endDate: string
  participantsCount: number
  status: "published" | "draft" | "scheduled" | "in_progress" | "completed" | "archived"
  averageScore?: number
  passRate?: number
}

export interface TeacherAssignment {
  id: string
  title: string
  subject: string
  course: string
  dueDate: string
  totalMarks: number
  totalStudents: number
  submittedCount: number
  pendingGradingCount: number
  gradedCount: number
  status: "active" | "draft" | "completed" | "archived"
}

export interface TeacherSubmission {
  id: string
  studentName: string
  studentId: string
  studentAvatar: string
  assessmentTitle: string
  assessmentType: "exam" | "assignment"
  course: string
  submittedAt: string
  waitingTime: string
  status: "not_submitted" | "submitted" | "late" | "under_review" | "graded" | "revision_requested"
  grade?: number
  totalMarks: number
  answerText?: string
  attachedFiles?: { name: string; size: string }[]
  teacherFeedback?: string
}

export interface TeacherQuestionAnswer {
  id: string
  studentName: string
  studentAvatar: string
  course: string
  lesson: string
  questionText: string
  submittedDate: string
  status: "new" | "answered" | "closed"
  replyText?: string
  attachmentName?: string
}

export interface TeacherDiscussion {
  id: string
  title: string
  course: string
  authorName: string
  repliesCount: number
  lastActivity: string
  status: "open" | "pinned" | "closed"
}

export interface TeacherAnnouncement {
  id: string
  title: string
  description: string
  targetCourse: string
  publishedDate: string
  recipientsCount: number
  readCount: number
  status: "published" | "draft"
}

export interface TeacherEarningsRecord {
  id: string
  transactionId: string
  course: string
  studentOrRef: string
  grossAmount: number
  commissionPct: number
  netEarnings: number
  date: string
  status: "paid" | "processing"
}
