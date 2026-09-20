export interface ParentLinkedChild {
  id: string
  studentId: string
  name: string
  avatarUrl?: string
  avatarInitials: string
  avatarColorClass?: string
  grade: string
  stage: string
  educationSystem: string
  relationshipStatus: "Linked" | "Pending" | "Unlinked"
  activeSubscriptionStatus: "Active" | "Inactive" | "Subscribed" | "No subscription"
  hasSubscription: boolean
}

export interface ParentActivity {
  id: string
  title: string
  date: string
  iconType: "check" | "clock" | "card" | "user"
}

export interface ParentSubscription {
  id: string
  childName: string
  childId?: string
  plan: string
  startDate: string
  expiryDate: string
  paymentStatus: "Paid" | "Pending" | "Failed"
  subscriptionStatus: "Active" | "Expired" | "Cancelled"
}

export interface ParentTransaction {
  id: string
  code: string
  parentName: string
  childName?: string
  plan: "Free" | "Basic" | "Elite" | "Standard Monthly" | "Premium Annual"
  amount: string
  points: string
  date: string
  paymentStatus: "Paid" | "Pending" | "Failed"
  transactionStatus: "Completed" | "Processing" | "Failed"
}

export interface ParentPersonalInfo {
  fullName: string
  nationalId: string
  email: string
  phone: string
  secondaryPhone?: string
  address: string
  city: string
  country: string
  preferredLanguage: string
  emergencyContactName: string
  emergencyContactPhone: string
  relationshipToStudents: string
}

export interface ParentPaymentRequest {
  id: string
  code: string
  studentName: string
  plan: string
  amount: string
  requestedDate: string
  status: "Pending" | "Approved" | "Rejected"
  notes?: string
}

export interface ParentPointsDetails {
  currentBalance: number
  totalEarned: number
  totalRedeemed: number
  privateSessionsUsed: number
  privateSessionsRemaining: number
}

export interface ParentProfile {
  id: string
  code: string
  name: string
  avatarUrl?: string
  avatarInitials: string
  avatarColorClass: string
  status: "Active" | "Inactive"
  email: string
  phone: string
  registeredDate: string
  kpis: {
    linkedChildren: number
    activeSubscriptions: number
    pointsBalance: number
    pendingRequests: number
  }
  linkedChildren: ParentLinkedChild[]
  recentActivity: ParentActivity[]
  subscriptions: ParentSubscription[]
  transactions: ParentTransaction[]
  personalInfo: ParentPersonalInfo
  pointsDetails: ParentPointsDetails
  paymentRequests: ParentPaymentRequest[]
  activityHistory: ParentActivity[]
}
