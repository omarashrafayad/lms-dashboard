"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { StudentProfileHeader } from "../components/profile/StudentProfileHeader"
import { StudentKpiCards } from "../components/profile/StudentKpiCards"
import { StudentTabs, StudentTabKey } from "../components/profile/StudentTabs"
import { StudentFinanceCard } from "../components/profile/StudentFinanceCard"
import { StudentFinanceTab } from "../components/profile/StudentFinanceTab"
import { StudentPointsSessionsTab } from "../components/profile/StudentPointsSessionsTab"
import { StudentPaymentRequestsTab } from "../components/profile/StudentPaymentRequestsTab"
import { StudentTransactionsTab } from "../components/profile/StudentTransactionsTab"
import { StudentInfoCards } from "../components/profile/StudentInfoCards"
import { StudentLearningProgress } from "../components/profile/StudentLearningProgress"
import { StudentCoursesTable } from "../components/profile/StudentCoursesTable"
import { StudentLessonsTable } from "../components/profile/StudentLessonsTable"
import { StudentExamsTable } from "../components/profile/StudentExamsTable"
import { StudentSessionsCard } from "../components/profile/StudentSessionsCard"
import { StudentSubscriptionAndParent } from "../components/profile/StudentSubscriptionAndParent"
import { StudentActivityHistory } from "../components/profile/StudentActivityHistory"
import { useStudent } from "../hooks/useStudents"
import {
  StudentProfile,
  StudentTransaction,
  StudentPaymentRequest,
} from "../types/studentProfile.types"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

interface StudentDetailPageProps {
  studentId: string
}

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
]

function getAvatarColor(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function StudentDetailPage({ studentId }: StudentDetailPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<StudentTabKey>("overview")
  const { data: apiStudent, isLoading, isError } = useStudent(studentId)

  const profile: StudentProfile | null = React.useMemo(() => {
    if (!apiStudent) return null

    const studentData = apiStudent.profile || apiStudent
    const stats = apiStudent.stats || {
      overallProgress: 0,
      averageScore: 0,
      completedCourses: 0,
      totalCourses: 0,
      completedLessons: 0,
      totalLessons: 0,
      upcomingSessions: 0,
    }

    const fullName = studentData.fullName || "Student"
    const initials = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("") || "ST"

    const code = `STD-${(studentData.id || studentId).slice(0, 5).toUpperCase()}`

    const courses = (apiStudent.courses || []).map((c) => ({
      id: c.courseId,
      name: c.courseName || "Course",
      progress: c.progressPercentage ?? 0,
      score: c.averageScore ?? 0,
      status: (c.status === "Completed" ? "Completed" : "In Progress") as "Completed" | "In Progress",
    }))

    const lessons = (apiStudent.lessons || []).map((l) => ({
      id: l.lessonId,
      name: l.lessonName || "Lesson",
      course: l.courseName || "Course",
      completedDate: l.completedAt ? new Date(l.completedAt).toLocaleDateString() : "—",
      status: (l.status === "Completed" ? "Completed" : "In Progress") as "Completed" | "In Progress",
    }))

    const exams = (apiStudent.exams || []).map((e) => ({
      id: e.id || e.examId,
      name: e.examTitle || "Exam",
      course: e.courseName || "Course",
      date: e.completedAt ? new Date(e.completedAt).toLocaleDateString() : "—",
      score: e.score ?? 0,
      result: (e.score >= 50 ? "Passed" : "Failed") as "Passed" | "Failed",
    }))

    const formatSession = (s: any) => {
      const start = s.scheduledStart ? new Date(s.scheduledStart) : null
      return {
        id: s.id,
        subject: s.title || s.courseOrSubject || "Live Session",
        instructor: s.teacherName || "Teacher",
        dateText: start ? start.toLocaleDateString() : "—",
        timeText: start
          ? start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "—",
        status: (s.displayStatus || s.status || "Upcoming") as
          | "Upcoming"
          | "Attended"
          | "Missed",
      }
    }

    const sessions = {
      upcoming: (apiStudent.sessions?.upcoming || []).map(formatSession),
      previous: (apiStudent.sessions?.previous || []).map(formatSession),
    }

    const firstSub = apiStudent.subscriptions?.[0]
    const subscription = {
      plan: firstSub?.planName || "Standard Monthly",
      status: (firstSub?.status === "Active" || studentData.isActive
        ? "Active"
        : "Inactive") as "Active" | "Inactive",
      startDate: firstSub?.startsAt
        ? new Date(firstSub.startsAt).toLocaleDateString()
        : studentData.createdAt
        ? new Date(studentData.createdAt).toLocaleDateString()
        : "—",
      expiryDate: firstSub?.expiresAt
        ? new Date(firstSub.expiresAt).toLocaleDateString()
        : "—",
    }

    const firstGuardian = apiStudent.guardians?.[0]
    const parent = {
      name: firstGuardian?.fullName || "—",
      relationship: "Guardian / Parent",
      email: firstGuardian?.email || "—",
      phone: firstGuardian?.phoneNumber || "—",
    }

    // Finance & Billing
    const totalAmountCharged = (apiStudent.subscriptions || []).reduce(
      (acc: number, s: any) => acc + (s.amountCharged || 45),
      0
    ) || (firstSub?.amountCharged ? Number(firstSub.amountCharged) : 120)

    const finance = {
      totalSpent: totalAmountCharged,
      currentPlanName: firstSub?.planName || "Standard Monthly",
      currentPlanCost: firstSub?.amountCharged ? Number(firstSub.amountCharged) : 45,
      billingCycle: firstSub?.billingCycle || "Monthly",
      nextBillingDate: firstSub?.expiresAt
        ? new Date(firstSub.expiresAt).toLocaleDateString()
        : "Nov 30, 2026",
      paymentMethod: "Credit Card (•••• 4242)",
      currency: "USD",
    }

    // Points & Private Sessions
    const pointsDetails = {
      currentBalance: 320,
      totalEarned: 850,
      totalRedeemed: 530,
      privateSessionsRemaining: 2,
      privateSessionsUsed: 4,
    }

    // Payment Requests
    const paymentRequests: StudentPaymentRequest[] = [
      {
        id: "req-1",
        code: `PR-${(studentData.id || studentId).slice(0, 4).toUpperCase()}-01`,
        plan: firstSub?.planName || "Standard Monthly",
        amount: `$${finance.currentPlanCost}.00`,
        requestedDate: subscription.startDate || "Nov 01, 2026",
        status: "Approved",
        notes: "Approved via automated checkout",
      },
      {
        id: "req-2",
        code: `PR-${(studentData.id || studentId).slice(0, 4).toUpperCase()}-02`,
        plan: "1-on-1 Math Private Tutoring (2 Sessions)",
        amount: "$60.00",
        requestedDate: "Oct 15, 2026",
        status: "Approved",
        notes: "Redeemed with loyalty points package",
      },
    ]

    // Payments & Transactions
    const transactions: StudentTransaction[] = (apiStudent.subscriptions || []).map(
      (sub: any, idx: number) => ({
        id: sub.id || `txn-${idx}`,
        code: `TXN-${(sub.id || studentId).slice(0, 6).toUpperCase()}`,
        studentName: fullName,
        plan: sub.planName || "Standard Monthly",
        amount: `$${sub.amountCharged || 45}.00`,
        points: "45",
        date: sub.startsAt
          ? new Date(sub.startsAt).toLocaleDateString()
          : "Nov 01, 2026",
        paymentStatus: (sub.status === "Active" ? "Paid" : "Paid") as "Paid",
        transactionStatus: "Completed" as const,
      })
    )

    if (transactions.length === 0) {
      transactions.push({
        id: `txn-default`,
        code: `TXN-${(studentData.id || studentId).slice(0, 6).toUpperCase()}`,
        studentName: fullName,
        plan: "Standard Monthly",
        amount: "$45.00",
        points: "45",
        date: "Nov 01, 2026",
        paymentStatus: "Paid",
        transactionStatus: "Completed",
      })
    }

    return {
      id: studentData.id || studentId,
      name: fullName,
      fullName: fullName,
      code,
      studentId: code,
      avatarInitials: initials,
      avatarColorClass: getAvatarColor(studentData.id || fullName),
      status: studentData.isActive ? "Active" : "Inactive",
      stage: studentData.educationStage || "—",
      educationStage: studentData.educationStage || "—",
      grade: studentData.grade || "—",
      system: studentData.educationSystem || "—",
      educationSystem: studentData.educationSystem || "—",
      school: "—",
      gender: (studentData.gender === "Female" ? "Female" : "Male"),
      dateOfBirth: studentData.dateOfBirth || "—",
      email: studentData.email || "—",
      phone: studentData.phoneNumber || "—",
      kpis: {
        overallProgress: stats.overallProgress ?? 0,
        averageScore: stats.averageScore ?? 0,
        completedCourses: stats.completedCourses ?? 0,
        completedLessons: stats.completedLessons ?? 0,
        upcomingSessions: stats.upcomingSessions ?? (apiStudent.sessions?.upcomingCount ?? 0),
      },
      learningProgress: {
        overallProgress: stats.overallProgress ?? 0,
        currentLevel: studentData.level || "Standard",
        completedLessons: stats.completedLessons ?? 0,
        totalLessons: stats.totalLessons ?? 0,
        completedCourses: stats.completedCourses ?? 0,
        totalCourses: stats.totalCourses ?? 0,
        averageScore: stats.averageScore ?? 0,
      },
      courses,
      lessons,
      exams,
      sessions,
      subscription,
      parent,
      finance,
      pointsDetails,
      paymentRequests,
      transactions,
      activityHistory: [],
    }
  }, [apiStudent, studentId])

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <LoadingSpinner title="Loading student profile" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="flex-1 p-8">
        <GlobalError />
      </div>
    )
  }

  return (
    <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-16">
      {/* 1. Header with Back link, Avatar, Active Badge, Code/Grade, Edit button */}
      <StudentProfileHeader
        profile={profile}
        onEdit={() => {
          router.push(`/student/${studentId}/edit`)
        }}
      />

      {/* 2. Top 5 KPI Cards */}
      <StudentKpiCards kpis={profile.kpis} />

      {/* 3. Tab Navigation Bar */}
      <StudentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. Tab Contents */}
      <div className="w-full pt-1 flex flex-col gap-6">
        {activeTab === "overview" && (
          <>
            {/* Finance Overview Card in Overview */}
            <StudentFinanceCard
              finance={profile.finance}
              onViewFinanceTab={() => setActiveTab("finance")}
            />

            {/* Personal & Academic Info Cards */}
            <StudentInfoCards profile={profile} />

            {/* Learning Progress Card */}
            <StudentLearningProgress progress={profile.learningProgress} />

            {/* Courses Table */}
            <StudentCoursesTable courses={profile.courses} />

            {/* Lessons Table */}
            <StudentLessonsTable lessons={profile.lessons} />

            {/* Exams & Results Table */}
            <StudentExamsTable exams={profile.exams} />

            {/* Sessions Card */}
            <StudentSessionsCard sessions={profile.sessions} />

            {/* Subscription & Parent / Guardian Cards */}
            <StudentSubscriptionAndParent
              subscription={profile.subscription}
              parent={profile.parent}
            />

            {/* Activity History Timeline */}
            <StudentActivityHistory activities={profile.activityHistory} />
          </>
        )}

        {activeTab === "finance" && (
          <StudentFinanceTab
            finance={profile.finance}
            subscription={profile.subscription}
            onViewTransactions={() => setActiveTab("transactions")}
            onViewPaymentRequests={() => setActiveTab("payment_requests")}
          />
        )}

        {activeTab === "points_sessions" && (
          <StudentPointsSessionsTab pointsDetails={profile.pointsDetails} />
        )}

        {activeTab === "payment_requests" && (
          <StudentPaymentRequestsTab paymentRequests={profile.paymentRequests} />
        )}

        {activeTab === "transactions" && (
          <StudentTransactionsTab transactions={profile.transactions} />
        )}
      </div>
    </main>
  )
}
