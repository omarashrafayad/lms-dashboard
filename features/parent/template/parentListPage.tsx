"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { ParentStats } from "../components/ParentStats"
import { ParentFilters } from "../components/ParentFilters"
import { ParentTable } from "../components/ParentTable"
import { mockParents } from "../data/mockParents"
import { ParentFilterState } from "../types/parent.types"

const initialFilters: ParentFilterState = {
  search: "",
  status: "all",
  hasLinkedChildren: "all",
  subscriptionStatus: "all",
  registrationDate: "all",
}

export default function ParentListPage() {
  const [filters, setFilters] = React.useState<ParentFilterState>(initialFilters)

  const handleFilterChange = (updated: Partial<ParentFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const filteredParents = React.useMemo(() => {
    return mockParents.filter((parent) => {
      // Search
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
  }, [filters])

  const totalCount = filteredParents.length
  const activeCount = filteredParents.filter((p) => p.status === "Active").length
  const withChildrenCount = filteredParents.filter((p) => p.childrenCount > 0).length
  const activeSubscriptionsCount = filteredParents.reduce(
    (acc, p) => acc + p.activeSubscriptions,
    0
  )

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Page Header matching Image 1 */}
      <PageHeader
        title="All Parents"
        description="Manage parent accounts, linked children, subscriptions, and payments."
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        {/* Parent Directory Header + 4 Metric Cards */}
        <ParentStats
          totalCount={totalCount}
          activeCount={activeCount}
          withChildrenCount={withChildrenCount}
          activeSubscriptionsCount={activeSubscriptionsCount}
        />

        {/* Filter Bar */}
        <ParentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Parents Table */}
        <ParentTable data={filteredParents} />
      </main>
    </div>
  )
}
