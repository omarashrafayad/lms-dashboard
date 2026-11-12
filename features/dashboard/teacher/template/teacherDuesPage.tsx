"use client"

import * as React from "react"
import Link from "next/link"
import {
  DollarSign,
  Percent,
  Clock,
  Users,
  Calendar,
  ExternalLink,
  RotateCcw,
  Search,
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { useAllTeachersDues } from "../hooks/useTeachers"
import { TeacherDuesItem } from "../types/teacher.types"

export function TeacherDuesPage() {
  const [fromDate, setFromDate] = React.useState("")
  const [toDate, setToDate] = React.useState("")
  const [search, setSearch] = React.useState("")

  const {
    data: duesReport,
    isLoading,
    isError,
    refetch,
  } = useAllTeachersDues({
    from: fromDate ? new Date(fromDate).toISOString() : undefined,
    to: toDate ? new Date(toDate).toISOString() : undefined,
  })

  const totals = duesReport?.totals
  const allItems = React.useMemo(() => duesReport?.items || [], [duesReport])

  const filteredItems = React.useMemo(() => {
    if (!search.trim()) return allItems
    const q = search.toLowerCase()
    return allItems.filter(
      (item) =>
        item.teacherName?.toLowerCase().includes(q) ||
        item.teacherId?.toLowerCase().includes(q)
    )
  }, [allItems, search])

  const columns = React.useMemo<UniTableColumn<TeacherDuesItem>[]>(
    () => [
      {
        id: "teacherName",
        header: "Teacher Name",
        cell: (_val, item: TeacherDuesItem) => (
          <div className="flex flex-col">
            <Link
              href={`/teacher/${item.teacherId}`}
              className="text-xs font-bold text-zinc-900 hover:text-amber-600 transition-colors flex items-center gap-1.5"
            >
              <span>{item.teacherName || "Unnamed Teacher"}</span>
              <ExternalLink className="size-3 text-zinc-400" />
            </Link>
            <span className="text-[11px] text-zinc-400 font-mono">
              {item.teacherId}
            </span>
          </div>
        ),
      },
      {
        id: "costPerHour",
        header: "Hourly Rate",
        cell: (_val, item: TeacherDuesItem) => (
          <span className="text-xs font-semibold text-zinc-800">
            ${item.costPerHour ?? 0}/hr
          </span>
        ),
      },
      {
        id: "applicationPercentage",
        header: "Platform Comm.",
        cell: (_val, item: TeacherDuesItem) => (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block w-fit">
              {item.applicationPercentage}%
            </span>
            {item.applicationPercentageSource && (
              <span className="text-[10px] text-zinc-400 mt-0.5">
                {item.applicationPercentageSource}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "deliveredSessions",
        header: "Delivered",
        cell: (_val, item: TeacherDuesItem) => (
          <div className="flex flex-col text-xs text-zinc-700">
            <span className="font-semibold">{item.deliveredSessions} sessions</span>
            <span className="text-[11px] text-zinc-400">
              {item.deliveredHours} hrs ({item.deliveredMinutes} mins)
            </span>
          </div>
        ),
      },
      {
        id: "grossAmount",
        header: "Gross Amount",
        cell: (_val, item: TeacherDuesItem) => (
          <span className="text-xs font-bold text-zinc-900">
            ${Number(item.grossAmount ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        id: "commissionAmount",
        header: "Commission Deducted",
        cell: (_val, item: TeacherDuesItem) => (
          <span className="text-xs font-bold text-amber-600">
            ${Number(item.commissionAmount ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        id: "netAmount",
        header: "Net Payable Dues",
        cell: (_val, item: TeacherDuesItem) => (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 inline-block">
            ${Number(item.netAmount ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
    ],
    []
  )

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Teachers Dues & Settlements (مستحقات المدرسين)"
        description="Review financial performance, platform commission deductions, and net dues across all instructors."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20">
        {/* Date Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teacher by name or ID..."
              className="w-full h-9 pl-9 pr-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-9 px-3 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-9 px-3 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            {(fromDate || toDate || search) && (
              <button
                type="button"
                onClick={() => {
                  setFromDate("")
                  setToDate("")
                  setSearch("")
                }}
                className="h-9 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-600 hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Aggregate KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <DollarSign className="size-4" />
            </div>
            <span className="text-2xl font-bold text-emerald-700 block">
              ${Number(totals?.netAmount ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              Total Net Payable Dues (صافي المستحقات)
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="size-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <DollarSign className="size-4" />
            </div>
            <span className="text-2xl font-bold text-zinc-900 block">
              ${Number(totals?.grossAmount ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              Total Gross Revenue (إجمالي الأرباح)
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="size-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center mb-3">
              <Percent className="size-4" />
            </div>
            <span className="text-2xl font-bold text-amber-600 block">
              ${Number(totals?.commissionAmount ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              Total Platform Commission (عمولة المنصة)
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="size-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <Users className="size-4" />
            </div>
            <span className="text-2xl font-bold text-zinc-900 block">
              {totals?.teachers ?? 0}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              Active Instructors ({totals?.deliveredSessions ?? 0} sessions, {totals?.deliveredMinutes ?? 0} mins)
            </span>
          </div>
        </div>

        {/* Teachers Dues UniTable */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-12">
            <LoadingSpinner title="Loading teacher dues report..." />
          </div>
        ) : isError ? (
          <GlobalError />
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Teachers Settlement Register
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Showing {filteredItems.length} teacher settlement records.
                </p>
              </div>
            </div>

            <UniTable<TeacherDuesItem>
              data={filteredItems}
              columns={columns}
              emptyMessage={
                <div className="p-12 text-center text-xs text-zinc-400">
                  No teacher dues records found for the selected period.
                </div>
              }
            />
          </div>
        )}
      </main>
    </div>
  )
}
