"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { ParentStats } from "../components/ParentStats"
import { ParentFilters } from "../components/ParentFilters"
import { ParentTable } from "../components/ParentTable"
import { ParentFilterState } from "../types/parent.types"
import { useParents } from "../hooks/useParents"
import { mapApiParentToParent } from "../utils/parent.mapper"
import { useDebounce } from "@/hooks/useDebounce"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

const initialFilters: ParentFilterState = {
  search: "",
  status: "all",
  hasLinkedChildren: "all",
  subscriptionStatus: "all",
  registrationDate: "all",
}

export default function ParentListPage() {
  const router = useRouter()
  const [filters, setFilters] = React.useState<ParentFilterState>(initialFilters)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const debouncedSearch = useDebounce(filters.search, 400)

  const handleFilterChange = (updated: Partial<ParentFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
    setPage(1)
  }

  const handleReset = () => {
    setFilters(initialFilters)
    setPage(1)
  }

  const { data: response, isLoading, isError } = useParents({
    page,
    pageSize,
    search: debouncedSearch,
    status: filters.status,
  })

  const apiParents = response?.items || []
  const totalCount = response?.totalCount ?? 0
  const totalPages = response?.totalPages ?? 1

  const parents = React.useMemo(() => {
    return apiParents.map(mapApiParentToParent)
  }, [apiParents])

  const activeCount = parents.filter((p) => p.status === "Active").length
  const withChildrenCount = parents.filter((p) => p.childrenCount > 0).length
  const activeSubscriptionsCount = parents.reduce(
    (acc, p) => acc + p.activeSubscriptions,
    0
  )

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="All Parents"
        description="Manage parent accounts, linked children, subscriptions, and payments."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        <ParentStats
          totalCount={totalCount}
          activeCount={activeCount}
          withChildrenCount={withChildrenCount}
          activeSubscriptionsCount={activeSubscriptionsCount}
          onAddParent={() => {
            router.push("/parent/add")
          }}
        />

        <ParentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {isLoading ? (
          <LoadingSpinner title="loading parents" />
        ) : isError ? (
          <GlobalError />
        ) : (
          <ParentTable
            data={parents}
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
          />
        )}
      </main>
    </div>
  )
}
