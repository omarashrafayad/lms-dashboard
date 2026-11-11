"use client"

import * as React from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { ContentCurriculumTabs } from "../components/ContentCurriculumTabs"
import { LessonsTable } from "../components/LessonsTable"
import { useLessons, useDeleteLesson } from "../hooks/useContentCurriculum"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import { useDebounce } from "@/hooks/useDebounce"
import { Search, FilterX } from "lucide-react"

export default function LessonsListPage() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const debouncedSearch = useDebounce(search, 300)

  const { data: response, isLoading, isError } = useLessons({
    page,
    pageSize,
  })

  const deleteMutation = useDeleteLesson()

  const rawItems = response?.items || []
  const totalCount = response?.totalCount ?? 0
  const totalPages = response?.totalPages ?? 1

  // Client search filtering
  const filteredData = React.useMemo(() => {
    if (!debouncedSearch.trim()) return rawItems
    const q = debouncedSearch.toLowerCase()
    return rawItems.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.unitName?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.accessType?.toLowerCase().includes(q)
    )
  }, [rawItems, debouncedSearch])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return
    }
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Lesson deleted successfully")
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to delete lesson")
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Curriculum Lessons"
        description="View and administer instructional lessons, videos, durations, and access permissions."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        {/* Navigation Tabs */}
        <ContentCurriculumTabs activeTab="lessons" totalCount={totalCount} />

        {/* Toolbar: Search & Meta */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lessons by name, unit, access..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-zinc-500">
              Showing <strong>{filteredData.length}</strong> of <strong>{totalCount}</strong> lessons
            </span>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                title="Reset search"
              >
                <FilterX className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <LoadingSpinner title="loading curriculum lessons" />
        ) : isError ? (
          <GlobalError />
        ) : (
          <LessonsTable
            data={filteredData}
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
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  )
}

