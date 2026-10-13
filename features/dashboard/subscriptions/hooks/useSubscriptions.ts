import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getSubscriptionStats,
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscribersList,
  assignSubscriber,
  updateSubscriberStatus,
  getTransactionsList,
  refundTransaction,
  getPaymentRequestsList,
  reviewPaymentRequest,
} from "../api/subscriptionsApi"
import {
  SubscribersFilterState,
  TransactionsFilterState,
  PaymentRequestsFilterState,
  SubscriptionPlan,
  SubscriberItem,
} from "../types/subscriptions.types"
import { toast } from "sonner"

export const useSubscriptionStats = () => {
  return useQuery({
    queryKey: ["subscriptions-stats"],
    queryFn: getSubscriptionStats,
    staleTime: 1000 * 60 * 2,
  })
}

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ["subscriptions-plans"],
    queryFn: getSubscriptionPlans,
    staleTime: 1000 * 60 * 5,
  })
}

export const useSubscribers = (filters: Partial<SubscribersFilterState> = {}) => {
  return useQuery({
    queryKey: ["subscribers", filters],
    queryFn: () => getSubscribersList(filters),
    staleTime: 1000 * 60 * 2,
  })
}

export const useTransactions = (filters: Partial<TransactionsFilterState> = {}) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => getTransactionsList(filters),
    staleTime: 1000 * 60 * 2,
  })
}

export const usePaymentRequests = (filters: Partial<PaymentRequestsFilterState> = {}) => {
  return useQuery({
    queryKey: ["payment-requests", filters],
    queryFn: () => getPaymentRequestsList(filters),
    staleTime: 1000 * 60 * 2,
  })
}

export const useCreatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSubscriptionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions-plans"] })
      toast.success("Subscription plan created successfully")
    },
    onError: () => {
      toast.error("Failed to create subscription plan")
    },
  })
}

export const useUpdatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SubscriptionPlan> }) =>
      updateSubscriptionPlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions-plans"] })
      toast.success("Subscription plan updated successfully")
    },
    onError: () => {
      toast.error("Failed to update subscription plan")
    },
  })
}

export const useDeletePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSubscriptionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions-plans"] })
      toast.success("Plan deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete plan")
    },
  })
}

export const useAssignSubscriber = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: assignSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["subscriptions-stats"] })
      toast.success("Subscription assigned and activated successfully!")
    },
    onError: () => {
      toast.error("Failed to assign subscription")
    },
  })
}

export const useUpdateSubscriberStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SubscriberItem["status"] }) =>
      updateSubscriberStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] })
      queryClient.invalidateQueries({ queryKey: ["subscriptions-stats"] })
      toast.success("Subscriber status updated")
    },
  })
}

export const useRefundTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      refundTransaction(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["subscriptions-stats"] })
      toast.success("Transaction refunded successfully")
    },
    onError: () => {
      toast.error("Refund failed")
    },
  })
}

export const useReviewPaymentRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Approved" | "Rejected" }) =>
      reviewPaymentRequest(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["payment-requests"] })
      queryClient.invalidateQueries({ queryKey: ["subscribers"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["subscriptions-stats"] })
      if (status === "Approved") {
        toast.success("Payment verified! Student subscription has been activated.")
      } else {
        toast.info("Payment request rejected")
      }
    },
  })
}
