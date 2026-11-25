"use client"

import React, { useState } from "react"
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Filter,
  Eye,
  Edit,
  Trash2,
  Upload,
  X,
  FileCheck,
} from "lucide-react"
import { TeacherAssignment, TeacherSubmission } from "../types/teacherPortal.types"
import { MOCK_TEACHER_ASSIGNMENTS, MOCK_TEACHER_SUBMISSIONS } from "../data/mockTeacherData"
import { TeacherGradingModal } from "./TeacherGradingModal"

export function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(MOCK_TEACHER_ASSIGNMENTS)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedSubmissionForGrading, setSelectedSubmissionForGrading] = useState<TeacherSubmission | null>(null)

  // New assignment form state
  const [newTitle, setNewTitle] = useState("")
  const [newCourse, setNewCourse] = useState("Advanced Physics: Mechanics & Modern Physics")
  const [newDueDate, setNewDueDate] = useState("")
  const [newTotalMarks, setNewTotalMarks] = useState(20)
  const [newInstructions, setNewInstructions] = useState("")

  const courses = Array.from(new Set(assignments.map((a) => a.course)))

  const filteredAssignments = assignments.filter((asg) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && asg.status === "active") ||
      (activeTab === "completed" && asg.status === "completed") ||
      (activeTab === "draft" && asg.status === "draft")

    const matchesSearch =
      asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.course.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCourse = selectedCourse === "all" || asg.course === selectedCourse

    return matchesTab && matchesSearch && matchesCourse
  })

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const created: TeacherAssignment = {
      id: `tch-asg-${Date.now()}`,
      title: newTitle,
      subject: "Physics",
      course: newCourse,
      dueDate: newDueDate || "In 7 days",
      totalMarks: Number(newTotalMarks),
      totalStudents: 164,
      submittedCount: 0,
      pendingGradingCount: 0,
      gradedCount: 0,
      status: "active",
    }

    setAssignments([created, ...assignments])
    setIsCreateModalOpen(false)
    setNewTitle("")
    setNewInstructions("")
  }

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700">Homework & Submissions</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
            {filteredAssignments.length} Assignments
          </span>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold shadow-sm shadow-brand-orange/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Assignments</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{assignments.length}</div>
          <span className="text-xs text-muted-foreground mt-1 block">Across all active terms</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Active Submissions</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {assignments.filter((a) => a.status === "active").length} Active
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Accepting student files</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Pending Grading</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {assignments.reduce((sum, a) => sum + a.pendingGradingCount, 0)} Items
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Awaiting evaluation</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Graded & Published</span>
            <FileCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {assignments.reduce((sum, a) => sum + a.gradedCount, 0)}
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Feedback released</span>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-card p-4 rounded-2xl border border-border">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Assignments" },
            { id: "active", label: "Active" },
            { id: "completed", label: "Completed" },
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

        {/* Search & Course Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignment title..."
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

      {/* Assignments Table */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-accent/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-3.5 px-4">Assignment Title</th>
                <th className="py-3.5 px-4">Course & Subject</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-center">Marks</th>
                <th className="py-3.5 px-4">Submissions Progress</th>
                <th className="py-3.5 px-4 text-center">Pending Grading</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAssignments.map((asg) => (
                <tr key={asg.id} className="hover:bg-accent/20 transition-colors">
                  <td className="py-4 px-4 font-semibold text-foreground max-w-xs">
                    <p className="font-bold text-sm text-foreground">{asg.title}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        asg.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : asg.status === "completed"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {asg.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <p className="font-medium text-foreground">{asg.course}</p>
                    <span className="text-[11px] text-muted-foreground">{asg.subject}</span>
                  </td>

                  <td className="py-4 px-4 font-medium text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {asg.dueDate}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-foreground">
                    {asg.totalMarks} Marks
                  </td>

                  <td className="py-4 px-4 min-w-[160px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">
                          {asg.submittedCount} / {asg.totalStudents} Submitted
                        </span>
                        <span className="font-semibold text-foreground">
                          {Math.round((asg.submittedCount / (asg.totalStudents || 1)) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-accent overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${(asg.submittedCount / (asg.totalStudents || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    {asg.pendingGradingCount > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {asg.pendingGradingCount} Pending
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All Graded
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => {
                        const targetSub = MOCK_TEACHER_SUBMISSIONS.find((s) => s.assessmentType === "assignment") || MOCK_TEACHER_SUBMISSIONS[0]
                        setSelectedSubmissionForGrading(targetSub)
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      Grade Queue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-xl rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between bg-accent/20">
              <h2 className="text-lg font-bold text-foreground">Create New Assignment</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assignment 5: Faraday's Law Numerical Problems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Target Course</label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {courses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Due Date & Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dec 04, 2025 at 11:59 PM"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Submission Format</label>
                  <select className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>PDF Document Upload</option>
                    <option>Online Rich Text Editor</option>
                    <option>Both PDF & Text Allowed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Problem Description & Instructions
                </label>
                <textarea
                  rows={4}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="Detail the problems to be solved, expected step-by-step working, and formatting requirements..."
                  className="w-full p-3 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="border border-dashed border-border rounded-xl p-4 text-center hover:bg-accent/20 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-xs font-semibold text-foreground">Upload Problem Sheet PDF (Optional)</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">PDF or Word files up to 25MB</p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      <TeacherGradingModal
        isOpen={!!selectedSubmissionForGrading}
        onClose={() => setSelectedSubmissionForGrading(null)}
        submission={selectedSubmissionForGrading}
      />
    </div>
  )
}
