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

export interface StudentPaymentRequest {
  id: string
  code: string
  plan: string
  amount: string
  requestedDate: string
  status: "Pending" | "Approved" | "Rejected"
  notes?: string
}

export interface StudentTransaction {
  id: string
  code: string
  studentName: string
  plan: string
  amount: string
  points: string
  date: string
  paymentStatus: "Paid" | "Pending" | "Failed"
  transactionStatus: "Completed" | "Processing" | "Failed"
}

export interface StudentPointsDetails {
  currentBalance: number
  totalEarned: number
  totalRedeemed: number
  privateSessionsRemaining: number
  privateSessionsUsed: number
}

export interface StudentFinanceSummary {
  totalSpent: number
  currentPlanName: string
  currentPlanCost: number
  billingCycle: string
  nextBillingDate: string
  paymentMethod: string
  currency: string
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

  // Points & Finance & Requests
  finance: StudentFinanceSummary
  pointsDetails: StudentPointsDetails
  paymentRequests: StudentPaymentRequest[]
  transactions: StudentTransaction[]

  // Activity
  activityHistory: StudentActivityItem[]
}

export interface BillingStudentFinanceTotals {
  paymentsCount: number
  collectedAmount: number
  discountAmount: number
  awaitingReviewCount: number
  awaitingReviewAmount: number
  refundedCount: number
  refundedAmount: number
  netPaidAmount: number
}

export interface BillingPaymentItem {
  id: string
  invoiceNumber?: string | null
  reference?: string | null
  subscriptionId?: string | null
  planId?: string | null
  planName?: string | null
  studentId?: string | null
  studentName?: string | null
  studentGrade?: string | null
  payerName?: string | null
  itemDescription?: string | null
  itemKind?: string | null
  amount: number
  discountAmount: number
  couponCode?: string | null
  method?: string | null
  methodDisplay?: string | null
  status?: string | null
  gatewayReference?: string | null
  paidAt: string
  reviewedAt?: string | null
  reviewedBy?: string | null
  reviewNote?: string | null
}

export interface BillingSubscriptionItem {
  id: string
  studentId: string
  studentName?: string | null
  studentGrade?: string | null
  parentId?: string | null
  parentName?: string | null
  parentPhone?: string | null
  planId: string
  planName?: string | null
  tier?: string | null
  billingCycle?: string | null
  status?: string | null
  startsAt: string
  expiresAt: string
  daysRemaining: number
  amountCharged: number
  autoRenew: boolean
  notes?: string | null
}

export interface BillingStudentRefundItem {
  paymentId: string
  invoiceNumber?: string | null
  amount: number
  method?: string | null
  methodDisplay?: string | null
  refundedAt: string
  reviewedBy?: string | null
  note?: string | null
}

export interface BillingStudentSessionFinanceItem {
  id?: string
  sessionId?: string
  title?: string
  date?: string
  teacherName?: string
  status?: string
}

export interface BillingStudentSessionFinance {
  bookedCount: number
  upcomingCount: number
  attendedCount: number
  noShowCount: number
  cancelledCount: number
  endedUnmarkedCount: number
  attendedMinutes: number
  recent?: BillingStudentSessionFinanceItem[] | null
}

export interface BillingStudentFinanceOverview {
  studentId: string
  studentName?: string | null
  totals: BillingStudentFinanceTotals
  payments?: BillingPaymentItem[] | null
  subscriptions?: BillingSubscriptionItem[] | null
  refunds?: BillingStudentRefundItem[] | null
  bookings?: BillingStudentSessionFinance | null
}

