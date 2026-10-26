"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { CurriculumFilters } from "../components/CurriculumFilters"
import { CurriculumTable } from "../components/CurriculumTable"
import { SubjectModal } from "../components/SubjectModal"
import {
  useCurriculumSubjects,
  useCreateCurriculumSubject,
  useUpdateCurriculumSubject,
  useDeleteCurriculumSubject,
} from "../hooks/useCurriculum"
import {
  CurriculumSubject,
  SubjectFilterState,
  CreateSubjectPayload,
} from "../types/curriculum.types"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/useDebounce"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

const initialFilters: SubjectFilterState = {
  search: "",
  stage: "all",
  year: "all",
  system: "all",
  term: "all",
  subject: "all",
}

export default function CurriculumListPage() {
  const [filters, setFilters] = React.useState<SubjectFilterState>(initialFilters)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [subjectToEdit, setSubjectToEdit] = React.useState<CurriculumSubject | null>(null)

  const debouncedSearch = useDebounce(filters.search, 400)

  const { data: response, isLoading } = useCurriculumSubjects({
    page,
    pageSize,
    search: debouncedSearch,
    stage: filters.stage,
    year: filters.year,
    system: filters.system,
    term: filters.term,
    subject: filters.subject,
  })

  const subjects = response?.items || []
  const totalCount = response?.totalCount ?? 0
  const totalPages = response?.totalPages ?? 1

  const createMutation = useCreateCurriculumSubject()
  const updateMutation = useUpdateCurriculumSubject()
  const deleteMutation = useDeleteCurriculumSubject()

  const handleFilterChange = (updated: Partial<SubjectFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
    setPage(1)
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
    setPage(1)
  }

  const handleOpenAddModal = () => {
    setSubjectToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (subject: CurriculumSubject) => {
    setSubjectToEdit(subject)
    setIsModalOpen(true)
  }

  const handleModalSubmit = async (payload: CreateSubjectPayload) => {
    try {
      if (subjectToEdit) {
        await updateMutation.mutateAsync({ id: subjectToEdit.id, data: payload })
        toast.success(`Subject "${payload.name}" updated successfully!`)
      } else {
        await createMutation.mutateAsync(payload)
        toast.success(`Subject "${payload.name}" created successfully!`)
      }
      setIsModalOpen(false)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleDeleteSubject = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Subject deleted successfully!")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error))
    }
  }

  const filteredSubjects = React.useMemo(() => {
    if (!subjects) return []
    return subjects.filter((subject) => {
      const stageName = subject.educationStageName || subject.stage || ""
      const gradeName = subject.gradeName || subject.year || ""
      const systemName = subject.educationSystemName || subject.system || ""
      const termName = subject.term || ""
      const subjectName = subject.name || ""

      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchName = subjectName.toLowerCase().includes(query)
        const matchStage = stageName.toLowerCase().includes(query)
        const matchYear = gradeName.toLowerCase().includes(query)
        const matchSystem = systemName.toLowerCase().includes(query)
        if (!matchName && !matchStage && !matchYear && !matchSystem) {
          return false
        }
      }

      if (
        filters.stage !== "all" &&
        stageName.toLowerCase() !== filters.stage.toLowerCase()
      ) {
        return false
      }

      if (
        filters.year !== "all" &&
        gradeName.toLowerCase() !== filters.year.toLowerCase()
      ) {
        return false
      }

      if (
        filters.system !== "all" &&
        systemName.toLowerCase() !== filters.system.toLowerCase()
      ) {
        return false
      }

      if (
        filters.term !== "all" &&
        termName.toLowerCase() !== filters.term.toLowerCase()
      ) {
        return false
      }

      if (
        filters.subject !== "all" &&
        subjectName.toLowerCase() !== filters.subject.toLowerCase()
      ) {
        return false
      }

      return true
    })
  }, [subjects, filters])

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header matching Screenshot 1 */}
      <PageHeader
        title="Subjects"
        description="Manage the academic structure, subjects, chapters, units, lessons, and learning content."
      />

      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        {/* Action and Count Bar */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Subjects
            </h2>
            <span className="text-xs text-zinc-400 font-normal">
              Showing {subjects.length} of {totalCount} subjects
            </span>
          </div>

          <Button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white font-medium rounded-xl h-10 px-4 gap-2 shadow-2xs cursor-pointer transition-all hover:brightness-95"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Subject</span>
          </Button>
        </div>

        {/* Filters */}
        <CurriculumFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Table / Loading */}
        {isLoading ? (
          <LoadingSpinner title="Loading Subjects" />
        ) : (
          <CurriculumTable
            data={subjects}
            pageSize={pageSize}
            serverPagination={{
              currentPage: page,
              totalPages,
              totalItems: totalCount,
              onPageChange: (newPage) => setPage(newPage),
              pageSizeOptions: [10, 20, 50],
              onPageSizeChange: (newSize) => {
                setPageSize(newSize)
                setPage(1)
              },
            }}
            onEditSubject={handleOpenEditModal}
            onDeleteSubject={handleDeleteSubject}
          />
        )}
      </main>

      {/* Add / Edit Subject Modal */}
      <SubjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        subjectToEdit={subjectToEdit}
        onSubmit={handleModalSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
