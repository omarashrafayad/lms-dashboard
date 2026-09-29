"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { ReferenceDataTabs } from "../components/ReferenceDataTabs"
import { ReferenceDataMetrics } from "../components/ReferenceDataMetrics"
import { ReferenceDataTable } from "../components/ReferenceDataTable"
import { ReferenceDataModal } from "../components/ReferenceDataModal"
import {
  useAcademicStages,
  useCreateAcademicStage,
  useUpdateAcademicStage,
  useDeleteAcademicStage,
  useEducationSystems,
  useGrades,
  useGenders,
} from "../hooks/useReferenceData"
import {
  AcademicStage,
  CreateReferenceDataPayload,
} from "../types/referenceData.types"
import { toast } from "sonner"

export default function AcademicStagesPage() {
  const { data: stages = [], isLoading } = useAcademicStages()
  const { data: systems = [] } = useEducationSystems()
  const { data: grades = [] } = useGrades()
  const { data: genders = [] } = useGenders()

  const createMutation = useCreateAcademicStage()
  const updateMutation = useUpdateAcademicStage()
  const deleteMutation = useDeleteAcademicStage()

  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<AcademicStage | null>(
    null
  )
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const activeCount = stages.filter((s) => s.isActive !== false).length
  const inactiveCount = stages.filter((s) => s.isActive === false).length

  const handleOpenAdd = () => {
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (stage: AcademicStage) => {
    setSelectedItem(stage)
    setModalOpen(true)
  }

  const handleSubmit = async (data: CreateReferenceDataPayload) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({
          id: selectedItem.id,
          data,
        })
        toast.success(`Academic Stage "${data.name}" updated successfully`)
      } else {
        await createMutation.mutateAsync(data)
        toast.success(`Academic Stage "${data.name}" added successfully`)
      }
      setModalOpen(false)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while saving"
      toast.error(msg)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteMutation.mutateAsync(id)
      toast.success("Academic Stage deleted successfully")
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete academic stage"
      toast.error(msg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Academic Stages"
        description="Define and manage primary, preparatory, secondary and other academic stages."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20">
        {/* Navigation Tabs */}
        <ReferenceDataTabs
          counts={{
            academicStages: stages.length,
            educationSystems: systems.length,
            grades: grades.length,
            genders: genders.length,
          }}
        />

        {/* Metrics Cards */}
        <ReferenceDataMetrics
          total={stages.length}
          active={activeCount}
          inactive={inactiveCount}
          itemLabel="Academic Stages"
        />

        {/* Stages Table */}
        <ReferenceDataTable<AcademicStage>
          data={stages}
          isLoading={isLoading}
          entityName="Academic Stage"
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />

        {/* Add/Edit Modal */}
        <ReferenceDataModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          itemToEdit={selectedItem}
          entityName="Academic Stage"
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </main>
    </div>
  )
}
