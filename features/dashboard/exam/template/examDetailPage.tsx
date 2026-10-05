"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  ExamDetailHeader,
  DetailTabType,
} from "../components/detail/ExamDetailHeader"
import { ExamOverviewTab } from "../components/detail/ExamOverviewTab"
import { ExamQuestionsTab } from "../components/detail/ExamQuestionsTab"
import { ExamStudentsTab } from "../components/detail/ExamStudentsTab"
import { ExamAnalyticsTab } from "../components/detail/ExamAnalyticsTab"
import { ExamActivityHistoryTab } from "../components/detail/ExamActivityHistoryTab"
import { ExamFormModal } from "../components/modal/ExamFormModal"
import { ExamPreviewModal } from "../components/modal/ExamPreviewModal"
import { useExamStore } from "@/stores/useExamStore"
import { ExamItem } from "../types/exam.types"
import { initialExamsMockData } from "../data/examMockData"

interface ExamDetailPageProps {
  id: string
}

export default function ExamDetailPage({ id }: ExamDetailPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get("tab") as DetailTabType) || "overview"

  const { getExamByIdOrSlug, updateExam, duplicateExam, archiveExam } =
    useExamStore()

  // Find exam or fallback to the Math October Monthly Exam (Image 2-5)
  const exam = getExamByIdOrSlug(id) || initialExamsMockData[0]

  const [activeTab, setActiveTab] = React.useState<DetailTabType>(initialTab)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false)

  const handleUpdateExam = (updatedFields: Partial<ExamItem>) => {
    updateExam(exam.id, updatedFields)
    toast.success("Exam updated successfully")
    setIsEditModalOpen(false)
  }

  const handleDuplicate = () => {
    const copy = duplicateExam(exam.id)
    if (copy) {
      toast.success(`Exam duplicated: "${copy.title}"`)
    }
  }

  const handleArchive = () => {
    archiveExam(exam.id)
    toast.success(`Exam "${exam.title}" archived`)
  }

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-[1400px] w-full mx-auto pb-24">
        {/* Detail Header matching Images 2, 3, 4, 5 */}
        <ExamDetailHeader
          exam={exam}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPreview={() => setIsPreviewModalOpen(true)}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
          onEdit={() => setIsEditModalOpen(true)}
        />

        {/* Tab 1: Overview matching Image 2 */}
        {activeTab === "overview" && <ExamOverviewTab exam={exam} />}

        {/* Tab 2: Questions */}
        {activeTab === "questions" && (
          <ExamQuestionsTab
            exam={exam}
            onAddQuestion={() => setIsEditModalOpen(true)}
          />
        )}

        {/* Tab 3: Students & Results matching Image 3 */}
        {activeTab === "students" && <ExamStudentsTab exam={exam} />}

        {/* Tab 4: Analytics matching Image 4 */}
        {activeTab === "analytics" && <ExamAnalyticsTab exam={exam} />}

        {/* Tab 5: Activity History matching Image 5 */}
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

      {/* Preview Exam Modal */}
      {isPreviewModalOpen && (
        <ExamPreviewModal
          isOpen={isPreviewModalOpen}
          exam={exam}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}
    </div>
  )
}
