"use client"

import * as React from "react"
import { usePermissions } from "@/lib/rbac/usePermissions"
import { useAuthStore } from "@/stores/useAuthStore"
import StudentDetailPage from "@/features/dashboard/student/template/studentDetailPage"
import TeacherDetailPage from "@/features/dashboard/teacher/template/teacherDetailPage"
import { useMyStudentProfile } from "@/features/dashboard/student/hooks/useStudents"
import { useMyTeacherProfile } from "@/features/dashboard/teacher/hooks/useTeachers"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { User, GraduationCap, Briefcase, ShieldAlert, ArrowRight } from "lucide-react"
import Link from "next/link"

function AutoDetectProfile() {
  const [adminView, setAdminView] = React.useState<"student" | "teacher" | null>(null)

  const {
    data: studentData,
    isLoading: isStudentLoading,
    isError: isStudentError,
  } = useMyStudentProfile({ retry: false })

  const {
    data: teacherData,
    isLoading: isTeacherLoading,
    isError: isTeacherError,
  } = useMyTeacherProfile({ retry: false })

  // If user selected a specific preview view
  if (adminView === "teacher") {
    return (
      <div className="flex flex-col gap-4">
        <div className="max-w-[1400px] w-full mx-auto px-6 pt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">
            Previewing Teacher Profile View
          </span>
          <button
            type="button"
            onClick={() => setAdminView(null)}
            className="text-xs text-brand-orange hover:underline font-semibold"
          >
            Switch View
          </button>
        </div>
        <TeacherDetailPage isMe={true} />
      </div>
    )
  }

  if (adminView === "student") {
    return (
      <div className="flex flex-col gap-4">
        <div className="max-w-[1400px] w-full mx-auto px-6 pt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">
            Previewing Student Profile View
          </span>
          <button
            type="button"
            onClick={() => setAdminView(null)}
            className="text-xs text-brand-orange hover:underline font-semibold"
          >
            Switch View
          </button>
        </div>
        <StudentDetailPage isMe={true} />
      </div>
    )
  }

  if (studentData && !isStudentError) {
    return <StudentDetailPage isMe={true} />
  }

  if (teacherData && !isTeacherError) {
    return <TeacherDetailPage isMe={true} />
  }

  if (isStudentLoading || isTeacherLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner title="Loading profile..." />
      </div>
    )
  }

  // Admin fallback view
  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[75vh]">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-sm text-center flex flex-col items-center">
        <div className="size-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5 text-[#D97706] shadow-sm">
          <User className="size-8 stroke-[1.8]" />
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-zinc-100 text-zinc-700 mb-2">
          Profile Hub
        </span>

        <h2 className="text-xl font-bold text-zinc-900 mb-2">
          Administrator / Staff Profile
        </h2>

        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
          You are currently logged in with administrative privileges. Profile views are specifically formatted for Student and Teacher accounts. Choose an option below to preview or manage users:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
          <button
            type="button"
            onClick={() => setAdminView("student")}
            className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all text-left cursor-pointer group"
          >
            <div className="size-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-900 block">
                Student Profile
              </span>
              <span className="text-[11px] text-zinc-400">
                View student self profile
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAdminView("teacher")}
            className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all text-left cursor-pointer group"
          >
            <div className="size-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase className="size-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-900 block">
                Teacher Profile
              </span>
              <span className="text-[11px] text-zinc-400">
                View teacher self profile
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full">
          <Link
            href="/student/student_list"
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <span>All Students</span>
            <ArrowRight className="size-3.5 text-zinc-400" />
          </Link>
          <Link
            href="/teacher/teacher_list"
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <span>All Teachers</span>
            <ArrowRight className="size-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { roles, isLoading: isPermissionsLoading } = usePermissions()
  const user = useAuthStore((s) => s.user)

  // Determine user role
  const isTeacher = React.useMemo(() => {
    const allRoles = [...(roles || []), ...(user?.roles || [])].map((r) =>
      r.toLowerCase()
    )
    return allRoles.some((r) => r.includes("teacher"))
  }, [roles, user?.roles])

  const isStudent = React.useMemo(() => {
    const allRoles = [...(roles || []), ...(user?.roles || [])].map((r) =>
      r.toLowerCase()
    )
    return allRoles.some((r) => r.includes("student"))
  }, [roles, user?.roles])

  if (isPermissionsLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner title="Loading profile..." />
      </div>
    )
  }

  if (isTeacher) {
    return <TeacherDetailPage isMe={true} />
  }

  if (isStudent) {
    return <StudentDetailPage isMe={true} />
  }

  return <AutoDetectProfile />
}
