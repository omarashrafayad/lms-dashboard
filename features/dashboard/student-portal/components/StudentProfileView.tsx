"use client"

import * as React from "react"
import Link from "next/link"
import {
  User,
  GraduationCap,
  Users,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
  RefreshCw,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react"
import { useMyStudentProfile } from "@/features/dashboard/student/hooks/useStudents"

export function StudentProfileView() {
  const [activeTab, setActiveTab] = React.useState<
    "personal" | "academic" | "guardians" | "subscriptions"
  >("personal")

  const { data: student, isLoading, isError, refetch, isFetching } = useMyStudentProfile()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-36 rounded-3xl bg-zinc-200/70 animate-pulse" />
        <div className="p-14 rounded-3xl bg-white border border-zinc-200/80 flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-brand-orange" />
          <p className="text-xs font-semibold text-zinc-500">
            Loading your student profile...
          </p>
        </div>
      </div>
    )
  }

  if (isError || !student) {
    return (
      <div className="p-12 rounded-3xl bg-white border border-rose-200 text-center flex flex-col items-center gap-3 shadow-2xs">
        <AlertCircle className="size-10 text-rose-500" />
        <h3 className="text-base font-bold text-zinc-900">
          Failed to load student profile
        </h3>
        <p className="text-xs text-zinc-500 max-w-md">
          We could not retrieve your profile details from the server. Please try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  const profilePhoto = student.profile?.profilePhotoUrl
  const stats = student.stats
  const guardians = student.guardians || []
  const subscriptions = student.subscriptions || []
  const activeSub =
    subscriptions.find((s) => s.status?.toLowerCase() === "active") || subscriptions[0]

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—"
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Profile Hero Card */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-12 -top-12 size-56 rounded-full bg-brand-orange/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-5">
          <div className="size-20 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-brand-orange shadow-md flex items-center justify-center shrink-0">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={student.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="size-9 text-brand-orange" />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                {student.fullName || "Student Account"}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  student.isActive
                    ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
                    : "bg-rose-500/20 text-rose-200 border border-rose-400/30"
                }`}
              >
                {student.profile?.status || (student.isActive ? "Active" : "Inactive")}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300 font-medium">
              {student.educationStage && <span>{student.educationStage}</span>}
              {student.grade && (
                <>
                  <span>•</span>
                  <span>{student.grade}</span>
                </>
              )}
              {student.educationSystem && (
                <>
                  <span>•</span>
                  <span>{student.educationSystem}</span>
                </>
              )}
              {student.level && (
                <>
                  <span>•</span>
                  <span className="text-amber-300 font-bold">{student.level}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 pt-0.5">
              {student.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5 text-brand-orange" />
                  {student.email}
                </span>
              )}
              {student.phoneNumber && (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-brand-orange" />
                  {student.phoneNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          {activeSub && (
            <span className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-bold">
              ★ {activeSub.planName}
            </span>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Summary (when provided by /students/me) */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-amber-50 text-brand-orange flex items-center justify-center shrink-0">
              <Award className="size-5" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-medium block">
                Overall Progress
              </span>
              <span className="text-lg font-extrabold text-zinc-900">
                {stats.overallProgress ?? 0}%
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-medium block">
                Average Score
              </span>
              <span className="text-lg font-extrabold text-zinc-900">
                {stats.averageScore ?? 0}%
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpen className="size-5" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-medium block">
                Courses Completed
              </span>
              <span className="text-lg font-extrabold text-zinc-900">
                {stats.completedCourses ?? 0} / {stats.totalCourses ?? 0}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-medium block">
                Lessons Completed
              </span>
              <span className="text-lg font-extrabold text-zinc-900">
                {stats.completedLessons ?? 0} / {stats.totalLessons ?? 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200/70 max-w-fit">
        {[
          { key: "personal", label: "Personal Information", icon: User },
          { key: "academic", label: "Academic Profile", icon: GraduationCap },
          { key: "guardians", label: `Guardians (${guardians.length})`, icon: Users },
          {
            key: "subscriptions",
            label: `Subscriptions (${subscriptions.length})`,
            icon: CreditCard,
          },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-orange text-white shadow-2xs"
                  : "bg-zinc-800/80 text-white hover:bg-zinc-900"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs">
        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === "personal" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-zinc-900">
                Personal & Contact Details
              </h2>
              <p className="text-xs text-zinc-500">
                Verified student identity and contact records from your account
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">Full Name</span>
                <span className="text-sm font-bold text-zinc-900">
                  {student.fullName || "—"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">Email Address</span>
                <span className="text-sm font-bold text-zinc-900 truncate">
                  {student.email || "—"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">Phone Number</span>
                <span className="text-sm font-bold text-zinc-900">
                  {student.phoneNumber || "—"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">Gender</span>
                <span className="text-sm font-bold text-zinc-900 capitalize">
                  {student.gender || "—"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">Date of Birth</span>
                <span className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-brand-orange" />
                  {formatDate(student.dateOfBirth)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">Member Since</span>
                <span className="text-sm font-bold text-zinc-900">
                  {formatDate(student.createdAt)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMIC PROFILE */}
        {activeTab === "academic" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-zinc-900">
                Academic Registration Profile
              </h2>
              <p className="text-xs text-zinc-500">
                Assigned educational stage, grade level, and curriculum track
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">Student ID</span>
                <span className="text-xs font-mono font-bold text-zinc-900 truncate">
                  {student.id}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">
                  Education Stage
                </span>
                <span className="text-sm font-bold text-zinc-900">
                  {student.educationStage || "—"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">Grade Level</span>
                <span className="text-sm font-bold text-zinc-900">
                  {student.grade || "—"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">
                  Education System
                </span>
                <span className="text-sm font-bold text-zinc-900">
                  {student.educationSystem || "—"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">Level</span>
                <span className="text-sm font-bold text-brand-orange">
                  {student.level || student.profile?.level || "—"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium">
                  Account Status
                </span>
                <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="size-4" />
                  {student.profile?.status || (student.isActive ? "Active" : "Inactive")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GUARDIANS */}
        {activeTab === "guardians" && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-base font-extrabold text-zinc-900">
                Linked Parents & Guardians
              </h2>
              <p className="text-xs text-zinc-500">
                Authorized parent accounts linked to monitor academic progress
              </p>
            </div>

            {guardians.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guardians.map((g) => (
                  <div
                    key={g.id}
                    className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-4"
                  >
                    <div className="size-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-bold shrink-0">
                      <Users className="size-5" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 text-xs">
                      <span className="text-sm font-bold text-zinc-900 truncate">
                        {g.fullName}
                      </span>
                      {g.email && (
                        <span className="text-zinc-500 flex items-center gap-1.5 truncate">
                          <Mail className="size-3.5 text-zinc-400" />
                          {g.email}
                        </span>
                      )}
                      {g.phoneNumber && (
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <Phone className="size-3.5 text-zinc-400" />
                          {g.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
                No guardian accounts are currently linked to your profile.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SUBSCRIPTIONS */}
        {activeTab === "subscriptions" && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-zinc-900">
                  Subscriptions & Membership History
                </h2>
                <p className="text-xs text-zinc-500">
                  Current active plan and billing cycle status
                </p>
              </div>
              <Link
                href="/student/subscriptions"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange hover:brightness-105 text-white text-xs font-bold"
              >
                <span>Manage Plans</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {subscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col gap-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-zinc-900">
                        {sub.planName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-orange text-white">
                        {sub.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-200/60 text-zinc-600">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Tier / Cycle</span>
                        <span className="font-bold text-zinc-800">
                          {sub.tier} • {sub.billingCycle}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Days Remaining
                        </span>
                        <span className="font-bold text-zinc-800">
                          {sub.daysRemaining} Days
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Starts</span>
                        <span className="font-semibold">{formatDate(sub.startsAt)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Expires</span>
                        <span className="font-semibold">{formatDate(sub.expiresAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
                No active subscriptions recorded on your profile yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
