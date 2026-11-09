"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { ReferenceDataTabs } from "../components/ReferenceDataTabs"
import { ReferenceDataMetrics } from "../components/ReferenceDataMetrics"
import { ReferenceDataTable } from "../components/ReferenceDataTable"
import { ReferenceDataModal } from "../components/ReferenceDataModal"
import {
  useTerms,
  useCreateTerm,
  useUpdateTerm,
  useDeleteTerm,
  useAcademicStages,
  useEducationSystems,
  useGrades,
  useGenders,
  useTeachingLevels,
} from "../hooks/useReferenceData"
import {
  Term,
  CreateReferenceDataPayload,
} from "../types/referenceData.types"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export default function TermsPage() {
  const { data: terms = [], isLoading } = useTerms()
  const { data: stages = [] } = useAcademicStages()
  const { data: systems = [] } = useEducationSystems()
  const { data: grades = [] } = useGrades()
  const { data: genders = [] } = useGenders()
  const { data: teachingLevels = [] } = useTeachingLevels()

  const createMutation = useCreateTerm()
  const updateMutation = useUpdateTerm()
  const deleteMutation = useDeleteTerm()

  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<Term | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const activeCount = terms.filter((t) => t.isActive !== false).length
  const inactiveCount = terms.filter((t) => t.isActive === false).length

  const handleOpenAdd = () => {
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (term: Term) => {
    setSelectedItem(term)
    setModalOpen(true)
  }

  const handleSubmit = async (data: CreateReferenceDataPayload) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({
          id: selectedItem.id,
          data,
        })
        toast.success(`Academic Term "${data.name}" updated successfully`)
      } else {
        await createMutation.mutateAsync(data)
        toast.success(`Academic Term "${data.name}" added successfully`)
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
      toast.success("Academic Term deleted successfully")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Academic Terms"
        description="Define and manage academic semesters and terms (e.g. Term 1, Term 2, Summer Term)."
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
          total={terms.length}
          active={activeCount}
          inactive={inactiveCount}
          itemLabel="Terms"
        />

        {/* Reference Data Table */}
        <ReferenceDataTable<Term>
          data={terms}
          isLoading={isLoading}
          entityName="Term"
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
        entityName="Academic Term"
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}

