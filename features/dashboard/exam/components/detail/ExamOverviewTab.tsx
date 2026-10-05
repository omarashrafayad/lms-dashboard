"use client"

import * as React from "react"
import { ExamItem } from "../../types/exam.types"

interface ExamOverviewTabProps {
  exam: ExamItem
}

export function ExamOverviewTab({ exam }: ExamOverviewTabProps) {
  const typeDisplay =
    exam.type === "Monthly"
      ? "Monthly Exam"
      : exam.type === "Subject"
      ? "Subject Exam"
      : "Course Exam"

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 md:p-10 max-w-4xl">
      {/* Card Header matching Image 2 */}
      <h2 className="text-base font-bold text-zinc-900 mb-8">
        Exam Information
      </h2>

      {/* 2-Column Grid matching Image 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-16">
        {/* Row 1 */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            EXAM TITLE
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.title}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            TYPE
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {typeDisplay}
          </span>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            LEVEL
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.level}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            SUBJECT
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.subject}
          </span>
        </div>

        {/* Row 3 */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            EDUCATION STAGE
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.educationStage}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            ACADEMIC YEAR
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.academicYear}
          </span>
        </div>

        {/* Row 4 */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            TERM
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.term}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            MONTH
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.month || "—"}
          </span>
        </div>

        {/* Row 5 */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            NUMBER OF QUESTIONS
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.questionsCount}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            TOTAL POINTS
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.totalPoints}
          </span>
        </div>

        {/* Row 6 */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            DURATION
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.duration}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            ATTEMPTS ALLOWED
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.attemptsAllowed}
          </span>
        </div>

        {/* Row 7 */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            PASSING SCORE
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.passingScore}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            STATUS
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {exam.status}
          </span>
        </div>
      </div>
    </div>
  )
}
