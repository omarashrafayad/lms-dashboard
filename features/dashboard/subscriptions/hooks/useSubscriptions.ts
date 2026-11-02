"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getSubscriptionStats,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscribersList,
  assignSubscriber,
  cancelSubscription,
  renewSubscription,
  getPaymentsList,
  recordPayment,
  refundPayment,
} from "../api/subscriptionsApi"
import {
  CreatePlanPayload,
  UpdatePlanPayload,
  AssignPlanPayload,
  RecordPaymentPayload,
} from "../types/subscriptions.types"

// ==========================================
// Financial Stats Hook
// ==========================================
export const useSubscriptionStats = (expiringWithinDays: number = 7) => {
  return useQuery({
    queryKey: ["subscription-stats", expiringWithinDays],
    queryFn: () => getSubscriptionStats(expiringWithinDays),
    staleTime: 1000 * 60 * 2,
  })
}

// ==========================================
// Plans Hooks
// ==========================================
export const useSubscriptionPlans = (params?: {
  tier?: string
  includeInactive?: boolean
}) => {
  return useQuery({
    queryKey: ["subscription-plans", params],
    queryFn: () => getSubscriptionPlans(params),
    staleTime: 1000 * 60 * 5,
  })
}

export const useSubscriptionPlan = (id: string) => {
  return useQuery({
    queryKey: ["subscription-plan", id],
    queryFn: () => getSubscriptionPlanById(id),
    enabled: Boolean(id),
  })
}

export const useCreatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePlanPayload) => createSubscriptionPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] })
      queryClient.invalidateQueries({ queryKey: ["subscription-stats"] })
    },
  })
}

export const useUpdatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlanPayload }) =>
      updateSubscriptionPlan(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] })
      queryClient.invalidateQueries({ queryKey: ["subscription-plan", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["subscription-stats"] })
    },
  })
}

export const useDeletePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSubscriptionPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] })
      queryClient.invalidateQueries({ queryKey: ["subscription-stats"] })
    },
  })
}

// ==========================================
// Subscribers Hooks
// ==========================================
export const useSubscribers = (params?: {
  status?: string
  planId?: string
  search?: string
  expiringWithinDays?: number
}) => {
  return useQuery({
    queryKey: ["subscribers", params],
    queryFn: () => getSubscribersList(params),
    staleTime: 1000 * 60 * 2,
  })
}

export const useAssignSubscriber = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AssignPlanPayload) => assignSubscriber(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] })
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] })
      queryClient.invalidateQueries({ queryKey: ["subscription-stats"] })
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    },
  })
}

export const useCancelSubscription = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      cancelSubscription(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] })
      queryClient.invalidateQueries({ queryKey: ["subscription-stats"] })
    },
  })
}

export const useRenewSubscription = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, billingCycle }: { id: string; billingCycle?: string }) =>
      renewSubscription(id, billingCycle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] })
      queryClient.invalidateQueries({ queryKey: ["subscription-stats"] })
    },
  })
}

export const useUpdateSubscriberStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      if (status === "Canceled" || status === "Expired") {
        return cancelSubscription(id, `Status set to ${status}`)
      }
      return renewSubscription(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] })
      queryClient.invalidateQueries({ queryKey: ["subscription-stats"] })
    },
  })
}

// ==========================================
// Payments / Transactions Hooks
// ==========================================
export const usePayments = (params?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPaymentsList(params),
    staleTime: 1000 * 60 * 2,
  })
}

export const useTransactions = usePayments

export const useRecordPayment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RecordPaymentPayload) => recordPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["subscription-stats"] })
    },
  })
}

export const useRefundPayment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      refundPayment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["subscription-stats"] })
    },
  })
}

export const useRefundTransaction = useRefundPayment

// Compatibility placeholder for paymentRequests
export const usePaymentRequests = () => {
  return useQuery({
    queryKey: ["payment-requests"],
    queryFn: async () => [],
    staleTime: 1000 * 60 * 10,
  })
}

export const useReviewPaymentRequest = () => {
  return useMutation({
    mutationFn: async () => {},
  })
}
