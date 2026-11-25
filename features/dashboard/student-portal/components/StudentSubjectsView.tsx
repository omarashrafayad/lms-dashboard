"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  Search,
  BookOpen,
  Layers,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  School,
  RefreshCw,
} from "lucide-react"
import { useStudentSubjects } from "../hooks/useStudentPortal"
import { StudentSubjectItem } from "../types/studentApi.types"

export function StudentSubjectsView() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const pageSize = 8

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const { data, isLoading, isError, refetch, isFetching } = useStudentSubjects({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  })

  const subjects = data?.items || []
  const totalCount = data?.totalCount ?? subjects.length
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize))

  const getSubjectIconPalette = (name: string) => {
    const lower = (name || "").toLowerCase()
    if (lower.includes("physic")) return "bg-blue-600 text-white"
    if (lower.includes("chem")) return "bg-emerald-600 text-white"
    if (lower.includes("math")) return "bg-indigo-600 text-white"
    if (lower.includes("bio")) return "bg-teal-600 text-white"
    if (lower.includes("arab")) return "bg-amber-600 text-white"
    return "bg-brand-orange text-white"
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
              <GraduationCap className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              My Academic Subjects
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/60">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Select a subject to explore chapters, units, video lessons, materials, and quizzes
          </p>
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by subject name..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40"
            />
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white transition-all shadow-2xs cursor-pointer"
            title="Refresh subjects"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs animate-pulse flex flex-col gap-4"
            >
              <div className="size-12 rounded-2xl bg-zinc-200" />
              <div className="h-5 w-3/4 rounded bg-zinc-200" />
              <div className="h-3 w-1/2 rounded bg-zinc-100" />
              <div className="h-9 rounded-xl bg-zinc-100 mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="p-8 text-center bg-white rounded-3xl border border-rose-200 shadow-2xs flex flex-col items-center gap-3">
          <div className="size-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            !
          </div>
          <h3 className="text-base font-bold text-zinc-900">Failed to load subjects</h3>
          <p className="text-xs text-zinc-500 max-w-md">
            We encountered an issue fetching your subjects. Please verify your connection or try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-brand-orange text-white font-bold text-xs hover:brightness-105 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Subjects Grid */}
      {!isLoading && !isError && subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {subjects.map((subj: StudentSubjectItem) => {
            const iconBg = getSubjectIconPalette(subj.name)
            return (
              <div
                key={subj.id}
                onClick={() => router.push(`/student/subjects/${subj.id}`)}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-zinc-200/80 hover:border-brand-orange hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-orange to-amber-500 opacity-85 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`size-12 rounded-2xl flex items-center justify-center shadow-xs ${iconBg}`}
                    >
                      <BookOpen className="size-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200/60">
                      {subj.term || "Full Year"}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                      {subj.name}
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                      {subj.educationStageName || "Academic Stage"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-3 border-t border-zinc-100 text-xs">
                    <div className="flex items-center justify-between text-zinc-600">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <School className="size-3.5" />
                        Grade
                      </span>
                      <span className="font-semibold text-zinc-800">
                        {subj.gradeName || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-600">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <Layers className="size-3.5" />
                        System
                      </span>
                      <span className="font-semibold text-zinc-800 line-clamp-1 max-w-[140px] text-right">
                        {subj.educationSystemName || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-5 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/student/subjects/${subj.id}`)
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs transition-all duration-150 cursor-pointer"
                  >
                    <span>Explore Subject</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && subjects.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200/80 shadow-2xs flex flex-col items-center gap-4">
          <div className="size-16 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center">
            <GraduationCap className="size-8" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-zinc-900">No subjects found</h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              {searchTerm
                ? `No academic subjects match your search "${searchTerm}".`
                : "No subjects are currently assigned to your account."}
            </p>
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 rounded-xl bg-brand-orange text-white font-bold text-xs hover:brightness-105 cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <p className="text-xs text-zinc-500 font-medium">
            Showing Page <span className="font-bold text-zinc-900">{page}</span> of{" "}
            <span className="font-bold text-zinc-900">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
