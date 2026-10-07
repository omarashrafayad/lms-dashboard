"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { CurriculumStructure } from "../components/structure/CurriculumStructure"
import { AddChapterModal } from "../components/structure/AddChapterModal"
import {
  useCurriculumSubjectStructure,
  useCreateChapter,
} from "../hooks/useCurriculum"
import { CurriculumSubject, CreateChapterPayload } from "../types/curriculum.types"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export interface CurriculumStructurePageProps {
  subjectId: string
}

export default function CurriculumStructurePage({
  subjectId,
}: CurriculumStructurePageProps) {
  const { data: structureData, isLoading } =
    useCurriculumSubjectStructure(subjectId)
  const createChapterMutation = useCreateChapter()

  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = React.useState(false)

  const subject: CurriculumSubject =
    structureData?.subject || {
      id: subjectId,
      name: "Curriculum Subject",
      term: "",
    }

  const chapters = structureData?.chapters || []
  

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader title="Curriculum" description="Loading structure..." />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="size-6 text-brand-orange animate-spin" />
        </main>
      </div>
    )
  }

  const handleAddChapterSubmit = async (payload: CreateChapterPayload) => {
    try {
      await createChapterMutation.mutateAsync(payload)
      toast.success("Chapter created successfully!")
      setIsAddChapterModalOpen(false)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const subjectSubtitle = [
    subject.educationStageName,
    subject.gradeName,
    subject.educationSystemName,
    subject.term,
  ]
    .filter(Boolean)
    .join(" • ")

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={subject.name || "Curriculum Subject"}
        description={subjectSubtitle || "Curriculum Structure"}
      />

      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        <CurriculumStructure
          subject={subject}
          chapters={chapters}
          isLoading={isLoading}
          onAddChapter={() => setIsAddChapterModalOpen(true)}
        />
      </main>

      {/* Add Chapter Modal */}
      <AddChapterModal
        open={isAddChapterModalOpen}
        onOpenChange={setIsAddChapterModalOpen}
        subjectId={subject.id || subjectId}
        defaultOrder={chapters.length + 1}
        onAddChapter={handleAddChapterSubmit}
        isSubmitting={createChapterMutation.isPending}
      />
    </div>
  )
}
