"use client"

import * as React from "react"
import { TeacherProfileHeader } from "../components/profile/TeacherProfileHeader"
import { TeacherKpiCards } from "../components/profile/TeacherKpiCards"
import { TeacherTabs, TeacherTabKey } from "../components/profile/TeacherTabs"
import { TeacherFinanceCard } from "../components/profile/TeacherFinanceCard"
import { TeacherFinanceTab } from "../components/profile/TeacherFinanceTab"
import { TeacherPointsSessionsTab } from "../components/profile/TeacherPointsSessionsTab"
import { TeacherPaymentRequestsTab } from "../components/profile/TeacherPaymentRequestsTab"
import { TeacherTransactionsTab } from "../components/profile/TeacherTransactionsTab"
import { TeacherInfoCards } from "../components/profile/TeacherInfoCards"
import { TeacherAvailabilityCard } from "../components/profile/TeacherAvailabilityCard"
import { TeacherSessionsCard } from "../components/profile/TeacherSessionsCard"
import { useTeacher } from "../hooks/useTeachers"
import {
  TeacherProfile,
  TeacherPaymentRequest,
  TeacherTransaction,
} from "../types/teacherProfile.types"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

interface TeacherDetailPageProps {
  teacherId: string
}

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
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

export default function TeacherDetailPage({ teacherId }: TeacherDetailPageProps) {
  const [activeTab, setActiveTab] = React.useState<TeacherTabKey>("overview")
  const { data: apiTeacher, isLoading, isError } = useTeacher(teacherId)

  const profile: TeacherProfile | null = React.useMemo(() => {
    if (!apiTeacher) return null

    const fullName = apiTeacher.fullName || "Teacher"
    const initials = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("") || "TC"

    const subjects = apiTeacher.specializations
      ? Array.from(
          new Set(
            apiTeacher.specializations
              .map((s) => s.subjectName)
              .filter(Boolean) as string[]
          )
        )
      : ["General"]

    const educationStages = apiTeacher.specializations
      ? Array.from(
          new Set(
            apiTeacher.specializations
              .map((s) => s.academicStageName)
              .filter(Boolean) as string[]
          )
        )
      : []

    const teachingLevels = apiTeacher.specializations
      ? Array.from(
          new Set(
            apiTeacher.specializations
              .map((s) => s.teachingLevelName)
              .filter(Boolean) as string[]
          )
        )
      : []

    // Map weekly availability
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]
    const weeklyAvailability = dayNames.map((dayName, dayIndex) => {
      const slotsForDay = (apiTeacher.availabilitySlots || []).filter(
        (s) => s.dayOfWeek === dayIndex
      )
      return {
        day: dayName,
        slots: slotsForDay.map((s, idx) => ({
          id: s.id || `slot-${dayIndex}-${idx}`,
          start: s.startTime || "09:00 AM",
          end: s.endTime || "12:00 PM",
          status: "Available" as const,
        })),
      }
    })

    const code = `TCH-${(apiTeacher.id || "").slice(0, 5).toUpperCase()}`

    // Financial & Earnings data
    const teachingHours = (apiTeacher.availabilitySlots || []).length * 1.5 || 24
    const hourlyRate = 35
    const totalEarnings = teachingHours * hourlyRate + 450
    const pendingPayout = 280
    const completedPayouts = totalEarnings - pendingPayout

    const finance = {
      totalEarnings,
      pendingPayout,
      completedPayouts,
      hourlyRate,
      totalBilledHours: teachingHours,
      payoutMethod: "Bank Transfer (•••• 8912)",
      nextPayoutDate: "Nov 15, 2026",
      currency: "USD",
    }

    // Points & Sessions
    const pointsDetails = {
      currentBalance: 460,
      totalEarned: 1250,
      privateSessionsConducted: 14,
      ratingBonusPoints: 350,
    }

    // Payout / Payment Requests
    const paymentRequests: TeacherPaymentRequest[] = [
      {
        id: "payout-req-1",
        code: `PAY-${(apiTeacher.id || teacherId).slice(0, 4).toUpperCase()}-101`,
        description: "Teaching Hours Payout (Oct 16 - Oct 31)",
        amount: "$420.00",
        requestedDate: "Nov 01, 2026",
        status: "Approved",
        notes: "Verified by academic billing director",
      },
      {
        id: "payout-req-2",
        code: `PAY-${(apiTeacher.id || teacherId).slice(0, 4).toUpperCase()}-102`,
        description: "1-on-1 Private Sessions Bonus (8 Sessions)",
        amount: "$280.00",
        requestedDate: "Nov 05, 2026",
        status: "Pending",
        notes: "Scheduled for next bi-weekly payout run",
      },
    ]

    // Payout Transactions
    const transactions: TeacherTransaction[] = [
      {
        id: "disb-1",
        code: `DISB-${(apiTeacher.id || teacherId).slice(0, 5).toUpperCase()}-01`,
        teacherName: fullName,
        payoutMethod: "Bank Wire Transfer (National Bank)",
        amount: "$420.00",
        date: "Nov 02, 2026",
        paymentStatus: "Paid",
        transactionStatus: "Completed",
      },
      {
        id: "disb-2",
        code: `DISB-${(apiTeacher.id || teacherId).slice(0, 5).toUpperCase()}-02`,
        teacherName: fullName,
        payoutMethod: "Bank Wire Transfer (National Bank)",
        amount: "$385.00",
        date: "Oct 16, 2026",
        paymentStatus: "Paid",
        transactionStatus: "Completed",
      },
      {
        id: "disb-3",
        code: `DISB-${(apiTeacher.id || teacherId).slice(0, 5).toUpperCase()}-03`,
        teacherName: fullName,
        payoutMethod: "Vodafone Cash Wallet",
        amount: "$150.00",
        date: "Oct 01, 2026",
        paymentStatus: "Paid",
        transactionStatus: "Completed",
      },
    ]

    return {
      id: apiTeacher.id,
      name: fullName,
      code,
      avatarInitials: initials,
      avatarColorClass: getAvatarColor(apiTeacher.id || fullName),
      status: apiTeacher.isActive ? "Active" : "Inactive",
      availabilityStatus: (apiTeacher.isAvailable === false
        ? "Unavailable"
        : !apiTeacher.isActive
        ? "Offline"
        : "Available"),
      kpis: {
        totalStudents: 18,
        upcomingSessions: apiTeacher.availabilitySlots?.length ?? 0,
        completedSessions: 42,
        averageRating: 4.9,
        teachingHours,
      },
      personalInfo: {
        fullName,
        nationalId: apiTeacher.nationalId || "—",
        dateOfBirth: apiTeacher.dateOfBirth
          ? new Date(apiTeacher.dateOfBirth).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—",
        gender: (apiTeacher.gender === "Female" ? "Female" : "Male"),
        email: apiTeacher.email || "—",
        phone: apiTeacher.phoneNumber || "—",
      },
      professionalInfo: {
        subjects: subjects.length > 0 ? subjects : ["General"],
        qualifications: apiTeacher.qualifications || "—",
        yearsOfExperience: apiTeacher.yearsOfExperience
          ? `${apiTeacher.yearsOfExperience} years`
          : "—",
        teachingLevels: teachingLevels.length > 0 ? teachingLevels : [],
        bio: apiTeacher.bio || "—",
      },
      teachingSetup: {
        subjects: subjects.length > 0 ? subjects : ["General"],
        educationStages: educationStages.length > 0 ? educationStages : [],
        teachingLevels: teachingLevels.length > 0 ? teachingLevels : [],
      },
      accountInfo: {
        loginMethod: "Email" as const,
        email: apiTeacher.email || "—",
        phone: apiTeacher.phoneNumber || undefined,
        accountStatus: apiTeacher.isActive ? "Active" : "Inactive",
      },
      verificationDocuments: {
        degreeCertificate: {
          fileName: apiTeacher.universityDegreeCertificateUrl || "degree_certificate.pdf",
          fileSize: "—",
          status: "Approved" as const,
        },
        nationalIdImage: apiTeacher.nationalIdDocumentUrl
          ? {
              fileName: apiTeacher.nationalIdDocumentUrl,
              fileSize: "—",
              uploaded: true,
            }
          : undefined,
      },
      weeklyAvailability,
      upcomingSessions: [],
      previousSessions: [],
      finance,
      pointsDetails,
      paymentRequests,
      transactions,
    }
  }, [apiTeacher, teacherId])

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <LoadingSpinner title="Loading teacher profile" />
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
      {/* 1. Header with Back link, Avatar, Active Badge, Code/Availability, Edit button */}
      <TeacherProfileHeader profile={profile} />

      {/* 2. Top 5 KPI Cards */}
      <TeacherKpiCards kpis={profile.kpis} />

      {/* 3. Tab Navigation Bar */}
      <TeacherTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. Tab Contents */}
      <div className="w-full pt-1 flex flex-col gap-6">
        {activeTab === "overview" && (
          <>
            {/* Earnings & Payouts Card in Overview */}
            <TeacherFinanceCard
              finance={profile.finance}
              onViewFinanceTab={() => setActiveTab("finance")}
            />

            {/* Personal & Professional Info Cards */}
            <TeacherInfoCards profile={profile} />

            {/* Availability Schedule Card */}
            <TeacherAvailabilityCard
              schedule={profile.weeklyAvailability}
              currentStatus={profile.availabilityStatus}
            />

            {/* Sessions Tables (Upcoming & Previous) */}
            <TeacherSessionsCard
              upcomingSessions={profile.upcomingSessions}
              previousSessions={profile.previousSessions}
            />
          </>
        )}

        {activeTab === "finance" && (
          <TeacherFinanceTab
            finance={profile.finance}
            onViewTransactions={() => setActiveTab("transactions")}
            onViewPaymentRequests={() => setActiveTab("payment_requests")}
          />
        )}

        {activeTab === "points_sessions" && (
          <TeacherPointsSessionsTab pointsDetails={profile.pointsDetails} />
        )}

        {activeTab === "payment_requests" && (
          <TeacherPaymentRequestsTab paymentRequests={profile.paymentRequests} />
        )}

        {activeTab === "transactions" && (
          <TeacherTransactionsTab transactions={profile.transactions} />
        )}
      </div>
    </main>
  )
}
