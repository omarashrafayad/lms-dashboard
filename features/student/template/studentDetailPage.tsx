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

interface StudentDetailPageProps {
  studentId: string
}

export default function StudentDetailPage({ studentId }: StudentDetailPageProps) {
  const profile = React.useMemo(() => {
    return getStudentProfile(studentId)
  }, [studentId])

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
