"use client"

import React, { useState } from "react"
import {
  FileText,
  Plus,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Clock,
  Award,
  Users,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Copy,
} from "lucide-react"
import { TeacherExam, TeacherSubmission } from "../types/teacherPortal.types"
import { MOCK_TEACHER_EXAMS } from "../data/mockTeacherData"
import { TeacherCreateExamModal } from "./TeacherCreateExamModal"
import { TeacherExamAnalyticsModal } from "./TeacherExamAnalyticsModal"
import { TeacherGradingModal } from "./TeacherGradingModal"

export function TeacherExamsPage() {
  const [exams, setExams] = useState<TeacherExam[]>(MOCK_TEACHER_EXAMS)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedExamForAnalytics, setSelectedExamForAnalytics] = useState<TeacherExam | null>(null)
  const [selectedSubmissionForGrading, setSelectedSubmissionForGrading] = useState<TeacherSubmission | null>(null)

  const courses = Array.from(new Set(exams.map((e) => e.course)))

  const filteredExams = exams.filter((exam) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && exam.status === "published") ||
      (activeTab === "in_progress" && exam.status === "in_progress") ||
      (activeTab === "completed" && exam.status === "completed") ||
      (activeTab === "scheduled" && exam.status === "scheduled") ||
      (activeTab === "draft" && exam.status === "draft")

    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCourse = selectedCourse === "all" || exam.course === selectedCourse

    return matchesTab && matchesSearch && matchesCourse
  })

  const getStatusBadge = (status: TeacherExam["status"]) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live / In Progress
          </span>
        )
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        )
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Scheduled
          </span>
        )
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
            Draft
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
            Published
          </span>
        )
    }
  }

  const handleExamCreated = (newExam: any) => {
    setExams([newExam, ...exams])
  }

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700">Assessment Center</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
            {filteredExams.length} Total Exams
          </span>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold shadow-sm shadow-brand-orange/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Exam
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Created</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{exams.length} Exams</div>
          <span className="text-xs text-muted-foreground mt-1 block">Active across 4 courses</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Active / In Progress</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {exams.filter((e) => e.status === "in_progress").length} Active
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">164 students answering</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Avg Cohort Score</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">84.5%</div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
            +3.5% vs Semester 1
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Average Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">91.8%</div>
          <span className="text-xs text-muted-foreground mt-1 block">Standard MoE passing bar</span>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-card p-4 rounded-2xl border border-border">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Exams" },
            { id: "in_progress", label: "In Progress" },
            { id: "completed", label: "Completed" },
            { id: "scheduled", label: "Scheduled" },
            { id: "draft", label: "Drafts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-accent/40 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Course Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exam title or course..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="text-xs rounded-xl border border-border bg-background px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exams Table */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-accent/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-3.5 px-4">Exam Title</th>
                <th className="py-3.5 px-4">Course & Subject</th>
                <th className="py-3.5 px-4 text-center">Structure</th>
                <th className="py-3.5 px-4 text-center">Participants</th>
                <th className="py-3.5 px-4 text-center">Avg Score</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-accent/20 transition-colors">
                  <td className="py-4 px-4 font-semibold text-foreground max-w-xs">
                    <p className="font-bold text-sm text-foreground">{exam.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {exam.duration}
                      </span>
                      <span>•</span>
                      <span>{exam.startDate} - {exam.endDate}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <p className="font-medium text-foreground">{exam.course}</p>
                    <span className="text-[11px] text-muted-foreground">{exam.subject}</span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <div className="inline-block text-left">
                      <p className="font-semibold text-foreground">{exam.questionsCount} Questions</p>
                      <p className="text-[11px] text-muted-foreground">
                        {exam.totalMarks} Marks (Pass: {exam.passingMarks})
                      </p>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-semibold text-foreground">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      {exam.participantsCount}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    {exam.averageScore ? (
                      <div>
                        <span className="font-bold text-foreground text-sm">{exam.averageScore}%</span>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          {exam.passRate}% Passed
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-[11px]">Pending Data</span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-center">{getStatusBadge(exam.status)}</td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedExamForAnalytics(exam)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-foreground text-xs font-semibold transition-colors"
                        title="View Detailed Analytics & Submissions"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-primary" />
                        Analytics
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExams.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-semibold text-foreground">No exams found</p>
            <p className="text-xs mt-1">Try modifying your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <TeacherCreateExamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onExamCreated={handleExamCreated}
      />

      <TeacherExamAnalyticsModal
        isOpen={!!selectedExamForAnalytics}
        onClose={() => setSelectedExamForAnalytics(null)}
        exam={selectedExamForAnalytics}
        onOpenGrading={(sub) => {
          setSelectedExamForAnalytics(null)
          setSelectedSubmissionForGrading(sub)
        }}
      />

      <TeacherGradingModal
        isOpen={!!selectedSubmissionForGrading}
        onClose={() => setSelectedSubmissionForGrading(null)}
        submission={selectedSubmissionForGrading}
      />
    </div>
  )
}
