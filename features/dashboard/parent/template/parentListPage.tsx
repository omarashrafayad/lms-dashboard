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

  const { data: apiParents, isLoading, isError } = useParents()

  const handleFilterChange = (updated: Partial<ParentFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const filteredParents = React.useMemo(() => {
    if (!apiParents || !Array.isArray(apiParents)) return []

    return apiParents
      .filter((parent) => {
        // Search filter
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase()
          const fullName =
            parent.fullName ||
            [parent.firstName, parent.lastName].filter(Boolean).join(" ") ||
            ""
          const matchesName = fullName.toLowerCase().includes(query)
          const matchesEmail = parent.email?.toLowerCase().includes(query)
          const matchesPhone = parent.phoneNumber?.toLowerCase().includes(query)
          const linkedStudents = parent.linkedStudents || parent.childIds || []
          const matchesChildren = linkedStudents.some((c) =>
            (c.fullName || c.name || "").toLowerCase().includes(query)
          )
          const code = `par-${(parent.id || "").slice(0, 5)}`
          const matchesCode = code.includes(query) || parent.id?.toLowerCase().includes(query)

          if (!matchesName && !matchesEmail && !matchesPhone && !matchesChildren && !matchesCode) {
            return false
          }
        }

        // Status
        if (filters.status !== "all") {
          const status = parent.isActive ? "Active" : "Inactive"
          if (status !== filters.status) {
            return false
          }
        }

        // Has Linked Children
        const children = parent.linkedStudents || parent.childIds || []
        if (filters.hasLinkedChildren === "yes" && children.length === 0) {
          return false
        }
        if (filters.hasLinkedChildren === "no" && children.length > 0) {
          return false
        }

        return true
      })
      .map(mapApiParentToParent)
  }, [apiParents, filters])

  const totalCount = filteredParents.length
  const activeCount = filteredParents.filter((p) => p.status === "Active").length
  const withChildrenCount = filteredParents.filter((p) => p.childrenCount > 0).length
  const activeSubscriptionsCount = filteredParents.reduce(
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
          <ParentTable data={filteredParents} />
        )}
      </main>
    </div>
  )
}
