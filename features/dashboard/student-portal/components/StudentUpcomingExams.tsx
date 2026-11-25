"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileCheck2,
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Award,
  ArrowRight,
  Flame,
} from "lucide-react"
import { Exam } from "../types/studentPortal.types"
import { MOCK_STUDENT_EXAMS } from "../data/mockStudentData"

interface StudentUpcomingExamsProps {
  exams?: Exam[]
  onStartExam?: (exam: Exam) => void
  onViewResult?: (exam: Exam) => void
}

export function StudentUpcomingExams({
  exams = MOCK_STUDENT_EXAMS,
  onStartExam,
  onViewResult,
}: StudentUpcomingExamsProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck2 className="size-5 text-brand-orange" />
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">
            Upcoming & Active Exams
          </h2>
        </div>
        <Link
          href="/student/exams"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
        >
          <span>Exams Center</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => {
          const isAvailable = exam.status === "available_now"
          const isSubmitted = exam.status === "submitted"
          const isUpcoming = exam.status === "upcoming"

          return (
            <div
              key={exam.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                isAvailable
                  ? "bg-rose-50/40 border-rose-200/90 shadow-2xs ring-1 ring-rose-400/20"
                  : isSubmitted
                  ? "bg-emerald-50/30 border-emerald-200"
                  : "bg-white border-zinc-200/80"
              }`}
            >
              <div className="flex flex-col gap-2.5">
                {/* Header status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800">
                    {exam.subject}
                  </span>

                  {isAvailable && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1 shadow-2xs animate-pulse">
                      <Flame className="size-3 fill-current" />
                      Available Now
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                      Starts in 3 days
                    </span>
                  )}
                  {isSubmitted && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle className="size-3" />
                      Submitted
                    </span>
                  )}
                </div>

                {/* Title & Course */}
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 leading-snug">
                    {exam.title}
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-normal">
                    {exam.relatedCourse} • {exam.teacherName}
                  </span>
                </div>

                {/* Exam Details Badges Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 font-medium">Questions</span>
                    <span className="font-bold text-zinc-800">{exam.totalQuestions} Qs ({exam.totalMarks} Marks)</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 font-medium">Duration</span>
                    <span className="font-bold text-zinc-800">{exam.durationMinutes} Minutes</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 font-medium">Passing Score</span>
                    <span className="font-bold text-zinc-800">{exam.passingScore} / {exam.totalMarks} Marks</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 font-medium">Attempts</span>
                    <span className="font-bold text-zinc-800">{exam.attemptsUsed} / {exam.attemptsAllowed} Used</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[11px] text-zinc-500 pt-1">
                  <div className="flex items-center justify-between">
                    <span>Deadline:</span>
                    <span className="font-semibold text-zinc-700">{exam.submissionDeadline}</span>
                  </div>
                  {isSubmitted && exam.scoreObtained !== undefined && (
                    <div className="flex items-center justify-between text-emerald-700 font-bold bg-emerald-100/60 px-2 py-1 rounded-lg">
                      <span>Score Obtained:</span>
                      <span>{exam.scoreObtained} / {exam.totalMarks} ({exam.percentage}%)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-zinc-100">
                {isAvailable ? (
                  <Link
                    href={`/student/exams`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-sm shadow-brand-orange/20 transition-colors cursor-pointer"
                  >
                    <FileCheck2 className="size-4" />
                    <span>Start Exam Now</span>
                  </Link>
                ) : isSubmitted ? (
                  <Link
                    href={`/student/results`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <span>View Graded Result</span>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-100 text-zinc-400 font-medium text-xs cursor-not-allowed"
                  >
                    <Clock className="size-3.5" />
                    <span>Locked Until Start Date</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
