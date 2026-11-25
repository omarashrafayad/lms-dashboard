"use client"

import * as React from "react"
import {
  X,
  BookOpen,
  Users,
  Layers,
  Plus,
  PlayCircle,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react"
import { TeacherCourse } from "../types/teacherPortal.types"
import { MOCK_TEACHER_STUDENTS } from "../data/mockTeacherData"

interface TeacherCourseDetailModalProps {
  course: TeacherCourse | null
  isOpen: boolean
  onClose: () => void
}

export function TeacherCourseDetailModal({
  course,
  isOpen,
  onClose,
}: TeacherCourseDetailModalProps) {
  const [activeTab, setActiveTab] = React.useState<"curriculum" | "students" | "analytics">("curriculum")
  const [units, setUnits] = React.useState([
    {
      id: "u-1",
      title: "Unit 1: Electromagnetic Induction Foundations",
      order: 1,
      chapters: [
        {
          id: "ch-1",
          title: "Chapter 1: Faraday's Law & Induced EMF",
          lessons: [
            { id: "l-1", title: "Theory & Mathematical Formulation", type: "video", duration: "45 mins" },
            { id: "l-2", title: "Faraday Equation Formula Worksheet", type: "pdf", duration: "30 mins" },
            { id: "l-3", title: "Chapter 1 Formative Quiz", type: "quiz", duration: "20 mins" },
          ],
        },
        {
          id: "ch-2",
          title: "Chapter 2: Mutual & Self Induction",
          lessons: [
            { id: "l-4", title: "Mutual Inductance Coefficients", type: "video", duration: "40 mins" },
            { id: "l-5", title: "Solenoid Back-EMF Calculations", type: "pdf", duration: "25 mins" },
          ],
        },
      ],
    },
    {
      id: "u-2",
      title: "Unit 2: Alternating Current Circuits & Dynamos",
      order: 2,
      chapters: [
        {
          id: "ch-3",
          title: "Chapter 3: AC Generators & Slip Ring Commutators",
          lessons: [
            { id: "l-6", title: "Sinusoidal Voltage Generation", type: "video", duration: "50 mins" },
          ],
        },
      ],
    },
  ])

  const [expandedUnits, setExpandedUnits] = React.useState<Record<string, boolean>>({ "u-1": true })
  const [expandedChapters, setExpandedChapters] = React.useState<Record<string, boolean>>({ "ch-1": true })

  if (!isOpen || !course) return null

  const toggleUnit = (id: string) => {
    setExpandedUnits((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAddUnit = () => {
    const title = prompt("Enter new unit title:")
    if (title) {
      const newU = {
        id: `u-${Date.now()}`,
        title,
        order: units.length + 1,
        chapters: [],
      }
      setUnits([...units, newU])
    }
  }

  const handleAddChapter = (unitId: string) => {
    const title = prompt("Enter new chapter title:")
    if (title) {
      setUnits(
        units.map((u) => {
          if (u.id === unitId) {
            return {
              ...u,
              chapters: [
                ...u.chapters,
                { id: `ch-${Date.now()}`, title, lessons: [] },
              ],
            }
          }
          return u
        })
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Course Header Banner */}
        <div className="relative h-44 w-full bg-zinc-950 overflow-hidden shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 size-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-xs cursor-pointer z-10"
          >
            <X className="size-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex flex-col gap-1 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white">
                {course.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 backdrop-blur-xs text-white">
                {course.grade}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white">
                {course.status}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-zinc-100 bg-zinc-50/80">
          {[
            { key: "curriculum", label: "Curriculum Editor", icon: Layers },
            { key: "students", label: "Enrolled Students", icon: Users },
            { key: "analytics", label: "Course Analytics", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-900 bg-white rounded-t-xl"
                    : "border-transparent text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* CURRICULUM EDITOR TAB */}
          {activeTab === "curriculum" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">
                    Syllabus Hierarchy (Unit → Chapter → Lesson)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Organize your educational content modules, reorder lectures, and publish lessons
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddUnit}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add New Unit</span>
                </button>
              </div>

              {/* Units List */}
              <div className="flex flex-col gap-3">
                {units.map((unit) => {
                  const isUnitExp = !!expandedUnits[unit.id]

                  return (
                    <div
                      key={unit.id}
                      className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xs"
                    >
                      {/* Unit Header */}
                      <div className="flex items-center justify-between p-3.5 bg-zinc-50/80 border-b border-zinc-150">
                        <button
                          type="button"
                          onClick={() => toggleUnit(unit.id)}
                          className="flex items-center gap-3 font-bold text-xs text-zinc-900 cursor-pointer text-left"
                        >
                          <span className="size-6 rounded-lg bg-blue-100 text-blue-800 text-xs font-extrabold flex items-center justify-center shrink-0">
                            {unit.order}
                          </span>
                          <span>{unit.title}</span>
                          {isUnitExp ? (
                            <ChevronDown className="size-4 text-zinc-400" />
                          ) : (
                            <ChevronRight className="size-4 text-zinc-400" />
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddChapter(unit.id)}
                            className="px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                          >
                            + Chapter
                          </button>
                        </div>
                      </div>

                      {/* Chapters within Unit */}
                      {isUnitExp && (
                        <div className="p-4 flex flex-col gap-3">
                          {unit.chapters.map((chap) => {
                            const isChapExp = !!expandedChapters[chap.id]

                            return (
                              <div
                                key={chap.id}
                                className="rounded-xl border border-zinc-200 overflow-hidden"
                              >
                                <div className="flex items-center justify-between p-3 bg-zinc-50/50">
                                  <button
                                    type="button"
                                    onClick={() => toggleChapter(chap.id)}
                                    className="flex items-center gap-2 font-semibold text-xs text-zinc-800 cursor-pointer"
                                  >
                                    <BookOpen className="size-3.5 text-zinc-500" />
                                    <span>{chap.title}</span>
                                    {isChapExp ? (
                                      <ChevronDown className="size-3.5 text-zinc-400" />
                                    ) : (
                                      <ChevronRight className="size-3.5 text-zinc-400" />
                                    )}
                                  </button>
                                  <span className="text-[11px] text-zinc-400">
                                    {chap.lessons.length} lessons
                                  </span>
                                </div>

                                {isChapExp && (
                                  <div className="divide-y divide-zinc-100 p-1">
                                    {chap.lessons.map((les) => (
                                      <div
                                        key={les.id}
                                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-50 text-xs text-zinc-700"
                                      >
                                        <div className="flex items-center gap-2.5">
                                          {les.type === "video" ? (
                                            <PlayCircle className="size-4 text-blue-600" />
                                          ) : les.type === "pdf" ? (
                                            <FileText className="size-4 text-rose-600" />
                                          ) : (
                                            <HelpCircle className="size-4 text-purple-600" />
                                          )}
                                          <span className="font-medium text-zinc-900">{les.title}</span>
                                          <span className="text-[10px] text-zinc-400">({les.duration})</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                            Published
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ENROLLED STUDENTS TAB */}
          {activeTab === "students" && (
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-sm text-zinc-900">
                Enrolled Students ({course.enrolledStudentsCount} Learners)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">Student</th>
                      <th className="py-2.5 px-3">Grade</th>
                      <th className="py-2.5 px-3">Progress</th>
                      <th className="py-2.5 px-3">Average Score</th>
                      <th className="py-2.5 px-3">Attendance</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {MOCK_TEACHER_STUDENTS.map((st) => (
                      <tr key={st.id} className="hover:bg-zinc-50">
                        <td className="py-3 px-3 font-semibold text-zinc-900 flex items-center gap-2">
                          <div className="size-6 rounded-full overflow-hidden bg-zinc-200 shrink-0">
                            <img src={st.avatar} alt={st.fullName} className="w-full h-full object-cover" />
                          </div>
                          <span>{st.fullName}</span>
                        </td>
                        <td className="py-3 px-3 text-zinc-600">{st.grade}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-zinc-800">{st.courseProgress}%</span>
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-700">{st.averageScore}%</td>
                        <td className="py-3 px-3 text-zinc-600">{st.attendanceRate}%</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {st.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COURSE ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col">
                <span className="text-zinc-400 text-[11px]">Enrolled Students</span>
                <span className="text-xl font-extrabold text-zinc-900">{course.enrolledStudentsCount}</span>
                <span className="text-[10px] text-blue-600">{course.activeStudentsCount} Active</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col">
                <span className="text-zinc-400 text-[11px]">Average Score</span>
                <span className="text-xl font-extrabold text-emerald-700">{course.averageExamScore}%</span>
                <span className="text-[10px] text-zinc-500">Across 6 Assessments</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col">
                <span className="text-zinc-400 text-[11px]">Completion Rate</span>
                <span className="text-xl font-extrabold text-purple-700">{course.courseProgressPercentage}%</span>
                <span className="text-[10px] text-purple-600">{course.completedStudentsCount} Completed</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col">
                <span className="text-zinc-400 text-[11px]">Total Duration</span>
                <span className="text-xl font-extrabold text-zinc-800">48 Hours</span>
                <span className="text-[10px] text-zinc-500">40 Lessons</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100 bg-zinc-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white font-semibold text-zinc-700 text-xs hover:bg-zinc-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
