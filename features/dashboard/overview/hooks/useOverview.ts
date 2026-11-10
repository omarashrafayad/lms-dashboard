"use client"

import { useQuery } from "@tanstack/react-query"
import { getDashboardOverview } from "../api/overviewApi"
import { DashboardOverviewParams } from "../types/overview.types"

export const useDashboardOverview = (params?: DashboardOverviewParams) => {
  return useQuery({
    queryKey: ["dashboard-overview", params?.recentStudentsLimit, params?.recentTeachersLimit],
    queryFn: () => getDashboardOverview(params),
    staleTime: 1000 * 60 * 2, // 2 minutes fresh cache
  })
}

