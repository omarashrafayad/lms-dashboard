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

// interface SubItem {
//   label: string
//   href: string
// }

// interface NavItem {
//   label: string
//   href: string
//   icon: React.ComponentType<{ className?: string }>
//   hasChevron?: boolean
//   subItems?: SubItem[]
// }

export function Sidebar() {
  const pathname = usePathname()
  const isOverviewActive = pathname === "/" || pathname === "/overview"
  const isStudentRoute = pathname.startsWith("/student")
  const isTeacherRoute = pathname.startsWith("/teacher")
  const isParentRoute = pathname.startsWith("/parent") || pathname.startsWith("/parents")
  const isUsersActive = isStudentRoute || isTeacherRoute || isParentRoute
  const isCurriculumRoute = pathname.startsWith("/curriculum")
  const isLessonsRoute = pathname.startsWith("/lessons") || pathname.startsWith("/academic/lessons")
  const isAcademicActive = isCurriculumRoute || pathname.startsWith("/academic") || isLessonsRoute

  const [usersExpanded, setUsersExpanded] = React.useState<boolean>(isUsersActive)
  const [studentsExpanded, setStudentsExpanded] = React.useState<boolean>(isStudentRoute || false)
  const [teachersExpanded, setTeachersExpanded] = React.useState<boolean>(isTeacherRoute || false)
  const [parentsExpanded, setParentsExpanded] = React.useState<boolean>(isParentRoute || true)
  const [academicExpanded, setAcademicExpanded] = React.useState<boolean>(isAcademicActive || true)


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
              Scholar
            </span>
            <span className="text-xs text-zinc-400 font-normal">
              Admin Console
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
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setParentsExpanded(!parentsExpanded)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer text-left",
                        isParentRoute
                          ? "text-zinc-900 font-semibold"
                          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                      )}
                    >
                      <span>Parents</span>
                      {parentsExpanded ? (
                        <ChevronDown className="size-3.5 text-zinc-500" />
                      ) : (
                        <ChevronRight className="size-3.5 text-zinc-400" />
                      )}
                    </button>

                    {parentsExpanded && (
                      <div className="flex flex-col gap-1 pl-4 mt-0.5">
                        <Link
                          href="/parent/parent_list"
                          className={cn(
                            "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                            isParentRoute && pathname !== "/parent/add"
                              ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                          )}
                        >
                          All Parents
                        </Link>
                        <Link
                          href="/parent/add"
                          className={cn(
                            "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                            pathname === "/parent/add"
                              ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                          )}
                        >
                          Add Parent
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Academic Management */}
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setAcademicExpanded(!academicExpanded)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group text-left cursor-pointer",
                  isAcademicActive
                    ? "text-zinc-900 font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap
                    className={cn(
                      "size-[18px] transition-colors",
                      isAcademicActive
                        ? "text-zinc-900"
                        : "text-zinc-400 group-hover:text-zinc-600"
                    )}
                  />
                  <span>Academic Management</span>
                </div>
                {academicExpanded ? (
                  <ChevronDown className="size-4 text-zinc-600" />
                ) : (
                  <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-500" />
                )}
              </button>

              {academicExpanded && (
                <div className="flex flex-col gap-1 pl-4 pr-1 mt-0.5">
                  <Link
                    href="/curriculum"
                    className={cn(
                      "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                      isCurriculumRoute
                        ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    Subjects
                  </Link>
                  <Link
                    href="/academic/courses"
                    className={cn(
                      "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                      pathname.startsWith("/academic/courses")
                        ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    Courses
                  </Link>
                  <Link
                    href="/lessons"
                    className={cn(
                      "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                      isLessonsRoute
                        ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    Lessons
                  </Link>
                  <Link
                    href="/academic/exams"
                    className={cn(
                      "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                      pathname.startsWith("/academic/exams")
                        ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    Exams
                  </Link>
                </div>
              )}
            </div>

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
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="relative size-8 rounded-full overflow-hidden shrink-0 border border-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Nadia Farouk"
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-zinc-900 truncate">
              Nadia Farouk
            </span>
            <span className="text-[11px] text-zinc-400 truncate">
              Administrator
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => alert("Logout")}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer text-left"
        >
          <LogOut className="size-[18px] text-zinc-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
