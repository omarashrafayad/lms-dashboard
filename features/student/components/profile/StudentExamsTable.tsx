"use client"

import * as React from "react"
import { StudentExamResult } from "../../types/studentProfile.types"
import { cn } from "@/lib/utils"

interface StudentExamsTableProps {
  exams: StudentExamResult[]
}

export function StudentExamsTable({ exams }: StudentExamsTableProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs">
      <h2 className="text-sm font-bold text-zinc-900 mb-4">
        Exams & Results
      </h2>

      <div className="overflow-x-auto rounded-xl border border-zinc-100">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                EXAM
              </th>
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                COURSE
              </th>
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                DATE
              </th>
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                SCORE
              </th>
              <th className="py-2.5 px-4 font-semibold text-[10px] tracking-wider text-zinc-400 uppercase">
                RESULT
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {exams.map((exam) => {
              const isPassed = exam.result === "Passed"
              return (
                <tr key={exam.id} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-zinc-900">
                    {exam.name}
                  </td>
                  <td className="py-3 px-4 text-zinc-600">
                    {exam.course}
                  </td>
                  <td className="py-3 px-4 text-zinc-500">
                    {exam.date}
                  </td>
                  <td className="py-3 px-4 font-bold text-zinc-900">
                    {exam.score}%
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                        isPassed
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                          : "text-red-700 bg-red-50 border-red-200/60"
                      )}
                    >
                      {exam.result}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
