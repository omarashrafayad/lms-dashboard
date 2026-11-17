"use client"

import * as React from "react"
import { Search, Loader2, Check } from "lucide-react"

export interface ScheduleTeacherStepProps {
  selectedTeacher: any
  onSelectTeacher: (teacher: any) => void
  onClearTeacher: () => void
  teachers: any[]
  isLoadingTeachers: boolean
  isErrorTeachers: boolean
  search: string
  onSearchChange: (value: string) => void
}

export function ScheduleTeacherStep({
  selectedTeacher,
  onSelectTeacher,
  onClearTeacher,
  teachers,
  isLoadingTeachers,
  isErrorTeachers,
  search,
  onSearchChange,
}: ScheduleTeacherStepProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-bold text-zinc-900 tracking-tight">
          Select Teacher
        </h2>
        <p className="text-xs text-zinc-500">
          Choose an instructor to assign to this session based on subject and availability.
        </p>
      </div>

      {selectedTeacher ? (
        <div className="flex items-center justify-between p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center">
              {selectedTeacher.fullName
                ? selectedTeacher.fullName.charAt(0).toUpperCase()
                : "T"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-900">
                {selectedTeacher.fullName || selectedTeacher.name}
              </span>
              <span className="text-xs text-zinc-500">
                {selectedTeacher.subjects?.join(", ") ||
                  selectedTeacher.subject ||
                  selectedTeacher.email ||
                  "Instructor"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearTeacher}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            Change Teacher
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search teachers by name or subject..."
              className="w-full h-11 pl-10 pr-10 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
            {isLoadingTeachers && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-500 animate-spin" />
            )}
          </div>

          <div className="border border-zinc-200 rounded-xl max-h-72 overflow-y-auto divide-y divide-zinc-100 bg-white shadow-2xs">
            {isLoadingTeachers ? (
              <div className="flex items-center justify-center gap-2 py-8 text-zinc-400 text-xs">
                <Loader2 className="size-4 animate-spin text-amber-500" />
                <span>Searching teachers...</span>
              </div>
            ) : isErrorTeachers ? (
              <div className="py-8 px-4 text-center text-xs text-rose-500">
                Failed to load teachers. Please try again.
              </div>
            ) : teachers.length === 0 ? (
              <div className="py-8 px-4 text-center text-xs text-zinc-400">
                {search ? `No teachers found for "${search}"` : "No teachers found."}
              </div>
            ) : (
              teachers.map((teacher: any) => {
                const teacherSubject =
                  teacher.subjects?.join(", ") ||
                  teacher.subject ||
                  teacher.email ||
                  "General"
                return (
                  <button
                    key={teacher.id}
                    type="button"
                    onClick={() => onSelectTeacher(teacher)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-50/50 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {teacher.fullName
                          ? teacher.fullName.charAt(0).toUpperCase()
                          : "T"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-900">
                          {teacher.fullName}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-normal">
                          {teacherSubject}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        teacher.isAvailable !== false
                          ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
                          : "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          teacher.isAvailable !== false
                            ? "bg-[#16A34A]"
                            : "bg-[#D97706]"
                        }`}
                      />
                      {teacher.isAvailable !== false ? "Available" : "Busy"}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
