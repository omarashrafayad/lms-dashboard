export type PlanTier = "Starter" | "Standard" | "Premium" | "VIP"
export type BillingCycle = "monthly" | "quarterly" | "annual" | "term"
export type Currency = "EGP" | "USD"
export type SubscriptionStatus =
  | "Active"
  | "Trial"
  | "Expiring Soon"
  | "Expired"
  | "Canceled"
  | "Paused"
export type PaymentMethod =
  | "Visa / Mastercard"
  | "Vodafone Cash"
  | "InstaPay"
  | "Fawry"
  | "Bank Transfer"
  | "Cash / Front Desk"
export type TransactionStatus = "Paid" | "Pending" | "Failed" | "Refunded"
export type PaymentRequestStatus = "Pending" | "Approved" | "Rejected"

export interface PlanFeature {
  text: string
  included: boolean
  highlight?: boolean
}

export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  tier: PlanTier
  badge?: string
  priceMonthly: number
  priceAnnually: number
  currency: Currency
  billingCycle: BillingCycle
  targetGrade: string
  features: PlanFeature[]
  limits: {
    liveSessionsPerMonth: number
    recordedCoursesAccess: "None" | "Standard" | "Unlimited"
    practiceExamsAccess: "None" | "Limited" | "Unlimited"
    supportPriority: "Standard" | "Priority" | "24/7 Dedicated"
    parentReports: boolean
  }
  isPopular?: boolean
  isActive: boolean
  subscribersCount: number
  totalRevenueFormatted: string
}

export interface SubscriberItem {
  id: string
  subscriptionCode: string
  studentId: string
  studentName: string
  studentCode: string
  studentGrade: string
  studentAvatarColor: string
  parentName: string
  parentPhone: string
  planId: string
  planName: string
  planTier: PlanTier
  billingCycle: "Monthly" | "Quarterly" | "Annual"
  status: SubscriptionStatus
  startDate: string
  renewalDate: string
  amount: number
  currency: Currency
  paymentMethod: PaymentMethod
  autoRenew: boolean
  remainingDays: number
}

export interface TransactionItem {
  id: string
  transactionId: string
  invoiceNumber: string
  payerName: string
  payerRole: "Parent" | "Student"
  payerEmail: string
  payerPhone: string
  studentName: string
  studentGrade: string
  planOrItem: string
  type: "Subscription" | "Session Booking" | "Course Pack" | "Exam Pass"
  amount: number
  discount: number
  fee: number
  netAmount: number
  currency: Currency
  paymentMethod: PaymentMethod
  gatewayReference: string
  status: TransactionStatus
  date: string
  notes?: string
}

export interface PaymentRequestItem {
  id: string
  requestCode: string
  senderName: string
  senderPhone: string
  studentName: string
  studentGrade: string
  planName: string
  planId: string
  method: "Vodafone Cash" | "InstaPay" | "Bank Transfer"
  transferReference: string
  amount: number
  currency: Currency
  dateSubmitted: string
  receiptNote?: string
  status: PaymentRequestStatus
  reviewedAt?: string
  reviewedBy?: string
}

export interface SubscriptionsFinancialStats {
  mrr: number
  mrrFormatted: string
  mrrGrowth: string
  totalRevenue: number
  totalRevenueFormatted: string
  activeSubscribers: number
  activeSubscribersGrowth: string
  expiringIn7Days: number
  pendingRequestsCount: number
  successRate: string
  avgRevenuePerUser: string
  currency: Currency
}

export interface SubscribersFilterState {
  search: string
  status: "all" | SubscriptionStatus
  planId: "all" | string
  grade: "all" | string
  renewal: "all" | "next7days" | "thisMonth"
}

export interface TransactionsFilterState {
  search: string
  status: "all" | TransactionStatus
  paymentMethod: "all" | PaymentMethod
  type: "all" | string
  dateRange: "all" | "today" | "week" | "month"
}

export interface PaymentRequestsFilterState {
  search: string
  method: "all" | string
  status: "all" | PaymentRequestStatus
}
