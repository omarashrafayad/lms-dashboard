"use client"

import * as React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { ExamFilters } from "../components/list/ExamFilters"
import { ExamTable } from "../components/list/ExamTable"
import { ExamFormModal } from "../components/modal/ExamFormModal"
import { ExamPreviewModal } from "../components/modal/ExamPreviewModal"
import { useExamStore } from "@/stores/useExamStore"
import { ExamFilterState, ExamItem } from "../types/exam.types"

export default function ExamListPage() {
  const { exams, addExam, updateExam, duplicateExam, archiveExam } =
    useExamStore()

  const [filters, setFilters] = React.useState<ExamFilterState>({
    tab: "all",
    search: "",
    type: "all",
    level: "all",
    questions: "all",
    duration: "all",
  })

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [editingExam, setEditingExam] = React.useState<ExamItem | null>(null)
  const [previewingExam, setPreviewingExam] = React.useState<ExamItem | null>(null)

  const handleFilterChange = (key: keyof ExamFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      tab: "all",
      search: "",
      type: "all",
      level: "all",
      questions: "all",
      duration: "all",
    })
    toast.info("Filters reset to default")
  }

  // Filter logic
  const filteredExams = exams.filter((exam) => {
    // Tab filter
    if (filters.tab === "monthly" && exam.type !== "Monthly") return false
    if (filters.tab === "subject" && exam.type !== "Subject") return false
    if (filters.tab === "course" && exam.type !== "Course") return false

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      const matchTitle = exam.title.toLowerCase().includes(q)
      const matchSubject = exam.subject.toLowerCase().includes(q)
      const matchYear = exam.academicYear.toLowerCase().includes(q)
      if (!matchTitle && !matchSubject && !matchYear) return false
    }

    // Type filter
    if (filters.type !== "all" && exam.type !== filters.type) return false

    // Level filter
    if (filters.level !== "all" && exam.level !== filters.level) return false

    // Questions count filter
    if (filters.questions === "<15" && exam.questionsCount >= 15) return false
    if (
      filters.questions === "15-20" &&
      (exam.questionsCount < 15 || exam.questionsCount > 20)
    )
      return false
    if (
      filters.questions === "21-30" &&
      (exam.questionsCount < 21 || exam.questionsCount > 30)
    )
      return false
    if (filters.questions === ">30" && exam.questionsCount <= 30) return false

    // Duration filter
    if (filters.duration === "<30" && exam.durationMinutes >= 30) return false
    if (
      filters.duration === "30-45" &&
      (exam.durationMinutes < 30 || exam.durationMinutes > 45)
    )
      return false
    if (filters.duration === ">45" && exam.durationMinutes <= 45) return false

    return true
  })

  // Tab counts
  const counts = {
    all: exams.length,
    monthly: exams.filter((e) => e.type === "Monthly").length,
    subject: exams.filter((e) => e.type === "Subject").length,
    course: exams.filter((e) => e.type === "Course").length,
  }

  // Action handlers
  const handleSaveExam = (examData: Partial<ExamItem>) => {
    if (editingExam) {
      updateExam(editingExam.id, examData)
      toast.success("Exam updated successfully")
      setEditingExam(null)
    } else {
      addExam(examData as any)
      toast.success("Exam created successfully")
      setIsAddModalOpen(false)
    }
  }

  const handleDuplicate = (exam: ExamItem) => {
    const copy = duplicateExam(exam.id)
    if (copy) {
      toast.success(`Exam duplicated: "${copy.title}"`)
    }
  }

  const handleArchive = (exam: ExamItem) => {
    archiveExam(exam.id)
    toast.success(`Exam "${exam.title}" archived`)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Page Header matching Image 1 */}
      <PageHeader
        title="Exams"
        description="Manage monthly, subject, and course exams, including questions, duration, access, and student results."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-20">
        {/* Top Action Row matching Image 1: Showing N exams & + Add Exam button */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">
            Showing{" "}
            <strong className="font-bold text-zinc-900">
              {filteredExams.length}
            </strong>{" "}
            exams
          </span>

          <Link
            href="/academic/exams/add"
            className="h-10 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Exam</span>
          </Link>
        </div>

        {/* Filter Bar matching Image 1 */}
        <ExamFilters
          filters={filters}
          counts={counts}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Exams Table matching Image 1 */}
        <ExamTable
          exams={filteredExams}
          onEdit={(exam) => setEditingExam(exam)}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
        />
      </main>

      {/* Add / Edit Exam Modal */}
      {(isAddModalOpen || editingExam) && (
        <ExamFormModal
          isOpen={isAddModalOpen || !!editingExam}
          initialData={editingExam}
          onClose={() => {
            setIsAddModalOpen(false)
            setEditingExam(null)
          }}
          onSave={handleSaveExam}
        />
      )}

      {/* Preview Exam Modal */}
      {previewingExam && (
        <ExamPreviewModal
          isOpen={!!previewingExam}
          exam={previewingExam}
          onClose={() => setPreviewingExam(null)}
        />
      )}
    </div>
  )
}
