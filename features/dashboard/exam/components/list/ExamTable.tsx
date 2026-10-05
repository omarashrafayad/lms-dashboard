"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Pencil, Copy, Archive } from "lucide-react"
import { ExamItem } from "../../types/exam.types"
import {
  ExamLevelBadge,
  ExamStatusBadge,
  ExamTypeBadge,
} from "../common/ExamBadges"
import { cn } from "@/lib/utils"

interface ExamTableProps {
  exams: ExamItem[]
  onEdit?: (exam: ExamItem) => void
  onDuplicate?: (exam: ExamItem) => void
  onArchive?: (exam: ExamItem) => void
}

export function ExamTable({
  exams,
  onEdit,
  onDuplicate,
  onArchive,
}: ExamTableProps) {
  const router = useRouter()
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-row-menu]")) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/70 border-b border-zinc-200/80">
              <th className="py-4 px-6 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                EXAM
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                TYPE
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                LEVEL
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                SUBJECT / COURSE
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                QUESTIONS
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                DURATION
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                STUDENTS
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                PASS RATE
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                STATUS
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                LAST UPDATED
              </th>
              <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-zinc-400 uppercase text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {exams.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="py-12 text-center text-xs text-zinc-500 font-medium"
                >
                  No exams found matching the filters.
                </td>
              </tr>
            ) : (
              exams.map((exam) => {
                const subtext = exam.month
                  ? `${exam.academicYear} · ${exam.month}`
                  : exam.academicYear

                return (
                  <tr
                    key={exam.id}
                    onClick={() => router.push(`/academic/exams/${exam.slug || exam.id}`)}
                    className="hover:bg-zinc-50/60 transition-colors group cursor-pointer"
                  >
                    {/* EXAM TITLE */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                          {exam.title}
                        </span>
                        <span className="text-xs text-zinc-400 mt-0.5">
                          {subtext}
                        </span>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <ExamTypeBadge type={exam.type} />
                    </td>

                    {/* LEVEL */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <ExamLevelBadge level={exam.level} />
                    </td>

                    {/* SUBJECT / COURSE */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-zinc-700">
                        {exam.subject}
                      </span>
                    </td>

                    {/* QUESTIONS */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-900 leading-tight">
                          {exam.questionsCount}
                        </span>
                        <span className="text-[11px] text-zinc-400 leading-tight">
                          Questions
                        </span>
                      </div>
                    </td>

                    {/* DURATION */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-zinc-700">
                        {exam.duration}
                      </span>
                    </td>

                    {/* STUDENTS */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-900 leading-tight">
                          {exam.studentsCount}
                        </span>
                        <span className="text-[11px] text-zinc-400 leading-tight">
                          Students
                        </span>
                      </div>
                    </td>

                    {/* PASS RATE */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-zinc-700">
                        {exam.passRate}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <ExamStatusBadge status={exam.status} />
                    </td>

                    {/* LAST UPDATED */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs text-zinc-500 font-normal">
                        {exam.lastUpdated}
                      </span>
                    </td>

                    {/* ROW ACTIONS */}
                    <td
                      className="py-4 px-4 whitespace-nowrap text-right relative"
                      onClick={(e) => e.stopPropagation()}
                      data-row-menu
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenuId(
                            activeMenuId === exam.id ? null : exam.id
                          )
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === exam.id && (
                        <div className="absolute right-4 top-12 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg z-30 p-1.5 flex flex-col gap-0.5 text-left animate-in fade-in-50 zoom-in-95">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuId(null)
                              router.push(`/academic/exams/${exam.slug || exam.id}`)
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                          >
                            <Eye className="size-3.5 text-zinc-400" />
                            <span>View Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuId(null)
                              router.push(`/academic/exams/${exam.slug || exam.id}/preview`)
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                          >
                            <Eye className="size-3.5 text-zinc-400" />
                            <span>Student Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuId(null)
                              onEdit?.(exam)
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                          >
                            <Pencil className="size-3.5 text-zinc-400" />
                            <span>Edit Exam</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuId(null)
                              onDuplicate?.(exam)
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                          >
                            <Copy className="size-3.5 text-zinc-400" />
                            <span>Duplicate</span>
                          </button>

                          <div className="h-px bg-zinc-100 my-0.5" />

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuId(null)
                              onArchive?.(exam)
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Archive className="size-3.5 text-rose-500" />
                            <span>Archive</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
