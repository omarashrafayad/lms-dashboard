"use client"

import * as React from "react"
import { StudentProgressItem } from "../../types/course.types"

export interface CourseStudentsTabProps {
  students: StudentProgressItem[]
  totalEnrolled?: number
  avgCompletion?: string
}

export function CourseStudentsTab({
  students,
  totalEnrolled = 325,
  avgCompletion = "74%",
}: CourseStudentsTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Top 2 Metrics matching Image 3 */}
      <div className="flex items-center gap-16">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {totalEnrolled}
          </span>
          <span className="text-xs text-zinc-400 font-normal">
            Enrolled students
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {avgCompletion}
          </span>
          <span className="text-xs text-zinc-400 font-normal">
            Avg. completion
          </span>
        </div>
      </div>

      {/* Students Progress Table matching Image 3 */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  STUDENT
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase w-72">
                  PROGRESS
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  SCORE
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  CORRECT ANSWERS
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  WRONG ANSWERS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-zinc-50/60 transition-colors"
                >
                  {/* Student Name */}
                  <td className="py-4 px-6 font-semibold text-zinc-900 whitespace-nowrap">
                    {student.name}
                  </td>

                  {/* Progress bar + percentage */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3 w-56">
                      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F59E0B] rounded-full transition-all"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-normal text-zinc-400 min-w-8 text-right">
                        {student.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-4 px-6 font-bold text-zinc-900 whitespace-nowrap">
                    {student.score}%
                  </td>

                  {/* Correct Answers */}
                  <td className="py-4 px-6 text-zinc-400 font-normal whitespace-nowrap">
                    {student.correctAnswers}
                  </td>

                  {/* Wrong Answers */}
                  <td className="py-4 px-6 text-zinc-400 font-normal whitespace-nowrap">
                    {student.wrongAnswers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
