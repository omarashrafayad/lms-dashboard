"use client"

import * as React from "react"
import { getStudentProfile } from "../data/mockStudentProfile"
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

interface StudentDetailPageProps {
  studentId: string
}

export default function StudentDetailPage({ studentId }: StudentDetailPageProps) {
  const { data: apiStudent } = useStudent(studentId)

  const profile = React.useMemo(() => {
    const defaultProfile = getStudentProfile(studentId)
    if (!apiStudent) return defaultProfile

    const initials = (apiStudent.fullName || defaultProfile.name || "S")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("")

    return {
      ...defaultProfile,
      id: apiStudent.id || defaultProfile.id,
      name: apiStudent.fullName || defaultProfile.name,
      fullName: apiStudent.fullName || defaultProfile.fullName,
      email: apiStudent.email || defaultProfile.email,
      phone: apiStudent.phoneNumber || defaultProfile.phone,
      stage: apiStudent.educationStage || defaultProfile.stage,
      educationStage: apiStudent.educationStage || defaultProfile.educationStage,
      grade: apiStudent.grade || defaultProfile.grade,
      system: apiStudent.educationSystem || defaultProfile.system,
      educationSystem: apiStudent.educationSystem || defaultProfile.educationSystem,
      gender: (apiStudent.gender === "Female" || apiStudent.gender === "Male"
        ? apiStudent.gender
        : defaultProfile.gender) as "Male" | "Female",
      dateOfBirth: apiStudent.dateOfBirth || defaultProfile.dateOfBirth,
      status: (apiStudent.isActive ? "Active" : "Inactive") as "Active" | "Inactive",
      avatarInitials: initials || defaultProfile.avatarInitials,
      studentId: `STU-${(apiStudent.id || "").slice(0, 5).toUpperCase()}`,
      code: `STD-${(apiStudent.id || "").slice(0, 5).toUpperCase()}`,
    }
  }, [studentId, apiStudent])

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
