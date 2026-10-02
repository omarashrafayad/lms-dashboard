"use client"

import * as React from "react"
import { StudentProfileHeader } from "../components/profile/StudentProfileHeader"
import { StudentKpiCards } from "../components/profile/StudentKpiCards"
import { StudentInfoCards } from "../components/profile/StudentInfoCards"
import { StudentLearningProgress } from "../components/profile/StudentLearningProgress"
import { StudentCoursesTable } from "../components/profile/StudentCoursesTable"
import { StudentLessonsTable } from "../components/profile/StudentLessonsTable"
import { StudentExamsTable } from "../components/profile/StudentExamsTable"
import { StudentSessionsCard } from "../components/profile/StudentSessionsCard"
import { StudentSubscriptionAndParent } from "../components/profile/StudentSubscriptionAndParent"
import { StudentActivityHistory } from "../components/profile/StudentActivityHistory"
import { useStudent } from "../hooks/useStudents"
import { StudentProfile } from "../types/studentProfile.types"
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
  const { data: apiStudent, isLoading, isError } = useStudent(studentId)

  const profile: StudentProfile | null = React.useMemo(() => {
    if (!apiStudent) return null

    const initials = (apiStudent.fullName || "Student")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("") || "ST"

    const code = `STD-${(apiStudent.id || "").slice(0, 5).toUpperCase()}`

    return {
      id: apiStudent.id,
      name: apiStudent.fullName || "Student",
      fullName: apiStudent.fullName || "Student",
      code,
      studentId: code,
      avatarInitials: initials,
      avatarColorClass: getAvatarColor(apiStudent.id || apiStudent.fullName || ""),
      status: apiStudent.isActive ? "Active" : "Inactive",
      stage: apiStudent.educationStage || "—",
      educationStage: apiStudent.educationStage || "—",
      grade: apiStudent.grade || "—",
      system: apiStudent.educationSystem || "—",
      educationSystem: apiStudent.educationSystem || "—",
      school: "—",
      gender: (apiStudent.gender === "Female" ? "Female" : "Male"),
      dateOfBirth: apiStudent.dateOfBirth || "—",
      email: apiStudent.email || "—",
      phone: apiStudent.phoneNumber || "—",
      kpis: {
        overallProgress: 0,
        averageScore: 0,
        completedCourses: 0,
        completedLessons: 0,
        upcomingSessions: 0,
      },
      learningProgress: {
        overallProgress: 0,
        currentLevel: "Beginner",
        completedLessons: 0,
        totalLessons: 0,
        completedCourses: 0,
        totalCourses: 0,
        averageScore: 0,
      },
      courses: [],
      lessons: [],
      exams: [],
      sessions: {
        upcoming: [],
        previous: [],
      },
      subscription: {
        plan: "Standard Plan",
        status: apiStudent.isActive ? "Active" : "Inactive",
        startDate: apiStudent.createdAt ? new Date(apiStudent.createdAt).toLocaleDateString() : "—",
        expiryDate: "—",
      },
      parent: {
        name: "—",
        relationship: "Parent",
        email: "—",
        phone: "—",
      },
      activityHistory: [],
    }
  }, [apiStudent])

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
          console.log("Edit Student clicked for", profile.name)
        }}
      />

      {/* 2. Top 5 KPI Cards */}
      <StudentKpiCards kpis={profile.kpis} />

      {/* 3. Personal & Academic Info Cards */}
      <StudentInfoCards profile={profile} />

      {/* 4. Learning Progress Card */}
      <StudentLearningProgress progress={profile.learningProgress} />

      {/* 5. Courses Table */}
      <StudentCoursesTable courses={profile.courses} />

      {/* 6. Lessons Table */}
      <StudentLessonsTable lessons={profile.lessons} />

      {/* 7. Exams & Results Table */}
      <StudentExamsTable exams={profile.exams} />

      {/* 8. Sessions Card */}
      <StudentSessionsCard sessions={profile.sessions} />

      {/* 9. Subscription & Parent / Guardian Cards */}
      <StudentSubscriptionAndParent
        subscription={profile.subscription}
        parent={profile.parent}
      />

      {/* 10. Activity History Timeline */}
      <StudentActivityHistory activities={profile.activityHistory} />
    </main>
  )
}
