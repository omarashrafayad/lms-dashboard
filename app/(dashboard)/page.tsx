"use client"

import React, { useEffect, useState } from "react"
import { useAuthStore } from "@/stores/useAuthStore"
import { isInstructorRole, isStudentRole } from "@/features/auth/types/auth.types"
import DashboardOverviewPage from "@/features/dashboard/overview/template/DashboardOverviewPage"
import { StudentDashboardPage } from "@/features/dashboard/student-portal/template/StudentDashboardPage"
import { TeacherDashboardPage } from "@/features/dashboard/teacher-portal/template/TeacherDashboardPage"

export default function RootDashboardPage() {
  const role = useAuthStore((s) => s.role)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  if (isStudentRole(role)) {
    return <StudentDashboardPage />
  }

  if (isInstructorRole(role)) {
    return <TeacherDashboardPage />
  }

  return <DashboardOverviewPage />
}
