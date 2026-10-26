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
import { useExams, useUpdateExam } from "../hooks/useExams"
import { ExamFilterState, ApiExam } from "../types/exam.types"
import { useDebounce } from "@/hooks/useDebounce"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export default function ExamListPage() {
  const [filters, setFilters] = React.useState<ExamFilterState>({
    tab: "all",
    search: "",
    type: "all",
    level: "all",
    questions: "all",
    duration: "all",
  })
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const debouncedSearch = useDebounce(filters.search, 400)

  const selectedExamType =
    filters.tab !== "all"
      ? filters.tab === "monthly"
        ? "Monthly"
        : filters.tab === "subject"
        ? "Subject"
        : "Course"
      : filters.type !== "all"
      ? filters.type
      : undefined

  const { data: response, isLoading, isError } = useExams({
    page,
    pageSize,
    search: debouncedSearch,
    examType: selectedExamType,
    level: filters.level,
  })

  const updateExamMutation = useUpdateExam()

  // Modal states
  const [editingExam, setEditingExam] = React.useState<ApiExam | null>(null)
  const [previewingExam, setPreviewingExam] = React.useState<ApiExam | null>(null)

  const handleFilterChange = (key: keyof ExamFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
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
    setPage(1)
    toast.info("Filters reset to default")
  }

  const exams = response?.items || []
  const totalCount = response?.totalCount ?? 0
  const totalPages = response?.totalPages ?? 1

  // Filter logic for extra filters (questions count & duration)
  const filteredExams = React.useMemo(() => {
    return exams.filter((exam) => {
      // Questions count filter
      const qCount =
        exam.questionCount !== undefined
          ? exam.questionCount
          : exam.questionsCount !== undefined
          ? exam.questionsCount
          : exam.questions?.length || 0

      if (filters.questions === "<15" && qCount >= 15) return false
      if (filters.questions === "15-20" && (qCount < 15 || qCount > 20)) return false
      if (filters.questions === "21-30" && (qCount < 21 || qCount > 30)) return false
      if (filters.questions === ">30" && qCount <= 30) return false

      // Duration filter
      const duration = exam.durationMinutes || 0
      if (filters.duration === "<30" && duration >= 30) return false
      if (filters.duration === "30-45" && (duration < 30 || duration > 45)) return false
      if (filters.duration === ">45" && duration <= 45) return false

      return true
    })
  }, [exams, filters.questions, filters.duration])

  // Tab counts
  const counts = React.useMemo(() => {
    return {
      all: totalCount,
      monthly: totalCount,
      subject: totalCount,
      course: totalCount,
    }
  }, [totalCount])

  // Action handlers
  const handleSaveExam = async (examData: Partial<ApiExam>) => {
    if (!editingExam) return
    try {
      await updateExamMutation.mutateAsync({
        examId: editingExam.id,
        data: {
          title: examData.title,
          description: examData.description,
          examType: (examData.examType || examData.type) as any,
          level: examData.level as any,
          educationStage: examData.educationStage,
          academicYear: examData.academicYear,
          term: examData.term,
          month: examData.month,
          subjects: examData.subjects,
          courseId: examData.courseId,
          courseName: examData.courseName,
          durationMinutes: examData.durationMinutes,
          attemptsAllowed: examData.attemptsAllowed,
          passingScore:
            typeof examData.passingScore === "number"
              ? examData.passingScore
              : examData.passingScorePercent,
          status: examData.status,
        },
      })
      toast.success("Exam updated successfully")
      setEditingExam(null)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Exams"
        description="Manage monthly, subject, and course exams, including questions, duration, access, and student results."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">
            Showing{" "}
            <strong className="font-bold text-zinc-900">
              {filteredExams.length}
            </strong>{" "}
            of{" "}
            <strong className="font-bold text-zinc-900">
              {totalCount}
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

        <ExamFilters
          filters={filters}
          counts={counts}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {isLoading ? (
          <LoadingSpinner title="Loading exams..." />
        ) : isError ? (
          <GlobalError />
        ) : (
          <ExamTable
            exams={filteredExams}
            pageSize={pageSize}
            serverPagination={{
              currentPage: page,
              totalPages,
              totalItems: totalCount,
              onPageChange: (newPage) => setPage(newPage),
              pageSizeOptions: [10, 20, 50],
              onPageSizeChange: (newSize) => {
                setPageSize(newSize)
                setPage(1)
              },
            }}
            onEdit={(exam) => setEditingExam(exam)}
          />
        )}
      </main>

      {/* Edit Exam Modal */}
      {editingExam && (
        <ExamFormModal
          isOpen={!!editingExam}
          initialData={editingExam}
          onClose={() => setEditingExam(null)}
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

