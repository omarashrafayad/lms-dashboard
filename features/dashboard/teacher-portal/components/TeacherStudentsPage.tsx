"use client"

import * as React from "react"
import {
  Users,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpDown,
  Eye,
  MessageSquare,
} from "lucide-react"
import { TeacherStudent } from "../types/teacherPortal.types"
import { MOCK_TEACHER_STUDENTS } from "../data/mockTeacherData"
import { TeacherStudentDetailModal } from "./TeacherStudentDetailModal"

export function TeacherStudentsPage() {
  const [activeTab, setActiveTab] = React.useState<"all" | "active" | "at_risk">("all")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedStudent, setSelectedStudent] = React.useState<TeacherStudent | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  const filteredStudents = React.useMemo(() => {
    return MOCK_TEACHER_STUDENTS.filter((st) => {
      if (activeTab !== "all" && st.status !== activeTab) return false
      if (
        searchTerm &&
        !st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !st.studentId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !st.enrolledCourse.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [activeTab, searchTerm])

  const handleOpenDetail = (st: TeacherStudent) => {
    setSelectedStudent(st)
    setIsDetailOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40 transition-all"
            />
          </div>
          <span className="text-xs font-medium text-zinc-500">
            {filteredStudents.length} Students
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 border border-zinc-200/70 text-xs">
          {(["all", "active", "at_risk"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-zinc-950 shadow-2xs font-bold border border-zinc-200/60"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {tab === "all" ? "All Cohort" : tab === "active" ? "Active" : "At Risk"}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Metric Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Total Students</span>
          <span className="text-xl font-extrabold text-zinc-900">348</span>
          <span className="text-[10px] text-zinc-500">Enrolled</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Active Students</span>
          <span className="text-xl font-extrabold text-emerald-700">312</span>
          <span className="text-[10px] text-emerald-600">89.6% Active</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Inactive</span>
          <span className="text-xl font-extrabold text-zinc-500">24</span>
          <span className="text-[10px] text-zinc-400">&gt; 14 days idle</span>
        </div>
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Students at Risk</span>
          <span className="text-xl font-extrabold text-rose-700">12</span>
          <span className="text-[10px] text-rose-600 font-bold">Needs Attention</span>
        </div>
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Average Progress</span>
          <span className="text-xl font-extrabold text-blue-700">74.0%</span>
          <span className="text-[10px] text-blue-600">Syllabus Covered</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Average Score</span>
          <span className="text-xl font-extrabold text-purple-700">84.6%</span>
          <span className="text-[10px] text-emerald-600 font-semibold">+3.1% Growth</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200/70 max-w-fit">
        {[
          { key: "all", label: "All Students", count: MOCK_TEACHER_STUDENTS.length },
          { key: "active", label: "Active Learners", count: MOCK_TEACHER_STUDENTS.filter((s) => s.status === "active").length },
          { key: "at_risk", label: "⚠️ Students at Risk", count: MOCK_TEACHER_STUDENTS.filter((s) => s.status === "at_risk").length },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? tab.key === "at_risk"
                  ? "bg-rose-600 text-white shadow-2xs font-bold"
                  : "bg-white text-blue-900 shadow-2xs font-bold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.key && tab.key === "at_risk"
                  ? "bg-rose-800 text-white"
                  : activeTab === tab.key
                  ? "bg-blue-100 text-blue-800"
                  : "bg-zinc-200 text-zinc-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Students Table */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Avg Score</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredStudents.map((st) => {
                const isRisk = st.status === "at_risk"

                return (
                  <tr
                    key={st.id}
                    className={`transition-colors ${isRisk ? "bg-rose-50/30 hover:bg-rose-50/60" : "hover:bg-zinc-50"}`}
                  >
                    <td className="py-3.5 px-4 font-bold text-zinc-900 flex items-center gap-3">
                      <div className="size-8 rounded-full overflow-hidden bg-zinc-200 shrink-0 border border-zinc-200">
                        <img src={st.avatar} alt={st.fullName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900">{st.fullName}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">Active: {st.lastActivity}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-600">{st.studentId}</td>
                    <td className="py-3.5 px-4 text-zinc-700">{st.grade}</td>
                    <td className="py-3.5 px-4 text-zinc-600 max-w-xs truncate">{st.enrolledCourse}</td>
                    <td className="py-3.5 px-4 font-bold text-zinc-800">{st.courseProgress}%</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-700">{st.averageScore}%</td>
                    <td className="py-3.5 px-4 text-zinc-700">{st.attendanceRate}%</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isRisk
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {st.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(st)}
                        className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      <TeacherStudentDetailModal
        student={selectedStudent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  )
}
