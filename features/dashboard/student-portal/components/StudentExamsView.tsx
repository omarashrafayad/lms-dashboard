"use client"

import * as React from "react"
import {
  FileCheck2,
  Clock,
  Search,
  HelpCircle,
  Award,
  Play,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  Eye,
} from "lucide-react"
import { useStudentExams } from "../hooks/useStudentPortal"
import { StudentExamItem, StudentExamResultResponse } from "../types/studentApi.types"
import { StudentExamTakerModal } from "./StudentExamTakerModal"
import { StudentExamResultModal } from "./StudentExamResultModal"

export function StudentExamsView() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [page, setPage] = React.useState(1)
  const pageSize = 6

  const [selectedExamId, setSelectedExamId] = React.useState<string | null>(null)
  const [isTakerOpen, setIsTakerOpen] = React.useState(false)
  const [isResultOpen, setIsResultOpen] = React.useState(false)
  const [latestResult, setLatestResult] = React.useState<StudentExamResultResponse | null>(
    null
  )

  const { data, isLoading, isError, refetch, isFetching } = useStudentExams({
    page,
    pageSize,
  })

  const rawExams = data?.items || []
  const totalCount = data?.totalCount ?? rawExams.length
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize))

  const filteredExams = React.useMemo(() => {
    return rawExams.filter((ex) => {
      const matchSearch =
        !searchTerm ||
        ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.subjects?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
      if (!matchSearch) return false

      const st = (ex.status || "").toLowerCase()
      if (activeTab === "available") return st.includes("available") || st.includes("open")
      if (activeTab === "completed")
        return st.includes("submitted") || st.includes("completed") || st.includes("passed")
      return true
    })
  }, [rawExams, searchTerm, activeTab])

  const handleStartExam = (examId: string) => {
    setSelectedExamId(examId)
    setLatestResult(null)
    setIsTakerOpen(true)
  }

  const handleViewResult = (examId: string) => {
    setSelectedExamId(examId)
    setLatestResult(null)
    setIsResultOpen(true)
  }

  const handleSubmitExamSuccess = (
    examId: string,
    result?: StudentExamResultResponse
  ) => {
    setIsTakerOpen(false)
    setSelectedExamId(examId)
    if (result) setLatestResult(result)
    setIsResultOpen(true)
  }

  const formatExamDate = (isoStr: string) => {
    if (!isoStr) return "—"
    try {
      return new Date(isoStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Scheduled"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
              <FileCheck2 className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              Assessment Center & Examinations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/60">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Term midterms, evaluations, and instant automated score reports
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exams or subject..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40"
            />
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-white transition-all shadow-2xs cursor-pointer"
            title="Refresh exams"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200/70 max-w-fit">
        {[
          { key: "all", label: "All Assessments", count: rawExams.length },
          {
            key: "available",
            label: "Available Now",
            count: rawExams.filter((e) => {
              const s = (e.status || "").toLowerCase()
              return s.includes("available") || s.includes("open")
            }).length,
          },
          {
            key: "completed",
            label: "Completed & Graded",
            count: rawExams.filter((e) => {
              const s = (e.status || "").toLowerCase()
              return s.includes("submitted") || s.includes("completed") || s.includes("passed")
            }).length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-brand-orange text-white shadow-2xs"
                : "bg-zinc-800/80 text-white hover:bg-zinc-900"
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs animate-pulse flex flex-col gap-4"
            >
              <div className="h-5 w-1/3 bg-zinc-200 rounded" />
              <div className="h-6 w-3/4 bg-zinc-200 rounded" />
              <div className="h-20 bg-zinc-100 rounded-2xl" />
              <div className="h-10 bg-zinc-100 rounded-xl mt-2" />
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
          <h3 className="text-base font-bold text-zinc-900">Failed to load examinations</h3>
          <p className="text-xs text-zinc-500 max-w-md">
            We were unable to load your assessments. Please verify your connection or try again.
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

      {/* Exams Grid */}
      {!isLoading && !isError && filteredExams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam: StudentExamItem) => {
            const st = (exam.status || "").toLowerCase()
            const isCompleted =
              st.includes("submitted") || st.includes("completed") || st.includes("passed")
            const isAvailable = st.includes("available") || st.includes("open")

            return (
              <div
                key={exam.id}
                className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-lg hover:border-brand-orange/80 transition-all gap-5"
              >
                <div className="flex flex-col gap-3.5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200/60">
                      {exam.examType || "Assessment"}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isAvailable
                          ? "bg-brand-orange text-white"
                          : "bg-zinc-200 text-zinc-700"
                        }`}
                    >
                      {exam.status || "Scheduled"}
                    </span>
                  </div>

                  {/* Title & Level */}
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-base text-zinc-900 leading-snug line-clamp-2">
                      {exam.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="truncate">
                        {exam.subjects?.join(", ") || "Curriculum"}
                      </span>
                      <span>•</span>
                      <span className="shrink-0">{exam.level || "Academic"}</span>
                    </div>
                  </div>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-center">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-medium">
                        Duration
                      </span>
                      <span className="font-bold text-zinc-800 flex items-center justify-center gap-1 mt-0.5">
                        <Clock className="size-3 text-brand-orange" />
                        {exam.durationMinutes}m
                      </span>
                    </div>

                    <div className="border-x border-zinc-200/60">
                      <span className="text-[10px] text-zinc-400 block font-medium">
                        Questions
                      </span>
                      <span className="font-bold text-zinc-800 flex items-center justify-center gap-1 mt-0.5">
                        <HelpCircle className="size-3 text-brand-orange" />
                        {exam.questionCount} Qs
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-400 block font-medium">
                        Total Marks
                      </span>
                      <span className="font-bold text-zinc-800 flex items-center justify-center gap-1 mt-0.5">
                        <Award className="size-3 text-brand-orange" />
                        {exam.totalPoints} pts
                      </span>
                    </div>
                  </div>

                  {/* Availability Window */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Calendar className="size-3.5" />
                      Window:
                    </span>
                    <span className="font-semibold text-zinc-700">
                      {formatExamDate(exam.availableFrom)} - {formatExamDate(exam.availableTo)}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
                  {isCompleted ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleViewResult(exam.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        <Eye className="size-4" />
                        <span>View Result</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartExam(exam.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        <Play className="size-3.5 fill-current" />
                        <span>Open Exam</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartExam(exam.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs shadow-brand-orange/25 transition-all cursor-pointer"
                    >
                      <Play className="size-3.5 fill-current" />
                      <span>{isAvailable ? "Take Assessment Now" : "Open Assessment"}</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredExams.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-zinc-200/80 text-center flex flex-col items-center justify-center gap-3">
          <div className="size-16 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center">
            <FileCheck2 className="size-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">No assessments found</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            {searchTerm
              ? `No assessments match "${searchTerm}".`
              : "No exams or quizzes are currently scheduled for your enrolled grade."}
          </p>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 rounded-xl bg-brand-orange text-white font-bold text-xs hover:brightness-105 cursor-pointer mt-1"
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

      {/* Exam Taker Modal */}
      <StudentExamTakerModal
        examId={selectedExamId}
        isOpen={isTakerOpen}
        onClose={() => setIsTakerOpen(false)}
        onSubmitExam={handleSubmitExamSuccess}
        onViewResult={(id) => {
          setIsTakerOpen(false)
          handleViewResult(id)
        }}
      />

      {/* Real Exam Result Modal */}
      <StudentExamResultModal
        examId={selectedExamId}
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        initialResult={latestResult}
      />
    </div>
  )
}
