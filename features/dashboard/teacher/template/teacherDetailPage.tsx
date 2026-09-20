"use client"

import * as React from "react"
import { getTeacherProfile } from "../data/mockTeacherProfile"
import { TeacherProfileHeader } from "../components/profile/TeacherProfileHeader"
import { TeacherKpiCards } from "../components/profile/TeacherKpiCards"
import { TeacherInfoCards } from "../components/profile/TeacherInfoCards"
import { TeacherAvailabilityCard } from "../components/profile/TeacherAvailabilityCard"
import { TeacherSessionsCard } from "../components/profile/TeacherSessionsCard"

interface TeacherDetailPageProps {
  teacherId: string
}

export default function TeacherDetailPage({ teacherId }: TeacherDetailPageProps) {
  const profile = React.useMemo(() => {
    return getTeacherProfile(teacherId)
  }, [teacherId])

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
