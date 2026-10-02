"use client"

import * as React from "react"
import { TeacherProfileHeader } from "../components/profile/TeacherProfileHeader"
import { TeacherKpiCards } from "../components/profile/TeacherKpiCards"
import { TeacherInfoCards } from "../components/profile/TeacherInfoCards"
import { TeacherAvailabilityCard } from "../components/profile/TeacherAvailabilityCard"
import { TeacherSessionsCard } from "../components/profile/TeacherSessionsCard"
import { useTeacher } from "../hooks/useTeachers"
import { TeacherProfile } from "../types/teacherProfile.types"
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
  const { data: apiTeacher, isLoading, isError } = useTeacher(teacherId)

  const profile: TeacherProfile | null = React.useMemo(() => {
    if (!apiTeacher) return null

    const initials = (apiTeacher.fullName || "Teacher")
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

    return {
      id: apiTeacher.id,
      name: apiTeacher.fullName || "Teacher",
      code,
      avatarInitials: initials,
      avatarColorClass: getAvatarColor(apiTeacher.id || apiTeacher.fullName || ""),
      status: apiTeacher.isActive ? "Active" : "Inactive",
      availabilityStatus: (apiTeacher.isAvailable === false
        ? "Unavailable"
        : !apiTeacher.isActive
        ? "Offline"
        : "Available") as any,
      kpis: {
        totalStudents: 0,
        upcomingSessions: apiTeacher.availabilitySlots?.length ?? 0,
        completedSessions: 0,
        averageRating: 5.0,
        teachingHours: 0,
      },
      personalInfo: {
        fullName: apiTeacher.fullName || "—",
        nationalId: apiTeacher.nationalId || "—",
        dateOfBirth: apiTeacher.dateOfBirth
          ? new Date(apiTeacher.dateOfBirth).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—",
        gender: (apiTeacher.gender === "Female" ? "Female" : "Male") as any,
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
    }
  }, [apiTeacher])

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

      {/* 3. Personal & Professional Info Cards */}
      <TeacherInfoCards profile={profile} />

      {/* 4. Availability Schedule Card */}
      <TeacherAvailabilityCard
        schedule={profile.weeklyAvailability}
        currentStatus={profile.availabilityStatus}
      />

      {/* 5. Sessions Tables (Upcoming & Previous) */}
      <TeacherSessionsCard
        upcomingSessions={profile.upcomingSessions}
        previousSessions={profile.previousSessions}
      />
    </main>
  )
}
