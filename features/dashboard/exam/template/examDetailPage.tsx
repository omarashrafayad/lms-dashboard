"use client"

import * as React from "react"
import {  useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  ExamDetailHeader,
  DetailTabType,
} from "../components/detail/ExamDetailHeader"
import { ExamOverviewTab } from "../components/detail/ExamOverviewTab"
import { ExamStudentsTab } from "../components/detail/ExamStudentsTab"
import { ExamAnalyticsTab } from "../components/detail/ExamAnalyticsTab"
import { ExamActivityHistoryTab } from "../components/detail/ExamActivityHistoryTab"
import { ExamFormModal } from "../components/modal/ExamFormModal"
// import { ExamPreviewModal } from "../components/modal/ExamPreviewModal"
import { useExam, useUpdateExam, useDuplicateExam } from "../hooks/useExams"
import { ApiExam } from "../types/exam.types"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

interface ExamDetailPageProps {
  id: string
}

export default function ExamDetailPage({ id }: ExamDetailPageProps) {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get("tab") as DetailTabType) || "overview"

  const { data: exam, isLoading, isError } = useExam(id)
  const updateExamMutation = useUpdateExam(id)
  const duplicateExamMutation = useDuplicateExam()

  const [activeTab, setActiveTab] = React.useState<DetailTabType>(initialTab)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false)

  const handleUpdateExam = async (updatedFields: Partial<ApiExam>) => {
    if (!exam) return
    try {
      await updateExamMutation.mutateAsync({
        examId: exam.id,
        data: {
          title: updatedFields.title,
          description: updatedFields.description,
          examType: (updatedFields.examType || updatedFields.type) as any,
          level: updatedFields.level as any,
          educationStage: updatedFields.educationStage,
          academicYear: updatedFields.academicYear,
          term: updatedFields.term,
          month: updatedFields.month,
          subjects: updatedFields.subjects,
          courseId: updatedFields.courseId,
          courseName: updatedFields.courseName,
          durationMinutes: updatedFields.durationMinutes,
          attemptsAllowed: updatedFields.attemptsAllowed,
          passingScore:
            typeof updatedFields.passingScore === "number"
              ? updatedFields.passingScore
              : updatedFields.passingScorePercent,
          status: updatedFields.status,
        },
      })
      toast.success("Exam updated successfully")
      setIsEditModalOpen(false)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDuplicate = async () => {
    if (!exam) return
    try {
      const copy = await duplicateExamMutation.mutateAsync(exam.id)
      toast.success(`Exam duplicated: "${copy?.title || exam.title}"`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleArchive = async () => {
    if (!exam) return
    try {
      await updateExamMutation.mutateAsync({
        examId: exam.id,
        data: { status: "Archived" },
      })
      toast.success(`Exam "${exam.title}" archived`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <LoadingSpinner title="Loading exam details..." />
      </div>
    )
  }

  if (isError || !exam) {
    return (
      <div className="flex-1 p-8">
        <GlobalError />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-[1400px] w-full mx-auto pb-24">
        {/* Detail Header */}
        <ExamDetailHeader
          exam={exam}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPreview={() => setIsPreviewModalOpen(true)}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
          onEdit={() => setIsEditModalOpen(true)}
        />

        {activeTab === "overview" && <ExamOverviewTab exam={exam} />}

        {activeTab === "students" && <ExamStudentsTab exam={exam} />}

        {activeTab === "analytics" && <ExamAnalyticsTab exam={exam} />}

        {activeTab === "history" && <ExamActivityHistoryTab exam={exam} />}
      </main>

      {/* Edit Exam Modal */}
      {isEditModalOpen && (
        <ExamFormModal
          isOpen={isEditModalOpen}
          initialData={exam}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateExam}
        />
      )}
    </div>
  )
}

