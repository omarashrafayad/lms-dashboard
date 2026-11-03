import clientAxios from "@/lib/axios/clientAxios"
import {
  ApiPlan,
  CreatePlanPayload,
  UpdatePlanPayload,
  ApiSubscription,
  AssignPlanPayload,
  ApiPayment,
  PaginatedPaymentsResponse,
  RecordPaymentPayload,
  BillingSummaryResponse,
} from "../types/subscriptions.types"

// ==========================================
// Financial Stats / Dashboard Summary
// ==========================================
export const getSubscriptionStats = async (
  expiringWithinDays: number = 7
): Promise<BillingSummaryResponse> => {
  const res = await clientAxios.get("/billing/dashboard/summary", {
    params: { expiringWithinDays },
  })
  return res.data?.data ?? res.data
}

// ==========================================
// Subscription Plans CRUD
// ==========================================
export const getSubscriptionPlans = async (params?: {
  tier?: string
  includeInactive?: boolean
}): Promise<ApiPlan[]> => {
  const res = await clientAxios.get("/billing/plans", { params })
  const data = res.data?.data ?? res.data
  return Array.isArray(data) ? data : data?.items ?? []
}

export const getSubscriptionPlanById = async (id: string): Promise<ApiPlan> => {
  const res = await clientAxios.get(`/billing/plans/${id}`)
  return res.data?.data ?? res.data
}

export const createSubscriptionPlan = async (
  payload: CreatePlanPayload
): Promise<ApiPlan> => {
  const res = await clientAxios.post("/billing/plans", payload)
  return res.data?.data ?? res.data
}

export const updateSubscriptionPlan = async (
  id: string,
  payload: UpdatePlanPayload
): Promise<ApiPlan> => {
  const res = await clientAxios.put(`/billing/plans/${id}`, payload)
  return res.data?.data ?? res.data
}

export const deleteSubscriptionPlan = async (id: string): Promise<void> => {
  await clientAxios.delete(`/billing/plans/${id}`)
}

export const getPlanSubscribers = async (id: string): Promise<any[]> => {
  const res = await clientAxios.get(`/billing/plans/${id}/subscribers`)
  const data = res.data?.data ?? res.data
  return Array.isArray(data) ? data : []
}

// ==========================================
// Subscribers / Subscriptions
// ==========================================
export const getSubscribersList = async (params?: {
  status?: string
  planId?: string
  search?: string
  expiringWithinDays?: number
}): Promise<ApiSubscription[]> => {
  const cleanParams: Record<string, any> = {}
  if (params?.status && params.status !== "all") cleanParams.status = params.status
  if (params?.planId && params.planId !== "all") cleanParams.planId = params.planId
  if (params?.search && params.search.trim()) cleanParams.search = params.search.trim()
  if (params?.expiringWithinDays) cleanParams.expiringWithinDays = params.expiringWithinDays

  const res = await clientAxios.get("/billing/subscriptions", {
    params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
  })
  const data = res.data?.data ?? res.data
  return Array.isArray(data) ? data : data?.items ?? []
}

export const assignSubscriber = async (
  payload: AssignPlanPayload
): Promise<ApiSubscription> => {
  const res = await clientAxios.post("/billing/subscriptions", payload)
  return res.data?.data ?? res.data
}

export const cancelSubscription = async (
  id: string,
  reason?: string
): Promise<ApiSubscription> => {
  const res = await clientAxios.post(`/billing/subscriptions/${id}/cancel`, {
    reason: reason || "Cancelled by admin",
  })
  return res.data?.data ?? res.data
}

export const renewSubscription = async (
  id: string,
  billingCycle?: string
): Promise<ApiSubscription> => {
  const res = await clientAxios.post(`/billing/subscriptions/${id}/renew`, {
    billingCycle,
  })
  return res.data?.data ?? res.data
}

export const setAutoRenew = async (
  id: string,
  autoRenew: boolean
): Promise<ApiSubscription> => {
  const res = await clientAxios.post(`/billing/subscriptions/${id}/auto-renew`, {
    autoRenew,
  })
  return res.data?.data ?? res.data
}

// ==========================================
// Payments / Transactions
// ==========================================
export const getPaymentsList = async (params?: {
  page?: number
  pageSize?: number
}): Promise<PaginatedPaymentsResponse> => {
  const res = await clientAxios.get("/billing/payments", { params })
  const data = res.data?.data ?? res.data

  if (data?.items) {
    return {
      items: data.items,
      page: data.page ?? 1,
      pageSize: data.pageSize ?? 10,
      totalCount: data.totalCount ?? data.items.length,
      totalPages: data.totalPages ?? 1,
    }
  }

  const items = Array.isArray(data) ? data : []
  return {
    items,
    page: 1,
    pageSize: items.length || 10,
    totalCount: items.length,
    totalPages: 1,
  }
}

export const getPaymentById = async (id: string): Promise<ApiPayment> => {
  const res = await clientAxios.get(`/billing/payments/${id}`)
  return res.data?.data ?? res.data
}

export const recordPayment = async (
  payload: RecordPaymentPayload
): Promise<ApiPayment> => {
  const res = await clientAxios.post("/billing/payments", payload)
  return res.data?.data ?? res.data
}

export const refundPayment = async (
  id: string,
  note: string = "Admin issued refund"
): Promise<ApiPayment> => {
  const res = await clientAxios.post(`/billing/payments/${id}/refund`, {
    approve: true,
    note,
  })
  return res.data?.data ?? res.data
}

export const reviewPayment = async (
  id: string,
  approve: boolean,
  note?: string
): Promise<ApiPayment> => {
  const res = await clientAxios.post(`/billing/payments/${id}/review`, {
    approve,
    note: note || (approve ? "Payment approved by admin" : "Payment rejected by admin"),
  })
  return res.data?.data ?? res.data
}

export const markPaymentFailed = async (
  id: string
): Promise<ApiPayment> => {
  const res = await clientAxios.post(`/billing/payments/${id}/mark-failed`)
  return res.data?.data ?? res.data
}

export const exportPaymentsLedger = async (): Promise<any> => {
  const res = await clientAxios.get("/billing/payments/export")
  return res.data
}
