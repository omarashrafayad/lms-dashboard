export type PlanTier = "Starter" | "Standard" | "Premium" | "VIP" | string
export type BillingCycle = "Monthly" | "Annual" | "Quarterly" | "monthly" | "annually" | string
export type Currency = "EGP" | "USD" | string
export type SubscriptionStatus =
  | "Active"
  | "Trial"
  | "Expiring Soon"
  | "Expired"
  | "Canceled"
  | "Paused"
  | string

export type PaymentMethod =
  | "Visa / Mastercard"
  | "Vodafone Cash"
  | "InstaPay"
  | "Fawry"
  | "Bank Transfer"
  | "Cash / Front Desk"
  | string

export type TransactionStatus = "Paid" | "Pending" | "Failed" | "Refunded" | string
export type PaymentRequestStatus = "Pending" | "Approved" | "Rejected" | string

export interface PaymentRequestItem {
  id: string
  requestCode: string
  senderName: string
  senderPhone: string
  studentName: string
  studentGrade: string
  planName: string
  planId: string
  method: string
  transferReference: string
  amount: number
  currency: Currency
  dateSubmitted: string
  receiptNote?: string
  status: PaymentRequestStatus
  reviewedAt?: string
  reviewedBy?: string
}

// --- Backend Plan Feature ---
export interface ApiPlanFeature {
  id?: string
  label?: string
  isIncluded?: boolean
  order?: number
  // frontend compatibility
  text?: string
  included?: boolean
  highlight?: boolean
}

// --- Backend Plan Response (Billing_PlanResponse) ---
export interface ApiPlan {
  id: string
  name: string
  tier: string
  tagline?: string
  targetGradeLevel?: string
  gradeScope?: string
  gradeLabel?: string
  monthlyPrice: number
  annualPrice: number
  badgeLabel?: string
  liveSessionsPerMonth: number
  examAccess?: string
  supportLevel?: string
  isActive?: boolean
  order?: number
  features?: ApiPlanFeature[]
  activeSubscribers?: number
  monthlyRecurringRevenue?: number

  // Compatibility helpers
  slug?: string
  description?: string
  badge?: string
  priceMonthly?: number
  priceAnnually?: number
  currency?: Currency
  billingCycle?: BillingCycle
  targetGrade?: string
  subscribersCount?: number
  totalRevenueFormatted?: string
  limits?: {
    liveSessionsPerMonth: number
    recordedCoursesAccess: string
    practiceExamsAccess: string
    supportPriority: string
    parentReports: boolean
  }
}

export type SubscriptionPlan = ApiPlan

// --- Backend Plan Creation / Update Payloads ---
export interface CreatePlanPayload {
  name: string
  tier: string
  tagline?: string
  targetGradeLevel?: string
  gradeScope?: string
  monthlyPrice: number
  annualPrice: number
  badgeLabel?: string
  liveSessionsPerMonth: number
  examAccess?: string
  supportLevel?: string
  features?: string[]
}

export interface UpdatePlanPayload extends Partial<CreatePlanPayload> {
  isActive?: boolean
  order?: number
}

// --- Backend Subscription Response (Billing_SubscriptionResponse) ---
export interface ApiSubscription {
  id: string
  studentId: string
  studentName?: string
  studentGrade?: string
  parentId?: string
  parentName?: string
  parentPhone?: string
  planId: string
  planName?: string
  tier?: string
  billingCycle?: string
  status?: string
  startsAt: string
  expiresAt: string
  daysRemaining: number
  amountCharged: number
  autoRenew: boolean
  notes?: string

  // Compatibility aliases
  subscriptionCode?: string
  studentCode?: string
  studentAvatarColor?: string
  planTier?: PlanTier
  startDate?: string
  renewalDate?: string
  amount?: number
  currency?: Currency
  paymentMethod?: PaymentMethod
  remainingDays?: number
}

export type SubscriberItem = ApiSubscription

// --- Backend Assign Plan Payload ---
export interface AssignPlanPayload {
  studentId: string
  studentName?: string
  planId: string
  billingCycle: string
  studentGrade?: string
  // parentId?: string
  parentName?: string
  parentPhone?: string
  autoRenew: boolean
  notes?: string
}

// --- Backend Payment Response (Billing_PaymentResponse) ---
export interface ApiPayment {
  id: string
  invoiceNumber?: string
  reference?: string
  subscriptionId?: string
  planId?: string
  planName?: string
  studentId?: string
  studentName?: string
  studentGrade?: string
  payerName?: string
  itemDescription?: string
  itemKind?: string
  amount: number
  discountAmount?: number
  couponCode?: string
  method?: string
  methodDisplay?: string
  status?: string
  gatewayReference?: string
  paidAt: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNote?: string

  // Compatibility aliases
  transactionId?: string
  payerRole?: "Parent" | "Student"
  payerEmail?: string
  payerPhone?: string
  planOrItem?: string
  type?: string
  discount?: number
  fee?: number
  netAmount?: number
  currency?: Currency
  paymentMethod?: PaymentMethod
  date?: string
  notes?: string
}

export type TransactionItem = ApiPayment

export interface PaginatedPaymentsResponse {
  items: ApiPayment[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface RecordPaymentPayload {
  subscriptionId?: string
  planId?: string
  studentId?: string
  studentName?: string
  studentGrade?: string
  payerName?: string
  itemDescription?: string
  itemKind?: string
  amount: number
  discountAmount?: number
  couponCode?: string
  method?: string
  gatewayReference?: string
  paidAt?: string
}

export interface ReviewPaymentPayload {
  approve: boolean
  note?: string
}

// --- Backend Summary Response (Billing_BillingSummaryResponse) ---
export interface BillingSummaryResponse {
  monthlyRecurringRevenue: number
  monthlyRecurringRevenueThirtyDaysAgo: number
  monthlyRecurringRevenueChangePercent: number
  activePaidStudents: number
  newSubscriptionsThisMonth: number
  expiringSoonStudents: number
  totalProcessedVolume: number
  paymentSuccessRatePercent: number
  awaitingReviewCount: number
  awaitingReviewAmount: number
  awaitingReviewMethods?: string[]

  // Compatibility aliases
  mrr?: number
  mrrFormatted?: string
  mrrGrowth?: string
  totalRevenue?: number
  totalRevenueFormatted?: string
  activeSubscribers?: number
  activeSubscribersGrowth?: string
  expiringIn7Days?: number
  pendingRequestsCount?: number
  successRate?: string
  avgRevenuePerUser?: string
  currency?: Currency
}

export type SubscriptionsFinancialStats = BillingSummaryResponse

// --- Filters ---
export interface SubscribersFilterState {
  search: string
  status: "all" | SubscriptionStatus
  planId: "all" | string
  grade: "all" | string
  expiringWithinDays?: number
}

export interface TransactionsFilterState {
  search: string
  status: "all" | TransactionStatus
  paymentMethod: "all" | PaymentMethod
  type: "all" | string
}

export interface PlansFilterState {
  tier?: string
  includeInactive?: boolean
}
