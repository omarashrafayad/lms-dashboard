"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { ReferenceDataTabs } from "../components/ReferenceDataTabs"
import { ReferenceDataMetrics } from "../components/ReferenceDataMetrics"
import { ReferenceDataTable } from "../components/ReferenceDataTable"
import { GradeModal } from "../components/GradeModal"
import {
  useGrades,
  useCreateGrade,
  useUpdateGrade,
  useDeleteGrade,
  useAcademicStages,
  useEducationSystems,
  useGenders,
} from "../hooks/useReferenceData"
import { Grade, CreateGradePayload } from "../types/referenceData.types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UniTableColumn } from "@/components/shared/uniTable"
import { toast } from "sonner"

export default function GradesPage() {
  const [selectedStageFilter, setSelectedStageFilter] =
    React.useState<string>("all")

  // If filter is "all", fetch all grades, otherwise filter by stage
  const { data: grades = [], isLoading: gradesLoading } = useGrades(
    selectedStageFilter === "all" ? undefined : selectedStageFilter
  )
  const { data: stages = [], isLoading: stagesLoading } = useAcademicStages()
  const { data: systems = [] } = useEducationSystems()
  const { data: genders = [] } = useGenders()

  const createMutation = useCreateGrade()
  const updateMutation = useUpdateGrade()
  const deleteMutation = useDeleteGrade()

  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<Grade | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  // Map stage IDs to names for quick lookup
  const stageNameMap = React.useMemo(() => {
    const map = new Map<string, string>()
    stages.forEach((s) => map.set(s.id, s.name))
    return map
  }, [stages])

  const activeCount = grades.filter((g) => g.isActive !== false).length
  const inactiveCount = grades.filter((g) => g.isActive === false).length

  const handleOpenAdd = () => {
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (grade: Grade) => {
    setSelectedItem(grade)
    setModalOpen(true)
  }

  const handleSubmit = async (data: CreateGradePayload) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({
          id: selectedItem.id,
          data,
        })
        toast.success(`Grade "${data.name}" updated successfully`)
      } else {
        await createMutation.mutateAsync(data)
        toast.success(`Grade "${data.name}" added successfully`)
      }
      setModalOpen(false)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while saving grade"
      toast.error(msg)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteMutation.mutateAsync(id)
      toast.success("Grade deleted successfully")
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete grade"
      toast.error(msg)
    } finally {
      setDeletingId(null)
    }
  }

  // Extra column for Academic Stage
  const extraColumns: UniTableColumn<Grade>[] = [
    {
      id: "academicStage",
      header: "ACADEMIC STAGE",
      headerClassName:
        "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
      cell: (_, grade) => {
        const stageName =
          grade.academicStage?.name ||
          stageNameMap.get(grade.academicStageId) ||
          "Unknown Stage"
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50/80 text-amber-800 border border-amber-200/50">
            {stageName}
          </span>
        )
      },
    },
  ]

  // Filter dropdown for Academic Stage
  const stageFilterSlot = (
    <div className="w-full sm:w-56">
      <Select
        value={selectedStageFilter}
        onValueChange={(val) => setSelectedStageFilter(val || "all")}
        disabled={stagesLoading}
      >
        <SelectTrigger className="w-full h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-100/50">
          <SelectValue placeholder="All Academic Stages">
            {(val: string | null) => {
              if (!val || val === "all") return "All Academic Stages"
              const stg = stages.find((s) => s.id === val)
              return stg ? stg.name : "All Academic Stages"
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="z-[80] rounded-xl max-h-60 overflow-y-auto">
          <SelectItem value="all">All Academic Stages</SelectItem>
          {stages.map((stg) => (
            <SelectItem key={stg.id} value={stg.id}>
              {stg.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Grades"
        description="Manage grade levels and year groups mapped to academic stages."
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
          total={grades.length}
          active={activeCount}
          inactive={inactiveCount}
          itemLabel="Grades"
        />

        {/* Grades Table */}
        <ReferenceDataTable<Grade>
          data={grades}
          isLoading={gradesLoading}
          entityName="Grade"
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          extraColumns={extraColumns}
          extraFilterSlot={stageFilterSlot}
          deletingId={deletingId}
        />

        {/* Add/Edit Grade Modal */}
        <GradeModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          gradeToEdit={selectedItem}
          defaultAcademicStageId={
            selectedStageFilter !== "all" ? selectedStageFilter : undefined
          }
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </main>
    </div>
  )
}
