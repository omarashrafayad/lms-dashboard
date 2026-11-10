import clientAxios from "@/lib/axios/clientAxios"
import {
  DashboardOverviewResponse,
  DashboardOverviewParams,
} from "../types/overview.types"

export const getDashboardOverview = async (
  params?: DashboardOverviewParams
): Promise<DashboardOverviewResponse> => {
  const res = await clientAxios.get("/dashboard/overview", {
    params: {
      recentStudentsLimit: params?.recentStudentsLimit ?? 5,
      recentTeachersLimit: params?.recentTeachersLimit ?? 5,
    },
  })
  return res.data?.data ?? res.data
}

