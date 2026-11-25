"use client"

import * as React from "react"
import {
  ClipboardList,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  Paperclip,
  Download,
  Send,
  MessageSquare,
} from "lucide-react"
import { Assignment } from "../types/studentPortal.types"
import { MOCK_STUDENT_ASSIGNMENTS } from "../data/mockStudentData"
import { StudentAssignmentSubmitModal } from "./StudentAssignmentSubmitModal"

export function StudentAssignmentsView() {
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedAssignment, setSelectedAssignment] = React.useState<Assignment | null>(null)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false)

  const filteredAssignments = React.useMemo(() => {
    return MOCK_STUDENT_ASSIGNMENTS.filter((asg) => {
      if (activeTab !== "all" && asg.status !== activeTab) return false
      if (
        searchTerm &&
        !asg.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !asg.subject.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [activeTab, searchTerm])

  const handleOpenSubmit = (asg: Assignment) => {
    setSelectedAssignment(asg)
    setIsSubmitModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
              <ClipboardList className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              Assignments & Homework
            </h1>
          </div>
          <p className="text-xs text-zinc-500">
            Submit coursework problem sets, essays, and laboratory write-ups for personalized teacher correction
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200/70 max-w-fit flex-wrap">
        {[
          { key: "all", label: "All Assignments", count: MOCK_STUDENT_ASSIGNMENTS.length },
          { key: "new", label: "New", count: MOCK_STUDENT_ASSIGNMENTS.filter((a) => a.status === "new").length },
          { key: "in_progress", label: "In Progress", count: MOCK_STUDENT_ASSIGNMENTS.filter((a) => a.status === "in_progress").length },
          { key: "graded", label: "Graded", count: MOCK_STUDENT_ASSIGNMENTS.filter((a) => a.status === "graded").length },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-white text-zinc-950 font-bold shadow-2xs border border-zinc-200/60"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.key ? "bg-brand-orange/20 text-amber-800 font-bold" : "bg-zinc-200 text-zinc-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="flex flex-col gap-4">
        {filteredAssignments.map((asg) => {
          const isGraded = asg.status === "graded"

          return (
            <div
              key={asg.id}
              className={`p-6 rounded-3xl border flex flex-col gap-4 transition-all shadow-2xs hover:shadow-md ${
                isGraded
                  ? "bg-emerald-50/20 border-emerald-200"
                  : asg.status === "new"
                  ? "bg-blue-50/20 border-blue-200 ring-1 ring-blue-300/30"
                  : "bg-white border-zinc-200/80"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800">
                    {asg.subject}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isGraded
                        ? "bg-emerald-100 text-emerald-800"
                        : asg.status === "new"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {asg.status.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="font-bold text-zinc-800">
                    Total Marks: {asg.totalMarks}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-500">
                    <Clock className="size-3.5 text-zinc-400" />
                    Due: {asg.dueDate}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-zinc-900 leading-snug">
                  {asg.title}
                </h3>
                <span className="text-xs text-zinc-400">
                  {asg.course} • Teacher: {asg.teacherName}
                </span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {asg.description}
              </p>

              {/* Instructions and Reference Materials */}
              {asg.referenceFiles && asg.referenceFiles.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[11px] font-semibold text-zinc-500">
                    Teacher Attachments:
                  </span>
                  {asg.referenceFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-zinc-700"
                    >
                      <Paperclip className="size-3 text-zinc-400" />
                      <span>{f.name}</span>
                      <span className="text-[10px] text-zinc-400">({f.size})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Graded Feedback Card */}
              {isGraded && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Graded on {asg.submittedAt}
                    </span>
                    <span className="font-extrabold text-sm text-emerald-800">
                      Score: {asg.gradeObtained} / {asg.totalMarks} Marks
                    </span>
                  </div>
                  <p className="text-emerald-950 font-medium">
                    Feedback: &quot;{asg.teacherFeedback}&quot;
                  </p>
                  {asg.correctionNotes && (
                    <p className="text-emerald-900 text-[11px] opacity-80">
                      Correction Notes: {asg.correctionNotes}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100">
                {!isGraded ? (
                  <button
                    type="button"
                    onClick={() => handleOpenSubmit(asg)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-sm shadow-brand-orange/20 transition-colors cursor-pointer"
                  >
                    <UploadCloud className="size-4" />
                    <span>Upload & Submit Assignment</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenSubmit(asg)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <span>View Submitted File & Notes</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Submit Assignment Modal */}
      <StudentAssignmentSubmitModal
        assignment={selectedAssignment}
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  )
}
