"use client"

import * as React from "react"
import {
  Award,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Filter,
  ArrowUpRight,
  Eye,
  FileCheck2,
} from "lucide-react"
import { MOCK_STUDENT_RESULTS, MOCK_SUBJECT_PERFORMANCES, MOCK_STUDENT_EXAMS } from "../data/mockStudentData"
import { StudentExamResultModal } from "./StudentExamResultModal"
import { Exam } from "../types/studentPortal.types"

export function StudentResultsView() {
  const [selectedExam, setSelectedExam] = React.useState<Exam | null>(null)
  const [isResultModalOpen, setIsResultModalOpen] = React.useState(false)

  const handleOpenResult = (record: any) => {
    // Map to exam modal
    const matched = MOCK_STUDENT_EXAMS.find((e) => e.title === record.examName) || {
      ...MOCK_STUDENT_EXAMS[0],
      title: record.examName,
      subject: record.subject,
      scoreObtained: record.obtainedMarks,
      totalMarks: record.totalMarks,
      percentage: record.percentage,
      teacherFeedback: record.teacherFeedback,
    }
    setSelectedExam(matched as Exam)
    setIsResultModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
              <Award className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              Academic Results & Transcript
            </h1>
          </div>
          <p className="text-xs text-zinc-500">
            Verified academic evaluations, historical exam transcripts, subject mastery levels, and grade distribution
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Downloading full official semester transcript PDF...")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-sm shadow-brand-orange/20 transition-all cursor-pointer"
        >
          <Download className="size-3.5" />
          <span>Download Semester Transcript</span>
        </button>
      </div>

      {/* 7 Summary KPI Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Total Exams</span>
          <span className="text-xl font-extrabold text-zinc-900">7</span>
          <span className="text-[10px] text-zinc-500">Scheduled</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Completed</span>
          <span className="text-xl font-extrabold text-blue-700">5</span>
          <span className="text-[10px] text-blue-600">Evaluated</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Passed Exams</span>
          <span className="text-xl font-extrabold text-emerald-700">5</span>
          <span className="text-[10px] text-emerald-600">100% Pass Rate</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Failed Exams</span>
          <span className="text-xl font-extrabold text-zinc-400">0</span>
          <span className="text-[10px] text-zinc-400">Zero Failures</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Average Score</span>
          <span className="text-xl font-extrabold text-amber-700">88.5%</span>
          <span className="text-[10px] text-emerald-600 font-semibold">+4.2% Growth</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Highest Score</span>
          <span className="text-xl font-extrabold text-emerald-700">98%</span>
          <span className="text-[10px] text-zinc-500">Calculus</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
          <span className="text-[10px] text-zinc-400 font-medium">Lowest Score</span>
          <span className="text-xl font-extrabold text-zinc-800">76%</span>
          <span className="text-[10px] text-zinc-500">Mechanics</span>
        </div>
      </div>

      {/* Results Table */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h2 className="text-base font-bold text-zinc-900">
            Official Exam Records Table
          </h2>
          <span className="text-xs text-zinc-400">5 Exam Results Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Exam Name</th>
                <th className="py-3 px-4 font-bold">Subject</th>
                <th className="py-3 px-4 font-bold">Exam Date</th>
                <th className="py-3 px-4 font-bold">Marks Obtained</th>
                <th className="py-3 px-4 font-bold">Percentage</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {MOCK_STUDENT_RESULTS.map((res) => (
                <tr key={res.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900">
                    {res.examName}
                    <span className="block text-[11px] text-zinc-400 font-normal">
                      {res.course}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700">
                      {res.subject}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600">{res.examDate}</td>
                  <td className="py-3.5 px-4 font-extrabold text-zinc-900">
                    {res.obtainedMarks} / {res.totalMarks}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {res.percentage}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="size-3" /> Passed
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenResult(res)}
                      className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      View Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Performance Breakdown Grid */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h2 className="text-base font-bold text-zinc-900">
            Subject-wise Academic Mastery Breakdown
          </h2>
          <span className="text-xs text-zinc-400">All 6 Enrolled Subjects</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SUBJECT_PERFORMANCES.map((sub) => (
            <div
              key={sub.subject}
              className="p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-zinc-900">{sub.subject}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      sub.status === "excellent"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {sub.status.replace("_", " ")}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  {sub.completedExams} Exams Completed • {sub.completedLessons} Lessons
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white border border-zinc-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Average Score</span>
                  <span className="font-extrabold text-emerald-700">{sub.averageScore}%</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Range: {sub.lowestScore}% - {sub.highestScore}%</span>
                  <span>{sub.progress}% Syllabus Done</span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${sub.averageScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Result Modal */}
      <StudentExamResultModal
        examId={selectedExam?.id || null}
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
      />
    </div>
  )
}
