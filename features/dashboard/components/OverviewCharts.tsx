"use client"

import * as React from "react"
import { BarChart3, PieChart, ArrowUpRight } from "lucide-react"

interface DailyActivity {
  day: string
  completed: number
  scheduled: number
  percentage: number
}

const weeklyData: DailyActivity[] = [
  { day: "Mon", completed: 38, scheduled: 42, percentage: 90 },
  { day: "Tue", completed: 44, scheduled: 45, percentage: 97 },
  { day: "Wed", completed: 36, scheduled: 40, percentage: 90 },
  { day: "Thu", completed: 48, scheduled: 50, percentage: 96 },
  { day: "Fri", completed: 25, scheduled: 30, percentage: 83 },
  { day: "Sat", completed: 52, scheduled: 55, percentage: 94 },
  { day: "Sun", completed: 46, scheduled: 48, percentage: 95 },
]

const systemDistribution = [
  {
    name: "National Curriculum",
    count: 1176,
    percentage: 48,
    color: "bg-amber-400",
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    name: "American Diploma",
    count: 784,
    percentage: 32,
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "IGCSE / British",
    count: 490,
    percentage: 20,
    color: "bg-purple-500",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

export function OverviewCharts() {
  const [activeDay, setActiveDay] = React.useState<string>("Thu")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Weekly Activity Bar Chart Card (2 Columns) */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-brand-orange" />
              <h2 className="text-base font-semibold text-zinc-900">
                Weekly Session Activity
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Completed vs scheduled live classes this week
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-brand-orange" />
              <span className="text-zinc-600 font-medium">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-zinc-200" />
              <span className="text-zinc-400">Scheduled</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-6 pb-2">
          <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 px-2">
            {weeklyData.map((item) => {
              const maxSession = 55
              const completedHeight = Math.round((item.completed / maxSession) * 100)
              const isSelected = activeDay === item.day

              return (
                <div
                  key={item.day}
                  onClick={() => setActiveDay(item.day)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  {/* Tooltip / Value on hover or selected */}
                  <div
                    className={`text-[11px] font-semibold transition-opacity duration-200 ${
                      isSelected
                        ? "opacity-100 text-brand-orange font-bold"
                        : "opacity-0 group-hover:opacity-100 text-zinc-600"
                    }`}
                  >
                    {item.completed}
                  </div>

                  {/* Bar container */}
                  <div className="w-full max-w-[36px] h-36 bg-zinc-100/80 rounded-xl relative overflow-hidden flex items-end">
                    <div
                      style={{ height: `${completedHeight}%` }}
                      className={`w-full rounded-xl transition-all duration-300 ${
                        isSelected
                          ? "bg-brand-orange shadow-xs"
                          : "bg-amber-300 group-hover:bg-brand-orange/80"
                      }`}
                    />
                  </div>

                  {/* Day label */}
                  <span
                    className={`text-xs transition-colors ${
                      isSelected
                        ? "font-bold text-zinc-900"
                        : "font-medium text-zinc-400 group-hover:text-zinc-700"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chart Footer Stats */}
        <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-zinc-900">289</span>
            <span>Total sessions completed this week</span>
          </div>
          <span className="text-brand-green font-medium flex items-center gap-0.5">
            <ArrowUpRight className="size-3.5" /> 93.8% Attendance Rate
          </span>
        </div>
      </div>

      {/* System Distribution Card (1 Column) */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-5 border-b border-zinc-100">
            <PieChart className="size-4 text-purple-600" />
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Curriculum Systems
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Distribution across student enrollments
              </p>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex flex-col gap-4 mt-6">
            {systemDistribution.map((sys) => (
              <div key={sys.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-800">{sys.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-normal">
                      {sys.count.toLocaleString()} students
                    </span>
                    <span className="font-bold text-zinc-900">
                      {sys.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${sys.color}`}
                    style={{ width: `${sys.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Pill Box */}
        <div className="mt-6 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-100 flex items-center justify-between text-xs">
          <span className="text-zinc-500">Total Enrolled Capacity</span>
          <span className="font-bold text-zinc-900">2,450 / 3,000</span>
        </div>
      </div>
    </div>
  )
}
