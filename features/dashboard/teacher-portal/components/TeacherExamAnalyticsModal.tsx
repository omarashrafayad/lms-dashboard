"use client"

import React, { useState } from "react"
import {
  X,
  BarChart3,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ArrowUpRight,
  Download,
  Search,
  Filter,
  FileText,
  ChevronRight,
  TrendingUp,
} from "lucide-react"
import { TeacherExam, TeacherSubmission } from "../types/teacherPortal.types"
import { MOCK_EXAM_QUESTION_STATS, MOCK_TEACHER_SUBMISSIONS } from "../data/mockTeacherData"

interface TeacherExamAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  exam: TeacherExam | null
  onOpenGrading?: (submission: TeacherSubmission) => void
}

export function TeacherExamAnalyticsModal({
  isOpen,
  onClose,
  exam,
  onOpenGrading,
}: TeacherExamAnalyticsModalProps) {
  const [activeTab, setActiveTab] = useState<"questions" | "submissions">("questions")
  const [searchQuestion, setSearchQuestion] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  if (!isOpen || !exam) return null

  const filteredQuestions = MOCK_EXAM_QUESTION_STATS.filter((q) => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchQuestion.toLowerCase())
    const matchesDiff = difficultyFilter === "all" || q.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    return matchesSearch && matchesDiff
  })

  const handleExport = () => {
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-card to-accent/5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                Exam Analytics & Results
              </span>
              <span className="text-xs text-muted-foreground">{exam.course}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mt-2">{exam.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {exam.questionsCount} Questions • {exam.totalMarks} Marks
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Duration: {exam.duration}
              </span>
              <span>Passing: {exam.passingMarks} Marks</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              {downloadSuccess ? "Report Exported!" : "Export Report"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-accent/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Total Participants</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">{exam.participantsCount}</div>
              <span className="text-xs text-muted-foreground mt-1 inline-block">158 Completed • 6 Active</span>
            </div>

            <div className="p-4 rounded-xl border border-border bg-accent/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Average Score</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">{exam.averageScore || 84.5}%</div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 inline-flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +4.2% vs previous term
              </span>
            </div>

            <div className="p-4 rounded-xl border border-border bg-accent/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Pass Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {exam.passRate || 91}%
              </div>
              <span className="text-xs text-muted-foreground mt-1 inline-block">144 Passed • 14 Failed</span>
            </div>

            <div className="p-4 rounded-xl border border-border bg-accent/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Avg Time Spent</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">68m</div>
              <span className="text-xs text-muted-foreground mt-1 inline-block">Out of 90m allowed</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab("questions")}
              className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === "questions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Question-by-Question Analysis ({MOCK_EXAM_QUESTION_STATS.length})
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === "submissions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Student Submissions ({MOCK_TEACHER_SUBMISSIONS.length})
            </button>
          </div>

          {/* Tab 1: Question Breakdown */}
          {activeTab === "questions" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuestion}
                    onChange={(e) => setSearchQuestion(e.target.value)}
                    placeholder="Search question prompt..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Difficulty:</span>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="text-xs rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-accent/40 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3 px-4 w-12">#</th>
                      <th className="py-3 px-4">Question Prompt</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-center">Correct</th>
                      <th className="py-3 px-4 text-center">Incorrect</th>
                      <th className="py-3 px-4">Success Rate</th>
                      <th className="py-3 px-4 text-center">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-accent/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-foreground">Q{q.number}</td>
                        <td className="py-3 px-4 max-w-sm">
                          <p className="font-medium text-foreground line-clamp-2">{q.questionText}</p>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{q.type}</td>
                        <td className="py-3 px-4 text-center font-medium text-emerald-600 dark:text-emerald-400">
                          {q.correctCount}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-rose-500">
                          {q.incorrectCount}
                        </td>
                        <td className="py-3 px-4 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-accent overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  q.successRate >= 80
                                    ? "bg-emerald-500"
                                    : q.successRate >= 60
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                }`}
                                style={{ width: `${q.successRate}%` }}
                              />
                            </div>
                            <span className="font-semibold text-foreground text-xs w-10 text-right">
                              {q.successRate}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              q.difficulty === "Easy"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : q.difficulty === "Moderate"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Submissions List */}
          {activeTab === "submissions" && (
            <div className="space-y-4">
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-accent/40 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Score / Grade</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MOCK_TEACHER_SUBMISSIONS.map((sub) => (
                      <tr key={sub.id} className="hover:bg-accent/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                              {sub.studentName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{sub.studentName}</p>
                              <p className="text-[10px] text-muted-foreground">{sub.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {sub.submittedAt}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Needs Grading
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {sub.grade !== undefined ? `${sub.grade} / ${sub.totalMarks}` : "Pending"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onOpenGrading && onOpenGrading(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium transition-colors"
                          >
                            Grade Now
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-accent/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  )
}
