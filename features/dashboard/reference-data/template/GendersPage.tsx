"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { ReferenceDataTabs } from "../components/ReferenceDataTabs"
import { ReferenceDataMetrics } from "../components/ReferenceDataMetrics"
import { ReferenceDataTable } from "../components/ReferenceDataTable"
import { ReferenceDataModal } from "../components/ReferenceDataModal"
import {
  useGenders,
  useCreateGender,
  useUpdateGender,
  useDeleteGender,
  useAcademicStages,
  useEducationSystems,
  useGrades,
} from "../hooks/useReferenceData"
import { Gender, CreateReferenceDataPayload } from "../types/referenceData.types"
import { toast } from "sonner"

export default function GendersPage() {
  const { data: genders = [], isLoading } = useGenders()
  const { data: stages = [] } = useAcademicStages()
  const { data: systems = [] } = useEducationSystems()
  const { data: grades = [] } = useGrades()

  const createMutation = useCreateGender()
  const updateMutation = useUpdateGender()
  const deleteMutation = useDeleteGender()

  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<Gender | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const activeCount = genders.filter((g) => g.isActive !== false).length
  const inactiveCount = genders.filter((g) => g.isActive === false).length

  const handleOpenAdd = () => {
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (gender: Gender) => {
    setSelectedItem(gender)
    setModalOpen(true)
  }

  const handleSubmit = async (data: CreateReferenceDataPayload) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({
          id: selectedItem.id,
          data,
        })
        toast.success(`Gender "${data.name}" updated successfully`)
      } else {
        await createMutation.mutateAsync(data)
        toast.success(`Gender "${data.name}" added successfully`)
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
      toast.success("Gender record deleted successfully")
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete gender record"
      toast.error(msg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Genders"
        description="Manage gender definitions utilized in student, teacher, and guardian profiles."
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
          total={genders.length}
          active={activeCount}
          inactive={inactiveCount}
          itemLabel="Genders"
        />

        {/* Genders Table */}
        <ReferenceDataTable<Gender>
          data={genders}
          isLoading={isLoading}
          entityName="Gender"
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
          entityName="Gender"
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </main>
    </div>
  )
}
