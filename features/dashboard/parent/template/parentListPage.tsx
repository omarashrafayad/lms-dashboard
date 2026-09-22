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
import { Loader2 } from "lucide-react"

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

  const { data: apiParents, isLoading, error } = useParents({
    search: filters.search.trim() || undefined,
  })

  const handleFilterChange = (updated: Partial<ParentFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const baseParents = React.useMemo(() => {
    if (apiParents && Array.isArray(apiParents)) {
      return apiParents.map(mapApiParentToParent)
    }
    return []
  }, [apiParents])

  const filteredParents = React.useMemo(() => {
    return baseParents.filter((parent) => {
      // Client-side search check
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchesName = parent.name.toLowerCase().includes(query)
        const matchesEmail = parent.email.toLowerCase().includes(query)
        const matchesPhone = parent.phone.toLowerCase().includes(query)
        const matchesChildren = parent.childrenNames.some((c) =>
          c.toLowerCase().includes(query)
        )
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesChildren) {
          return false
        }
      }

      // Status
      if (filters.status !== "all" && parent.status !== filters.status) {
        return false
      }

      // Has Linked Children
      if (filters.hasLinkedChildren === "yes" && parent.childrenCount === 0) {
        return false
      }
      if (filters.hasLinkedChildren === "no" && parent.childrenCount > 0) {
        return false
      }

      // Subscription Status
      if (filters.subscriptionStatus === "active" && parent.activeSubscriptions === 0) {
        return false
      }
      if (filters.subscriptionStatus === "none" && parent.activeSubscriptions > 0) {
        return false
      }

      return true
    })
  }, [baseParents, filters])

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
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs">
            <Loader2 className="size-6 text-brand-orange animate-spin mr-2" />
            <span className="text-sm text-zinc-500">Loading parents...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
            Failed to load parents. Please try again later.
          </div>
        ) : (
          <ParentTable data={filteredParents} />
        )}
      </main>
    </div>
  )
}
