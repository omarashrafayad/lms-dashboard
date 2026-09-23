"use client"

import * as React from "react"
import { FileQuestion, Plus, Trash2, Eye, Pencil } from "lucide-react"
import { CourseExamData } from "../../types/course.types"
import { CourseExamBuilder } from "./CourseExamBuilder"
import { ExamPreviewModal } from "@/features/dashboard/lesson/components/add/ExamPreviewModal"
import { toast } from "sonner"

export interface CourseExamTabProps {
  courseId: string
  courseTitle: string
  courseLevel: string
  initialExam?: CourseExamData | null
}

export function CourseExamTab({
  courseId,
  courseTitle,
  courseLevel,
  initialExam,
}: CourseExamTabProps) {
  const [exam, setExam] = React.useState<CourseExamData | null>(initialExam ?? null)
  const [isBuilding, setIsBuilding] = React.useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)

  // Builder mode
  if (isBuilding) {
    return (
      <CourseExamBuilder
        courseTitle={courseTitle}
        courseLevel={courseLevel}
        initialExam={exam}
        onSaveDraft={(newExam) => {
          setExam(newExam)
          setIsBuilding(false)
          toast.success("Exam draft saved")
        }}
        onPublish={(newExam) => {
          setExam(newExam)
          setIsBuilding(false)
          toast.success("Course exam published successfully")
        }}
        onBack={() => setIsBuilding(false)}
      />
    )
  }

  // Published Exam Card State matching Image 2
  if (exam && exam.isPublished) {
    const totalQuestions = exam.questions?.length || 1
    const totalPoints =
      exam.questions?.reduce((sum, q) => sum + (Number(q.points) || 0), 0) || 2

    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-200">
        {/* Header matching Image 2 */}
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
            Course Exam
          </h3>
          <p className="text-xs text-zinc-400 font-normal">
            Final assessment for the complete course — separate from lesson quizzes.
          </p>
        </div>

        {/* Published Exam Card matching Image 2 */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 md:p-8 flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-zinc-900" dir="auto">
                {exam.title || "gds"}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] shadow-2xs">
                <span className="size-1.5 rounded-full bg-[#16A34A]" />
                Published
              </span>
            </div>

            {/* Action Buttons: Delete Exam, Preview Exam, Edit Exam */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setExam(null)
                  toast.success("Exam deleted")
                }}
                className="h-9 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Exam</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="h-9 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="size-3.5 text-zinc-500" />
                <span>Preview Exam</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBuilding(true)}
                className="h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Pencil className="size-3.5" />
                <span>Edit Exam</span>
              </button>
            </div>
          </div>

          {/* 5 Stats Columns matching Image 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-2 border-b border-zinc-100 pb-6">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                TOTAL QUESTIONS
              </span>
              <span className="text-xl font-bold text-zinc-900 tracking-tight">
                {totalQuestions}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                TOTAL POINTS
              </span>
              <span className="text-xl font-bold text-zinc-900 tracking-tight">
                {totalPoints}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                PASSING SCORE
              </span>
              <span className="text-xl font-bold text-zinc-900 tracking-tight">
                {exam.passingScore || 60}%
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                TIME LIMIT
              </span>
              <span className="text-xl font-bold text-zinc-900 tracking-tight">
                {exam.timeLimit || 30} min
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                ATTEMPTS ALLOWED
              </span>
              <span className="text-xl font-bold text-zinc-900 tracking-tight">
                {exam.attemptsAllowed || 1}
              </span>
            </div>
          </div>

          {/* Info Banner matching Image 2 */}
          <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3.5 text-xs text-zinc-600 font-medium">
            Passing Score: <span className="font-bold text-zinc-800">{exam.passingScore || 60}%</span> · Based on Course Level: {courseLevel}
          </div>
        </div>

        {/* Student Preview Modal */}
        <ExamPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          quiz={exam}
          subjectName={courseTitle}
        />
      </div>
    )
  }

  // Empty State matching Previous Image 5
  return (
    <div className="animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-12 md:p-20 flex flex-col items-center justify-center text-center gap-4">
        <div className="size-16 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shadow-2xs">
          <FileQuestion className="size-8 stroke-[1.75]" />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <h3 className="text-base font-bold text-zinc-900 tracking-tight">
            No Course Exam Created
          </h3>
          <p className="text-xs text-zinc-400 font-normal leading-relaxed">
            Every course must have a final exam that students take after completing the course.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsBuilding(true)}
          className="mt-2 h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Create Course Exam</span>
        </button>
      </div>
    </div>
  )
}
