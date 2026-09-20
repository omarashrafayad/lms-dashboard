export interface StudentCourseProgress {
  id: string
  name: string
  progress: number
  score: number
  status: "In Progress" | "Completed"
}

export interface StudentLessonItem {
  id: string
  name: string
  course: string
  completedDate: string
  status: "Completed" | "In Progress"
}

export interface StudentExamResult {
  id: string
  name: string
  course: string
  date: string
  score: number
  result: "Passed" | "Failed"
}

export interface StudentSessionItem {
  id: string
  subject: string
  instructor: string
  dateText: string
  timeText: string
  status: "Upcoming" | "Attended" | "Missed"
}

export interface StudentActivityItem {
  id: string
  title: string
  timestamp: string
}

export interface StudentProfile {
  id: string
  name: string
  code: string
  avatarInitials: string
  avatarColorClass: string
  status: "Active" | "Inactive"
  stage: string
  grade: string
  system: string
  school: string

  // Personal Info
  fullName: string
  dateOfBirth: string
  gender: "Male" | "Female"
  email: string
  phone: string

  // Academic Info
  educationSystem: string
  educationStage: string
  studentId: string

  // KPI Metrics
  kpis: {
    overallProgress: number
    averageScore: number
    completedCourses: number
    completedLessons: number
    upcomingSessions: number
  }

  // Learning Progress
  learningProgress: {
    overallProgress: number
    currentLevel: string
    completedLessons: number
    totalLessons: number
    completedCourses: number
    totalCourses: number
    averageScore: number
  }

  // Tables & Lists
  courses: StudentCourseProgress[]
  lessons: StudentLessonItem[]
  exams: StudentExamResult[]
  sessions: {
    upcoming: StudentSessionItem[]
    previous: StudentSessionItem[]
  }

  // Subscription & Parent
  subscription: {
    plan: string
    status: "Active" | "Inactive"
    startDate: string
    expiryDate: string
  }
  parent: {
    name: string
    relationship: string
    email: string
    phone: string
  }

  // Activity History
  activityHistory: StudentActivityItem[]
}
