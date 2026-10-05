"use client"

import * as React from "react"
import { ExamItem } from "../../types/exam.types"
import { ExamLevelBadge, ExamResultBadge } from "../common/ExamBadges"

interface ExamStudentsTabProps {
  exam: ExamItem
}

export function ExamStudentsTab({ exam }: ExamStudentsTabProps) {
  const students = exam.students || []

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/70 border-b border-zinc-200/80">
              <th className="py-4 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                STUDENT
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                LEVEL
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                SCORE
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                CORRECT ANSWERS
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                WRONG ANSWERS
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                RESULT
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                ATTEMPTS
              </th>
              <th className="py-4 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                COMPLETION TIME
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-xs text-zinc-500 font-medium"
                >
                  No student records available for this exam yet.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  {/* STUDENT */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs md:text-sm font-bold text-zinc-900">
                      {student.studentName}
                    </span>
                  </td>

                  {/* LEVEL */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <ExamLevelBadge level={student.level} />
                  </td>

                  {/* SCORE */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`text-xs ${
                        student.score === "—"
                          ? "text-zinc-400"
                          : "font-semibold text-zinc-900"
                      }`}
                    >
                      {student.score}
                    </span>
                  </td>

                  {/* CORRECT ANSWERS */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`text-xs ${
                        student.correctAnswers === "—"
                          ? "text-zinc-400"
                          : "font-semibold text-zinc-900"
                      }`}
                    >
                      {student.correctAnswers}
                    </span>
                  </td>

                  {/* WRONG ANSWERS */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`text-xs ${
                        student.wrongAnswers === "—"
                          ? "text-zinc-400"
                          : "font-semibold text-zinc-900"
                      }`}
                    >
                      {student.wrongAnswers}
                    </span>
                  </td>

                  {/* RESULT */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <ExamResultBadge result={student.result} />
                  </td>

                  {/* ATTEMPTS */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`text-xs ${
                        student.attempts === "—"
                          ? "text-zinc-400"
                          : "font-medium text-zinc-700"
                      }`}
                    >
                      {student.attempts}
                    </span>
                  </td>

                  {/* COMPLETION TIME */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`text-xs ${
                        student.completionTime === "—"
                          ? "text-zinc-400"
                          : "font-medium text-zinc-700"
                      }`}
                    >
                      {student.completionTime}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
