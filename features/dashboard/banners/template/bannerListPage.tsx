"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { BannerStats } from "../components/BannerStats"
import { BannerFilters, BannerFilterState } from "../components/BannerFilters"
import { BannerTable } from "../components/BannerTable"
import { BannerFormModal } from "../components/BannerFormModal"
import {
  useBanners,
  useCreateBanner,
  useUpdateBanner,
} from "../hooks/useBanners"
import { useDebounce } from "@/hooks/useDebounce"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import { Banner } from "../types/banner.types"
import { toast } from "sonner"

const initialFilters: BannerFilterState = {
  search: "",
  status: "all",
}

export default function BannerListPage() {
  const router = useRouter()
  const [filters, setFilters] = React.useState<BannerFilterState>(initialFilters)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingBanner, setEditingBanner] = React.useState<Banner | null>(null)

  const debouncedSearch = useDebounce(filters.search, 350)

  const activeParam =
    filters.status === "Active"
      ? true
      : filters.status === "Inactive"
      ? false
      : undefined

  const {
    data: bannersResponse,
    isLoading,
    isError,
    refetch,
  } = useBanners({
    page,
    pageSize,
    active: activeParam,
    search: debouncedSearch,
  })

  const createMutation = useCreateBanner()
  const updateMutation = useUpdateBanner()

  const handleFilterChange = (updated: Partial<BannerFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
    setPage(1)
  }

  const handleReset = () => {
    setFilters(initialFilters)
    setPage(1)
  }

  const handleOpenAdd = () => {
    setEditingBanner(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setIsModalOpen(true)
  }

  const handleModalSubmit = async (formData: FormData) => {
    try {
      if (editingBanner) {
        await updateMutation.mutateAsync({
          bannerId: editingBanner.id,
          data: formData,
        })
        toast.success("Banner updated successfully")
      } else {
        await createMutation.mutateAsync(formData)
        toast.success("Banner created successfully")
      }
      setIsModalOpen(false)
      setEditingBanner(null)
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const banners = bannersResponse?.items || []
  const totalCount = bannersResponse?.totalCount ?? 0
  const totalPages = bannersResponse?.totalPages ?? 1
  const activeCount = banners.filter((b) => b.isActive).length
  const inactiveCount = totalCount - activeCount

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Banners"
        description="Manage promotional display banners, carousel slides, and featured announcements."
      />

      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto">
        {/* Metric Cards and Add Button */}
        <BannerStats
          totalCount={totalCount}
          activeCount={activeCount}
          inactiveCount={Math.max(0, inactiveCount)}
          onAddBanner={handleOpenAdd}
        />

        {/* Filters */}
        <BannerFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Table Content */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <LoadingSpinner title="Loading banners..." />
          </div>
        ) : isError ? (
          <div className="py-12">
            <GlobalError />
          </div>
        ) : (
          <BannerTable
            data={banners}
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
            onEdit={handleOpenEdit}
          />
        )}
      </main>

      {/* Add / Edit Modal */}
      <BannerFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setEditingBanner(null)
        }}
        banner={editingBanner}
        onSubmit={handleModalSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}

