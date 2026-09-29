"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { CurriculumStructure } from "../components/structure/CurriculumStructure"
import { SubjectModal } from "../components/SubjectModal"
import { AddChapterModal } from "../components/structure/AddChapterModal"
import {
  useCurriculumSubject,
  useUpdateCurriculumSubject,
} from "../hooks/useCurriculum"
import { CreateSubjectPayload } from "../types/curriculum.types"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export interface CurriculumStructurePageProps {
  subjectId: string
}

export default function CurriculumStructurePage({
  subjectId,
}: CurriculumStructurePageProps) {
  const { data, isLoading } = useCurriculumSubject(subjectId)
  const updateMutation = useUpdateCurriculumSubject()

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = React.useState(false)
  const [localChapters, setLocalChapters] = React.useState(data?.chapters || [])

  React.useEffect(() => {
    if (data?.chapters) {
      setLocalChapters(data.chapters)
    }
  }, [data?.chapters])

  if (isLoading || !data?.subject) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader title="Curriculum" description="Loading structure..." />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="size-6 text-brand-orange animate-spin" />
        </main>
      </div>
    )
  }

  const { subject } = data

  const handleEditSubmit = async (payload: CreateSubjectPayload) => {
    try {
      await updateMutation.mutateAsync({ id: subject.id, data: payload })
      toast.success("Subject updated successfully!")
      setIsEditModalOpen(false)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Failed to update subject"
      toast.error(msg)
    }
  }

  const handleAddChapter = (title: string) => {
    const newChapterIndex = localChapters.length + 1
    const newChapter = {
      id: `ch-${Date.now()}`,
      subjectId: subject.id,
      title,
      order: newChapterIndex,
      unitsCount: 0,
      lessonsCount: 0,
      units: [],
    }
    setLocalChapters((prev) => [...prev, newChapter])
  }

  const subjectSubtitle = [
    subject.educationStageName || subject.stage,
    subject.gradeName || subject.year,
    subject.educationSystemName || subject.system,
    subject.term,
  ]
    .filter(Boolean)
    .join(" • ")

  return (
    <div className="flex flex-col min-h-full">
      {/* Header matching Screenshot 2 */}
      <PageHeader
        title={subject.name}
        description={subjectSubtitle}
      />

      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        <CurriculumStructure
          subject={subject}
          chapters={localChapters}
          onEditSubject={() => setIsEditModalOpen(true)}
          onAddChapter={() => setIsAddChapterModalOpen(true)}
        />
      </main>

      {/* Edit Subject Modal */}
      <SubjectModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        subjectToEdit={subject}
        onSubmit={handleEditSubmit}
        isSubmitting={updateMutation.isPending}
      />

      {/* Add Chapter Modal */}
      <AddChapterModal
        open={isAddChapterModalOpen}
        onOpenChange={setIsAddChapterModalOpen}
        onAddChapter={handleAddChapter}
      />
    </div>
  )
}
