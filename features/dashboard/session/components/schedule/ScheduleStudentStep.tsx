"use client"

import * as React from "react"
import { Search, Loader2, User, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ScheduleStudentStepProps {
  selectedStudent: any
  onSelectStudent: (student: any) => void
  onClearStudent: () => void
  students: any[]
  isLoadingStudents: boolean
  isErrorStudents: boolean
  search: string
  onSearchChange: (value: string) => void
}

export function ScheduleStudentStep({
  selectedStudent,
  onSelectStudent,
  onClearStudent,
  students,
  isLoadingStudents,
  isErrorStudents,
  search,
  onSearchChange,
}: ScheduleStudentStepProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-bold text-zinc-900 tracking-tight">
          Select Student
        </h2>
        <p className="text-xs text-zinc-500">
          Search and choose the student for this session from the backend database.
        </p>
      </div>

      {selectedStudent ? (
        <div className="flex items-center justify-between p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center">
              {selectedStudent.fullName
                ? selectedStudent.fullName.charAt(0).toUpperCase()
                : "S"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-900">
                {selectedStudent.fullName || selectedStudent.name}
              </span>
              <span className="text-xs text-zinc-500">
                {[
                  selectedStudent.academicStage,
                  selectedStudent.grade,
                  selectedStudent.educationSystem,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Active Student"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearStudent}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            Change Student
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
              placeholder="Search students by name, email, or code..."
              className="w-full h-11 pl-10 pr-10 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
            {isLoadingStudents && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-500 animate-spin" />
            )}
          </div>

          <div className="border border-zinc-200 rounded-xl max-h-72 overflow-y-auto divide-y divide-zinc-100 bg-white shadow-2xs">
            {isLoadingStudents ? (
              <div className="flex items-center justify-center gap-2 py-8 text-zinc-400 text-xs">
                <Loader2 className="size-4 animate-spin text-amber-500" />
                <span>Searching students...</span>
              </div>
            ) : isErrorStudents ? (
              <div className="py-8 px-4 text-center text-xs text-rose-500">
                Failed to load students. Please try again.
              </div>
            ) : students.length === 0 ? (
              <div className="py-8 px-4 text-center text-xs text-zinc-400">
                {search ? `No students found for "${search}"` : "No students found."}
              </div>
            ) : (
              students.map((student: any) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => onSelectStudent(student)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-50/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-zinc-100 text-zinc-600 font-bold text-xs flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                      {student.fullName ? student.fullName.charAt(0).toUpperCase() : "S"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900 group-hover:text-amber-700 transition-colors">
                        {student.fullName}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-normal">
                        {[student.academicStage, student.grade, student.email]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 group-hover:bg-amber-100 px-3 py-1 rounded-lg">
                    Select
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
