import clientAxios from "@/lib/axios/clientAxios"
import {
  SubscriptionPlan,
  SubscriberItem,
  TransactionItem,
  PaymentRequestItem,
  SubscriptionsFinancialStats,
  SubscribersFilterState,
  TransactionsFilterState,
  PaymentRequestsFilterState,
} from "../types/subscriptions.types"
import {
  mockPlans,
  mockSubscribers,
  mockTransactions,
  mockPaymentRequests,
  mockFinancialStats,
} from "../data/mockSubscriptions"

let localPlans: SubscriptionPlan[] = [...mockPlans]
let localSubscribers: SubscriberItem[] = [...mockSubscribers]
let localTransactions: TransactionItem[] = [...mockTransactions]
let localPaymentRequests: PaymentRequestItem[] = [...mockPaymentRequests]

// --- Financial Stats ---
export const getSubscriptionStats = async (): Promise<SubscriptionsFinancialStats> => {
  try {
    const res = await clientAxios.get("/subscriptions/stats")
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // fallback
  }

  const activeCount = localSubscribers.filter((s) => s.status === "Active").length
  const pendingRequests = localPaymentRequests.filter((r) => r.status === "Pending").length
  const expiringCount = localSubscribers.filter(
    (s) => s.remainingDays <= 7 && s.status !== "Expired"
  ).length

  return {
    ...mockFinancialStats,
    activeSubscribers: activeCount,
    pendingRequestsCount: pendingRequests,
    expiringIn7Days: expiringCount,
  }
}

// --- Subscription Plans ---
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const res = await clientAxios.get("/subscriptions/plans")
    if (Array.isArray(res.data)) return res.data
    if (Array.isArray(res.data?.data)) return res.data.data
  } catch (err) {
    // fallback
  }
  return [...localPlans]
}

export const createSubscriptionPlan = async (
  payload: Omit<SubscriptionPlan, "id" | "subscribersCount" | "totalRevenueFormatted">
): Promise<SubscriptionPlan> => {
  try {
    const res = await clientAxios.post("/subscriptions/plans", payload)
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // fallback
  }

  const newPlan: SubscriptionPlan = {
    ...payload,
    id: `plan-${Date.now()}`,
    subscribersCount: 0,
    totalRevenueFormatted: "0 EGP / mo",
  }
  localPlans = [newPlan, ...localPlans]
  return newPlan
}

export const updateSubscriptionPlan = async (
  id: string,
  payload: Partial<SubscriptionPlan>
): Promise<SubscriptionPlan> => {
  try {
    const res = await clientAxios.put(`/subscriptions/plans/${id}`, payload)
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // fallback
  }

  localPlans = localPlans.map((p) => (p.id === id ? { ...p, ...payload } : p))
  const updated = localPlans.find((p) => p.id === id)
  if (!updated) throw new Error("Plan not found")
  return updated
}

export const deleteSubscriptionPlan = async (id: string): Promise<boolean> => {
  try {
    await clientAxios.delete(`/subscriptions/plans/${id}`)
    return true
  } catch (err) {
    // fallback
  }
  localPlans = localPlans.filter((p) => p.id !== id)
  return true
}

// --- Subscribers ---
export const getSubscribersList = async (
  filters: Partial<SubscribersFilterState> = {}
): Promise<SubscriberItem[]> => {
  try {
    const res = await clientAxios.get("/subscriptions/subscribers", { params: filters })
    if (Array.isArray(res.data)) return res.data
    if (Array.isArray(res.data?.data)) return res.data.data
  } catch (err) {
    // fallback
  }

  let list = [...localSubscribers]

  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase()
    list = list.filter(
      (s) =>
        s.studentName.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q) ||
        s.parentPhone.includes(q) ||
        s.subscriptionCode.toLowerCase().includes(q)
    )
  }

  if (filters.status && filters.status !== "all") {
    list = list.filter((s) => s.status === filters.status)
  }

  if (filters.planId && filters.planId !== "all") {
    list = list.filter((s) => s.planId === filters.planId)
  }

  if (filters.grade && filters.grade !== "all") {
    list = list.filter((s) => s.studentGrade.toLowerCase().includes(filters.grade!.toLowerCase()))
  }

  if (filters.renewal === "next7days") {
    list = list.filter((s) => s.remainingDays <= 7 && s.remainingDays >= 0)
  }

  return list
}

export const assignSubscriber = async (payload: {
  studentName: string
  studentCode: string
  studentGrade: string
  parentName: string
  parentPhone: string
  planId: string
  billingCycle: "Monthly" | "Quarterly" | "Annual"
  paymentMethod: SubscriberItem["paymentMethod"]
  amount: number
  autoRenew: boolean
}): Promise<SubscriberItem> => {
  try {
    const res = await clientAxios.post("/subscriptions/assign", payload)
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // fallback
  }

  const selectedPlan = localPlans.find((p) => p.id === payload.planId) || localPlans[0]
  const newSub: SubscriberItem = {
    id: `sub-${Date.now()}`,
    subscriptionCode: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
    studentId: `stu-${Date.now()}`,
    studentName: payload.studentName,
    studentCode: payload.studentCode || `STU-${Math.floor(10000 + Math.random() * 90000)}`,
    studentGrade: payload.studentGrade,
    studentAvatarColor: "bg-emerald-100 text-emerald-800",
    parentName: payload.parentName,
    parentPhone: payload.parentPhone,
    planId: selectedPlan.id,
    planName: selectedPlan.name,
    planTier: selectedPlan.tier,
    billingCycle: payload.billingCycle,
    status: "Active",
    startDate: "Today",
    renewalDate: "In 30 days",
    amount: payload.amount,
    currency: "EGP",
    paymentMethod: payload.paymentMethod,
    autoRenew: payload.autoRenew,
    remainingDays: 30,
  }

  localSubscribers = [newSub, ...localSubscribers]

  // Also create corresponding transaction
  const newTxn: TransactionItem = {
    id: `txn-${Date.now()}`,
    transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    payerName: payload.parentName || payload.studentName,
    payerRole: payload.parentName ? "Parent" : "Student",
    payerEmail: `${payload.studentName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    payerPhone: payload.parentPhone,
    studentName: payload.studentName,
    studentGrade: payload.studentGrade,
    planOrItem: `${selectedPlan.name} (${payload.billingCycle})`,
    type: "Subscription",
    amount: payload.amount,
    discount: 0,
    fee: 0,
    netAmount: payload.amount,
    currency: "EGP",
    paymentMethod: payload.paymentMethod,
    gatewayReference: `ADMIN-MANUAL-${Date.now().toString().slice(-6)}`,
    status: "Paid",
    date: "Just now",
  }
  localTransactions = [newTxn, ...localTransactions]

  return newSub
}

export const updateSubscriberStatus = async (
  id: string,
  status: SubscriberItem["status"]
): Promise<SubscriberItem> => {
  try {
    const res = await clientAxios.patch(`/subscriptions/subscribers/${id}/status`, { status })
    if (res.data?.data) return res.data.data
  } catch (err) {
    // fallback
  }

  localSubscribers = localSubscribers.map((s) => (s.id === id ? { ...s, status } : s))
  const updated = localSubscribers.find((s) => s.id === id)
  if (!updated) throw new Error("Subscriber not found")
  return updated
}

// --- Transactions & Invoices ---
export const getTransactionsList = async (
  filters: Partial<TransactionsFilterState> = {}
): Promise<TransactionItem[]> => {
  try {
    const res = await clientAxios.get("/subscriptions/transactions", { params: filters })
    if (Array.isArray(res.data)) return res.data
    if (Array.isArray(res.data?.data)) return res.data.data
  } catch (err) {
    // fallback
  }

  let list = [...localTransactions]

  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase()
    list = list.filter(
      (t) =>
        t.transactionId.toLowerCase().includes(q) ||
        t.invoiceNumber.toLowerCase().includes(q) ||
        t.payerName.toLowerCase().includes(q) ||
        t.studentName.toLowerCase().includes(q) ||
        t.gatewayReference.toLowerCase().includes(q)
    )
  }

  if (filters.status && filters.status !== "all") {
    list = list.filter((t) => t.status === filters.status)
  }

  if (filters.paymentMethod && filters.paymentMethod !== "all") {
    list = list.filter((t) => t.paymentMethod === filters.paymentMethod)
  }

  if (filters.type && filters.type !== "all") {
    list = list.filter((t) => t.type === filters.type)
  }

  return list
}

export const refundTransaction = async (
  id: string,
  reason: string
): Promise<TransactionItem> => {
  try {
    const res = await clientAxios.post(`/subscriptions/transactions/${id}/refund`, { reason })
    if (res.data?.data) return res.data.data
  } catch (err) {
    // fallback
  }

  localTransactions = localTransactions.map((t) =>
    t.id === id ? { ...t, status: "Refunded", notes: `Refunded: ${reason}` } : t
  )
  const updated = localTransactions.find((t) => t.id === id)
  if (!updated) throw new Error("Transaction not found")
  return updated
}

// --- Payment Requests (Offline Transfers) ---
export const getPaymentRequestsList = async (
  filters: Partial<PaymentRequestsFilterState> = {}
): Promise<PaymentRequestItem[]> => {
  try {
    const res = await clientAxios.get("/subscriptions/payment-requests", { params: filters })
    if (Array.isArray(res.data)) return res.data
    if (Array.isArray(res.data?.data)) return res.data.data
  } catch (err) {
    // fallback
  }

  let list = [...localPaymentRequests]

  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase()
    list = list.filter(
      (r) =>
        r.requestCode.toLowerCase().includes(q) ||
        r.senderName.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.transferReference.toLowerCase().includes(q)
    )
  }

  if (filters.status && filters.status !== "all") {
    list = list.filter((r) => r.status === filters.status)
  }

  if (filters.method && filters.method !== "all") {
    list = list.filter((r) => r.method === filters.method)
  }

  return list
}

export const reviewPaymentRequest = async (
  id: string,
  status: "Approved" | "Rejected",
  reviewerName = "Dina Farouk"
): Promise<PaymentRequestItem> => {
  try {
    const res = await clientAxios.patch(`/subscriptions/payment-requests/${id}`, {
      status,
      reviewerName,
    })
    if (res.data?.data) return res.data.data
  } catch (err) {
    // fallback
  }

  localPaymentRequests = localPaymentRequests.map((r) =>
    r.id === id
      ? {
          ...r,
          status,
          reviewedAt: "Just now",
          reviewedBy: reviewerName,
        }
      : r
  )

  const req = localPaymentRequests.find((r) => r.id === id)
  if (req && status === "Approved") {
    // Create subscriber and transaction automatically!
    await assignSubscriber({
      studentName: req.studentName,
      studentCode: `STU-${Math.floor(10000 + Math.random() * 90000)}`,
      studentGrade: req.studentGrade,
      parentName: req.senderName,
      parentPhone: req.senderPhone,
      planId: req.planId,
      billingCycle: "Monthly",
      paymentMethod: req.method,
      amount: req.amount,
      autoRenew: true,
    })
  }

  if (!req) throw new Error("Payment request not found")
  return req
}
