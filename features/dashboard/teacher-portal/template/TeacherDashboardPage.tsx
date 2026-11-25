"use client"

import * as React from "react"
import Link from "next/link"
import { Calendar, Plus, FileCheck2 } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { TeacherWelcomeBanner } from "../components/TeacherWelcomeBanner"
import { TeacherStatCards } from "../components/TeacherStatCards"
import { TeacherTodaySchedule } from "../components/TeacherTodaySchedule"
import { TeacherCoursesOverview } from "../components/TeacherCoursesOverview"
import { TeacherPendingTasks } from "../components/TeacherPendingTasks"
import { TeacherStudentPerformanceOverview } from "../components/TeacherStudentPerformanceOverview"
import { TeacherRecentActivities } from "../components/TeacherRecentActivities"

export default function TeacherDashboardPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Top Header */}
      <PageHeader
        title="Instructor Workspace"
        description="Manage assigned courses, educational modules, live webinars, student cohorts, and grading workflows."
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/teacher/sessions"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-2xs transition-all"
            >
              <Calendar className="size-3.5 text-zinc-500" />
              <span>Schedule Session</span>
            </Link>
            <Link
              href="/teacher/exams"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold shadow-sm shadow-brand-orange/20 transition-all cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Create Exam</span>
            </Link>
          </div>
        }
      />

      {/* Main Content Area */}
      <main className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl w-full mx-auto">
        {/* Welcome Section with Faculty Profile & Actions */}
        <section aria-label="Teacher Welcome">
          <TeacherWelcomeBanner />
        </section>

        {/* 6 Key Performance Statistics */}
        <section aria-label="Academic Management KPIs">
          <TeacherStatCards />
        </section>

        {/* Today's Teaching Schedule & Priority Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section aria-label="Today's Teaching Sessions">
            <TeacherTodaySchedule />
          </section>

          <section aria-label="Pending Grading Tasks">
            <TeacherPendingTasks />
          </section>
        </div>

        {/* Assigned Courses Overview */}
        <section aria-label="My Assigned Courses">
          <TeacherCoursesOverview />
        </section>

        {/* Cohort Performance Overview */}
        <section aria-label="Student Academic Analytics">
          <TeacherStudentPerformanceOverview />
        </section>

        {/* Recent Educational Activities */}
        <section aria-label="Live Activities Feed">
          <TeacherRecentActivities />
        </section>
      </main>
    </div>
  )
}

export { TeacherDashboardPage }

