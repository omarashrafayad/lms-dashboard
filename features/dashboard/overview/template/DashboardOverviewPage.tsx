"use client"

import * as React from "react"
import Link from "next/link"
import { PageHeader } from "@/components/layout/PageHeader"
import { OverviewStats } from "../components/OverviewStats"
import { OverviewCharts } from "../components/OverviewCharts"
import { OverviewQuickActions } from "../components/OverviewQuickActions"
import { OverviewRecentLists } from "../components/OverviewRecentLists"
import { useDashboardOverview } from "../hooks/useOverview"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function DashboardOverviewPage() {
  const {
    data: overviewData,
    isLoading,
    isError,
  } = useDashboardOverview({
    recentStudentsLimit: 5,
    recentTeachersLimit: 5,
  })

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Header */}
      <PageHeader
        title="Dashboard Overview"
        description="Welcome back! Here is your school's daily activity, student enrollment, and teacher operations."
        actions={
          <div className="flex items-center gap-2.5">
            <Link href="/student/add">
              <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-medium rounded-xl h-10 px-4 gap-2 text-xs shadow-2xs cursor-pointer transition-all hover:brightness-95">
                <Plus className="size-4 stroke-[2.5]" />
                <span>Add Student</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Main Content Area */}
      <main className="p-6 md:p-8 flex flex-col gap-7 max-w-7xl w-full">
        {isLoading ? (
          <LoadingSpinner title="loading dashboard overview" />
        ) : isError ? (
          <GlobalError />
        ) : (
          <>
            {/* Metric KPI Cards */}
            <section aria-label="Key Performance Indicators">
              <OverviewStats data={overviewData} />
            </section>

            {/* Quick Shortcuts */}
            <section aria-label="Quick Actions">
              <OverviewQuickActions />
            </section>

            {/* Charts & Distribution */}
            <section aria-label="Analytics & Curriculum Distribution">
              <OverviewCharts
                educationSystems={overviewData?.educationSystems}
                totalStudents={overviewData?.totalStudents}
              />
            </section>

            {/* Recent Students & Teachers Highlights */}
            <section aria-label="Recent Students and Teachers">
              <OverviewRecentLists
                recentStudents={overviewData?.recentStudents}
                activeTeachers={overviewData?.activeTeacherList}
              />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
