"use client"

import * as React from "react"
import { getTeacherProfile } from "../data/mockTeacherProfile"
import { TeacherProfileHeader } from "../components/profile/TeacherProfileHeader"
import { TeacherKpiCards } from "../components/profile/TeacherKpiCards"
import { TeacherInfoCards } from "../components/profile/TeacherInfoCards"
import { TeacherAvailabilityCard } from "../components/profile/TeacherAvailabilityCard"
import { TeacherSessionsCard } from "../components/profile/TeacherSessionsCard"
import { useTeacher } from "../hooks/useTeachers"

interface TeacherDetailPageProps {
  teacherId: string
}

export default function TeacherDetailPage({ teacherId }: TeacherDetailPageProps) {
  const { data: apiTeacher } = useTeacher(teacherId)

  const profile = React.useMemo(() => {
    const defaultProfile = getTeacherProfile(teacherId)
    if (!apiTeacher) return defaultProfile

    const initials = (apiTeacher.fullName || defaultProfile.name || "T")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("")

    const subjects = apiTeacher.specializations
      ? Array.from(
          new Set(
            apiTeacher.specializations
              .map((s) => s.subjectName)
              .filter(Boolean) as string[]
          )
        )
      : defaultProfile.professionalInfo.subjects

    const educationStages = apiTeacher.specializations
      ? Array.from(
          new Set(
            apiTeacher.specializations
              .map((s) => s.academicStageName)
              .filter(Boolean) as string[]
          )
        )
      : defaultProfile.teachingSetup.educationStages

    const teachingLevels = apiTeacher.specializations
      ? Array.from(
          new Set(
            apiTeacher.specializations
              .map((s) => s.teachingLevelName)
              .filter(Boolean) as string[]
          )
        )
      : defaultProfile.teachingSetup.teachingLevels

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
    let weeklyAvailability = defaultProfile.weeklyAvailability
    if (apiTeacher.availabilitySlots && Array.isArray(apiTeacher.availabilitySlots)) {
      weeklyAvailability = dayNames.map((dayName, dayIndex) => {
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
    }

    return {
      ...defaultProfile,
      id: apiTeacher.id || defaultProfile.id,
      name: apiTeacher.fullName || defaultProfile.name,
      code: `TCH-${(apiTeacher.id || "").slice(0, 5).toUpperCase()}`,
      avatarInitials: initials || defaultProfile.avatarInitials,
      status: (apiTeacher.isActive ? "Active" : "Inactive") as "Active" | "Inactive",
      availabilityStatus: (apiTeacher.isAvailable === false
        ? "Unavailable"
        : !apiTeacher.isActive
        ? "Offline"
        : "Available") as any,
      personalInfo: {
        fullName: apiTeacher.fullName || defaultProfile.personalInfo.fullName,
        nationalId: apiTeacher.nationalId || defaultProfile.personalInfo.nationalId,
        dateOfBirth: apiTeacher.dateOfBirth
          ? new Date(apiTeacher.dateOfBirth).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : defaultProfile.personalInfo.dateOfBirth,
        gender: (apiTeacher.gender || defaultProfile.personalInfo.gender) as any,
        email: apiTeacher.email || defaultProfile.personalInfo.email,
        phone: apiTeacher.phoneNumber || defaultProfile.personalInfo.phone,
      },
      professionalInfo: {
        subjects: subjects.length > 0 ? subjects : ["General"],
        qualifications:
          apiTeacher.qualifications || defaultProfile.professionalInfo.qualifications,
        yearsOfExperience: apiTeacher.yearsOfExperience
          ? `${apiTeacher.yearsOfExperience} years`
          : defaultProfile.professionalInfo.yearsOfExperience,
        teachingLevels:
          teachingLevels.length > 0
            ? teachingLevels
            : defaultProfile.professionalInfo.teachingLevels,
        bio: apiTeacher.bio || defaultProfile.professionalInfo.bio,
      },
      teachingSetup: {
        subjects: subjects.length > 0 ? subjects : ["General"],
        educationStages:
          educationStages.length > 0
            ? educationStages
            : defaultProfile.teachingSetup.educationStages,
        teachingLevels:
          teachingLevels.length > 0
            ? teachingLevels
            : defaultProfile.teachingSetup.teachingLevels,
      },
      weeklyAvailability,
    }
  }, [teacherId, apiTeacher])

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
