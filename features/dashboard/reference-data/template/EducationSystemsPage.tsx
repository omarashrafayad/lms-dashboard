"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { ReferenceDataTabs } from "../components/ReferenceDataTabs"
import { ReferenceDataMetrics } from "../components/ReferenceDataMetrics"
import { ReferenceDataTable } from "../components/ReferenceDataTable"
import { ReferenceDataModal } from "../components/ReferenceDataModal"
import {
  useEducationSystems,
  useCreateEducationSystem,
  useUpdateEducationSystem,
  useDeleteEducationSystem,
  useAcademicStages,
  useGrades,
  useGenders,
} from "../hooks/useReferenceData"
import {
  EducationSystem,
  CreateReferenceDataPayload,
} from "../types/referenceData.types"
import { toast } from "sonner"

export default function EducationSystemsPage() {
  const { data: systems = [], isLoading } = useEducationSystems()
  const { data: stages = [] } = useAcademicStages()
  const { data: grades = [] } = useGrades()
  const { data: genders = [] } = useGenders()

  const createMutation = useCreateEducationSystem()
  const updateMutation = useUpdateEducationSystem()
  const deleteMutation = useDeleteEducationSystem()

  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] =
    React.useState<EducationSystem | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const activeCount = systems.filter((s) => s.isActive !== false).length
  const inactiveCount = systems.filter((s) => s.isActive === false).length

  const handleOpenAdd = () => {
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (system: EducationSystem) => {
    setSelectedItem(system)
    setModalOpen(true)
  }

  const handleSubmit = async (data: CreateReferenceDataPayload) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({
          id: selectedItem.id,
          data,
        })
        toast.success(`Education System "${data.name}" updated successfully`)
      } else {
        await createMutation.mutateAsync(data)
        toast.success(`Education System "${data.name}" added successfully`)
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
      toast.success("Education System deleted successfully")
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete education system"
      toast.error(msg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Education Systems"
        description="Configure educational curricula and systems like National, IGCSE, American, IB."
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
          total={systems.length}
          active={activeCount}
          inactive={inactiveCount}
          itemLabel="Education Systems"
        />

        {/* Systems Table */}
        <ReferenceDataTable<EducationSystem>
          data={systems}
          isLoading={isLoading}
          entityName="Education System"
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
          entityName="Education System"
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </main>
    </div>
  )
}
