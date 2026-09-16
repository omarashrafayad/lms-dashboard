"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GraduationCap,
  LayoutGrid,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  TrendingUp,
  HelpCircle,
  Settings,
  ChevronRight,
  ChevronDown,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SubItem {
  label: string
  href: string
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  hasChevron?: boolean
  subItems?: SubItem[]
}

export function Sidebar() {
  const pathname = usePathname()
  const isOverviewActive = pathname === "/" || pathname === "/overview"
  const isStudentRoute = pathname.startsWith("/student")
  const isTeacherRoute = pathname.startsWith("/teacher")
  const isUsersActive = isStudentRoute || isTeacherRoute

  const [usersExpanded, setUsersExpanded] = React.useState<boolean>(true)
  const [studentsExpanded, setStudentsExpanded] = React.useState<boolean>(isStudentRoute || !isTeacherRoute)
  const [teachersExpanded, setTeachersExpanded] = React.useState<boolean>(isTeacherRoute || true)

  // React.useEffect(() => {
  //   if (isTeacherRoute) {
  //     setUsersExpanded(true)
  //     setTeachersExpanded(true)
  //   } else if (isStudentRoute) {
  //     setUsersExpanded(true)
  //     setStudentsExpanded(true)
  //   }
  // }, [pathname, isTeacherRoute, isStudentRoute])

  return (
    <aside className="w-64 min-w-[16rem] h-screen sticky top-0 flex flex-col justify-between bg-white border-r border-zinc-200/80 px-4 py-6 select-none z-30 overflow-y-auto">
      {/* Top: Brand Logo */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 rounded-xl bg-brand-orange flex items-center justify-center shadow-sm text-white shrink-0">
            <GraduationCap className="size-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-zinc-900 tracking-tight leading-tight">
              Lumina
            </span>
            <span className="text-xs text-zinc-400 font-normal">
              Learning Admin
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
            MAIN
          </div>
          <nav className="flex flex-col gap-1">
            {/* Overview */}
            <Link
              href="/"
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isOverviewActive
                  ? "bg-zinc-100/80 text-zinc-900 font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid
                  className={cn(
                    "size-[18px] transition-colors",
                    isOverviewActive
                      ? "text-zinc-900"
                      : "text-zinc-400 group-hover:text-zinc-600"
                  )}
                />
                <span>Overview</span>
              </div>
            </Link>

            {/* Users (Parent Group) */}
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setUsersExpanded(!usersExpanded)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group text-left cursor-pointer",
                  isUsersActive
                    ? "text-zinc-900 font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid
                    className={cn(
                      "size-[18px] transition-colors rotate-45",
                      isUsersActive
                        ? "text-zinc-900"
                        : "text-zinc-400 group-hover:text-zinc-600"
                    )}
                  />
                  <span>Users</span>
                </div>
                {usersExpanded ? (
                  <ChevronDown className="size-4 text-zinc-600" />
                ) : (
                  <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-500" />
                )}
              </button>

              {/* Sub-groups inside Users */}
              {usersExpanded && (
                <div className="flex flex-col gap-1 pl-4 pr-1 mt-0.5">
                  {/* Students Sub-group */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setStudentsExpanded(!studentsExpanded)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer text-left",
                        isStudentRoute
                          ? "text-zinc-900 font-semibold"
                          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                      )}
                    >
                      <span>Students</span>
                      {studentsExpanded ? (
                        <ChevronDown className="size-3.5 text-zinc-500" />
                      ) : (
                        <ChevronRight className="size-3.5 text-zinc-400" />
                      )}
                    </button>

                    {studentsExpanded && (
                      <div className="flex flex-col gap-1 pl-4 mt-0.5">
                        <Link
                          href="/student/student_list"
                          className={cn(
                            "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                            isStudentRoute &&
                              pathname !== "/student/add" &&
                              pathname !== "/student/requests"
                              ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                          )}
                        >
                          All Students
                        </Link>
                        <Link
                          href="/student/add"
                          className={cn(
                            "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                            pathname === "/student/add"
                              ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                          )}
                        >
                          Add Student
                        </Link>
                        <Link
                          href="/student/requests"
                          className={cn(
                            "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                            pathname === "/student/requests"
                              ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                          )}
                        >
                          Student Requests
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Teachers Sub-group */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setTeachersExpanded(!teachersExpanded)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer text-left",
                        isTeacherRoute
                          ? "text-zinc-900 font-semibold"
                          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                      )}
                    >
                      <span>Teachers</span>
                      {teachersExpanded ? (
                        <ChevronDown className="size-3.5 text-zinc-500" />
                      ) : (
                        <ChevronRight className="size-3.5 text-zinc-400" />
                      )}
                    </button>

                    {teachersExpanded && (
                      <div className="flex flex-col gap-1 pl-4 mt-0.5">
                        <Link
                          href="/teacher/teacher_list"
                          className={cn(
                            "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                            isTeacherRoute && pathname !== "/teacher/add"
                              ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                          )}
                        >
                          All Teachers
                        </Link>
                        <Link
                          href="/teacher/add"
                          className={cn(
                            "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                            pathname === "/teacher/add"
                              ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                          )}
                        >
                          Add Teacher
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Parents Sub-group */}
                  <Link
                    href="/parents"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all"
                  >
                    <span>Parents</span>
                    <ChevronRight className="size-3.5 text-zinc-400" />
                  </Link>
                </div>
              )}
            </div>

            {/* Academic Management */}
            <Link
              href="/academic"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="size-[18px] text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                <span>Academic Management</span>
              </div>
              <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-500" />
            </Link>

            {/* Sessions & Bookings */}
            <Link
              href="/sessions"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Calendar className="size-[18px] text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                <span>Sessions & Bookings</span>
              </div>
              <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-500" />
            </Link>

            {/* Subscriptions & Payments */}
            <Link
              href="/subscriptions"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="size-[18px] text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                <span>Subscriptions & Payments</span>
              </div>
              <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-500" />
            </Link>

            {/* Content */}
            <Link
              href="/content"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileText className="size-[18px] text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                <span>Content</span>
              </div>
            </Link>

            {/* Analytics */}
            <Link
              href="/analytics"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="size-[18px] text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                <span>Analytics</span>
              </div>
            </Link>

            {/* Support */}
            <Link
              href="/support"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="size-[18px] text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                <span>Support</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom: Settings & User Profile Card */}
      <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
        >
          <Settings className="size-[18px] text-zinc-400" />
          <span>Settings</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs flex items-center justify-center shrink-0">
              SA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-900 truncate">
                Sara Adel
              </span>
              <span className="text-[11px] text-zinc-400 truncate">
                Administrator
              </span>
            </div>
          </div>
          <button
            type="button"
            title="Log Out"
            className="text-zinc-400 hover:text-zinc-700 transition-colors p-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
