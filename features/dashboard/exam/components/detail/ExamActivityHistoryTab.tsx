"use client"

import * as React from "react"
import { ExamItem } from "../../types/exam.types"

interface ExamActivityHistoryTabProps {
  exam: ExamItem
}

export function ExamActivityHistoryTab({ exam }: ExamActivityHistoryTabProps) {
  const history = exam.activityHistory || []

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/70 border-b border-zinc-200/80">
              <th className="py-4 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                ACTION
              </th>
              <th className="py-4 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                ADMIN
              </th>
              <th className="py-4 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                DATE & TIME
              </th>
              <th className="py-4 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                PREVIOUS VALUE
              </th>
              <th className="py-4 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                NEW VALUE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {history.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-xs text-zinc-500 font-medium"
                >
                  No activity history recorded yet.
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  {/* ACTION */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs md:text-sm font-bold text-zinc-900">
                      {item.action}
                    </span>
                  </td>

                  {/* ADMIN */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs text-zinc-700">
                      {item.admin}
                    </span>
                  </td>

                  {/* DATE & TIME */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs text-zinc-500">
                      {item.dateTime}
                    </span>
                  </td>

                  {/* PREVIOUS VALUE */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`text-xs ${
                        item.previousValue === "—"
                          ? "text-zinc-400"
                          : "text-zinc-600"
                      }`}
                    >
                      {item.previousValue}
                    </span>
                  </td>

                  {/* NEW VALUE */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs font-semibold text-zinc-900">
                      {item.newValue}
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
