"use client"

import * as React from "react"
import {
  BookOpen,
  Search,
  Filter,
  Users,
  Layers,
  Edit,
  BarChart3,
  Eye,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { TeacherCourse } from "../types/teacherPortal.types"
import { MOCK_TEACHER_COURSES } from "../data/mockTeacherData"
import { TeacherCourseDetailModal } from "./TeacherCourseDetailModal"

export function TeacherCoursesPage() {
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCourse, setSelectedCourse] = React.useState<TeacherCourse | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  const filteredCourses = React.useMemo(() => {
    return MOCK_TEACHER_COURSES.filter((c) => {
      if (activeTab !== "all" && c.status !== activeTab) return false
      if (
        searchTerm &&
        !c.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !c.subject.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [activeTab, searchTerm])

  const handleOpenCourse = (c: TeacherCourse) => {
    setSelectedCourse(c)
    setIsDetailOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search course title or subject..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40 transition-all"
            />
          </div>
          <span className="text-xs font-medium text-zinc-500">
            {filteredCourses.length} Courses Found
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (filteredCourses[0]) handleOpenCourse(filteredCourses[0])
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-sm shadow-brand-orange/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="size-4" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200/70 max-w-fit">
        {[
          { key: "all", label: "All Courses", count: MOCK_TEACHER_COURSES.length },
          { key: "published", label: "Published", count: MOCK_TEACHER_COURSES.filter((c) => c.status === "published").length },
          { key: "draft", label: "Draft", count: MOCK_TEACHER_COURSES.filter((c) => c.status === "draft").length },
          { key: "pending_approval", label: "Pending Approval", count: 0 },
          { key: "archived", label: "Archived", count: 0 },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-white text-zinc-950 shadow-2xs font-bold border border-zinc-200/60"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.key ? "bg-brand-orange/20 text-amber-800 font-bold" : "bg-zinc-200 text-zinc-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Courses Table */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Units / Lessons</th>
                <th className="py-3 px-4">Average Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                        <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col max-w-xs">
                        <span className="font-bold text-zinc-900 truncate">{c.title}</span>
                        <span className="text-[11px] text-zinc-400 font-normal line-clamp-1">{c.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-700">{c.subject}</td>
                  <td className="py-3.5 px-4 text-zinc-600">{c.grade}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-zinc-800">{c.enrolledStudentsCount}</span>
                    <span className="text-[10px] text-zinc-400 block">({c.activeStudentsCount} Active)</span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700">
                    {c.unitsCount} Units • {c.lessonsCount} Lessons
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {c.averageExamScore > 0 ? `${c.averageExamScore}%` : "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">{c.lastUpdated}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenCourse(c)}
                        className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Detail Modal */}
      <TeacherCourseDetailModal
        course={selectedCourse}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  )
}
