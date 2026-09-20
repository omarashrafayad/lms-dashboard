"use client"

import * as React from "react"
import Link from "next/link"
import { PageHeader } from "@/components/layout/PageHeader"
import { OverviewStats } from "../components/OverviewStats"
import { OverviewCharts } from "../components/OverviewCharts"
import { OverviewQuickActions } from "../components/OverviewQuickActions"
import { OverviewRecentLists } from "../components/OverviewRecentLists"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Top Header */}
      <PageHeader
        title="Dashboard Overview"
        description="Welcome back! Here is your school's daily activity, student enrollment, and teacher operations."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="hidden sm:flex items-center gap-2 rounded-xl h-10 px-3.5 border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium cursor-pointer shadow-2xs"
            >
              <Download className="size-3.5 text-zinc-400" />
              <span>Export Report</span>
            </Button>
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
        {/* Metric KPI Cards */}
        <section aria-label="Key Performance Indicators">
          <OverviewStats />
        </section>

        {/* Quick Shortcuts */}
        <section aria-label="Quick Actions">
          <OverviewQuickActions />
        </section>

        {/* Charts & Distribution */}
        <section aria-label="Analytics & Curriculum Distribution">
          <OverviewCharts />
        </section>

        {/* Recent Students & Teachers Highlights */}
        <section aria-label="Recent Students and Teachers">
          <OverviewRecentLists />
        </section>
      </main>
    </div>
  )
}
