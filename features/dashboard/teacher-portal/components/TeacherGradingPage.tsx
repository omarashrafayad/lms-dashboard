"use client"

import React, { useState } from "react"
import {
  FileCheck,
  Search,
  Filter,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Users,
  ChevronRight,
  FileText,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { TeacherSubmission } from "../types/teacherPortal.types"
import { MOCK_TEACHER_SUBMISSIONS } from "../data/mockTeacherData"
import { TeacherGradingModal } from "./TeacherGradingModal"

export function TeacherGradingPage() {
  const [submissions, setSubmissions] = useState<TeacherSubmission[]>(MOCK_TEACHER_SUBMISSIONS)
  const [activeTab, setActiveTab] = useState<"all" | "exam" | "assignment">("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedSubmission, setSelectedSubmission] = useState<TeacherSubmission | null>(null)
  const [recentlyGradedId, setRecentlyGradedId] = useState<string | null>(null)

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesTab = activeTab === "all" || sub.assessmentType === activeTab
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.assessmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter

    return matchesTab && matchesSearch && matchesStatus
  })

  const handleGradeSubmitted = (id: string, grade: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              grade,
              teacherFeedback: feedback,
              status: "graded",
              waitingTime: "Just now",
            }
          : sub
      )
    )
    setRecentlyGradedId(id)
    setTimeout(() => setRecentlyGradedId(null), 4000)
  }

  const pendingExamsCount = submissions.filter(
    (s) => s.assessmentType === "exam" && s.status !== "graded"
  ).length
  const pendingAssignmentsCount = submissions.filter(
    (s) => s.assessmentType === "assignment" && s.status !== "graded"
  ).length

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700">Grading Queue Status</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
            {pendingExamsCount + pendingAssignmentsCount} Submissions Pending
          </span>
        </div>
        <span className="text-xs text-zinc-400 font-medium">Real-time Review</span>
      </div>

      {recentlyGradedId && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Grade and feedback successfully published to student portal!</span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Pending Queue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {pendingExamsCount + pendingAssignmentsCount}
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Awaiting teacher review</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Exams to Grade</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{pendingExamsCount}</div>
          <span className="text-xs text-muted-foreground mt-1 block">Midterm essay questions</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Assignments Waiting</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{pendingAssignmentsCount}</div>
          <span className="text-xs text-muted-foreground mt-1 block">Homework & problem sets</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Avg Review Speed</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">1.8 hrs</div>
          <span className="text-xs text-muted-foreground mt-1 block">Quick turnaround SLA</span>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-card p-4 rounded-2xl border border-border">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-accent/40 text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            All Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab("exam")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "exam"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-accent/40 text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            Exams ({submissions.filter((s) => s.assessmentType === "exam").length})
          </button>
          <button
            onClick={() => setActiveTab("assignment")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "assignment"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-accent/40 text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            Assignments ({submissions.filter((s) => s.assessmentType === "assignment").length})
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or assessment..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-border bg-background px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Needs Grading</option>
            <option value="graded">Graded</option>
            <option value="revision_requested">Revision Requested</option>
          </select>
        </div>
      </div>

      {/* Submissions Queue Table */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-accent/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Assessment Title</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Submitted At</th>
                <th className="py-3.5 px-4 text-center">Waiting Time</th>
                <th className="py-3.5 px-4 text-center">Score / Grade</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-accent/20 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        {sub.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{sub.studentName}</p>
                        <p className="text-[10px] text-muted-foreground">{sub.studentId}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          sub.assessmentType === "exam"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {sub.assessmentType}
                      </span>
                    </div>
                    <p className="font-semibold text-foreground text-xs line-clamp-1">
                      {sub.assessmentTitle}
                    </p>
                  </td>

                  <td className="py-4 px-4 text-muted-foreground font-medium">
                    {sub.course}
                  </td>

                  <td className="py-4 px-4 text-muted-foreground">
                    {sub.submittedAt}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        sub.status === "graded"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {sub.waitingTime}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-foreground">
                    {sub.grade !== undefined ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {sub.grade} / {sub.totalMarks}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">-- / {sub.totalMarks}</span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      {sub.status === "graded" ? "Review / Edit" : "Grade Now"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
            <p className="font-semibold text-foreground text-sm">Grading Inbox Clean!</p>
            <p className="text-xs mt-1">No pending student submissions waiting in this queue.</p>
          </div>
        )}
      </div>

      {/* Grading Modal */}
      <TeacherGradingModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        submission={selectedSubmission}
        onGradeSubmitted={handleGradeSubmitted}
      />
    </div>
  )
}
