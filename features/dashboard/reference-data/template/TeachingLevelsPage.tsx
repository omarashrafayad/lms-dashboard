"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { ReferenceDataTabs } from "../components/ReferenceDataTabs"
import { ReferenceDataMetrics } from "../components/ReferenceDataMetrics"
import { ReferenceDataTable } from "../components/ReferenceDataTable"
import { ReferenceDataModal } from "../components/ReferenceDataModal"
import {
  useTeachingLevels,
  useCreateTeachingLevel,
  useUpdateTeachingLevel,
  useDeleteTeachingLevel,
  useAcademicStages,
  useEducationSystems,
  useGrades,
  useGenders,
  useTerms,
} from "../hooks/useReferenceData"
import {
  TeachingLevel,
  CreateReferenceDataPayload,
} from "../types/referenceData.types"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export default function TeachingLevelsPage() {
  const { data: teachingLevels = [], isLoading } = useTeachingLevels()
  const { data: stages = [] } = useAcademicStages()
  const { data: systems = [] } = useEducationSystems()
  const { data: grades = [] } = useGrades()
  const { data: genders = [] } = useGenders()
  const { data: terms = [] } = useTerms()

  const createMutation = useCreateTeachingLevel()
  const updateMutation = useUpdateTeachingLevel()
  const deleteMutation = useDeleteTeachingLevel()

  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<TeachingLevel | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const activeCount = teachingLevels.filter((l) => l.isActive !== false).length
  const inactiveCount = teachingLevels.filter((l) => l.isActive === false).length

  const handleOpenAdd = () => {
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (level: TeachingLevel) => {
    setSelectedItem(level)
    setModalOpen(true)
  }

  const handleSubmit = async (data: CreateReferenceDataPayload) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({
          id: selectedItem.id,
          data,
        })
        toast.success(`Teaching Level "${data.name}" updated successfully`)
      } else {
        await createMutation.mutateAsync(data)
        toast.success(`Teaching Level "${data.name}" added successfully`)
      }
      setModalOpen(false)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteMutation.mutateAsync(id)
      toast.success("Teaching Level deleted successfully")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Teaching Levels"
        description="Configure teacher specialization levels, seniority ranks, and instructional tiers."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20">
        {/* Navigation Tabs */}
        <ReferenceDataTabs
          counts={{
            academicStages: stages.length,
            educationSystems: systems.length,
            grades: grades.length,
            genders: genders.length,
            terms: terms.length,
            teachingLevels: teachingLevels.length,
          }}
        />

        {/* 3 Metric Cards */}
        <ReferenceDataMetrics
          total={teachingLevels.length}
          active={activeCount}
          inactive={inactiveCount}
          itemLabel="Teaching Levels"
        />

        {/* Reference Data Table */}
        <ReferenceDataTable<TeachingLevel>
          data={teachingLevels}
          isLoading={isLoading}
          entityName="Teaching Level"
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </main>

      {/* Add / Edit Modal */}
      <ReferenceDataModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        itemToEdit={selectedItem}
        entityName="Teaching Level"
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}

