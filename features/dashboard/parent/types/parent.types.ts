export type ParentStatus = "Active" | "Inactive"

export interface Parent {
  id: string
  name: string
  avatarUrl?: string
  avatarInitials: string
  avatarColorClass: string
  email: string
  phone: string
  childrenCount: number
  childrenNames: string[]
  activeSubscriptions: number
  lastPaymentDate?: string
  lastPaymentAmount?: string
  status: ParentStatus
  registeredDate: string
}

export interface ParentFilterState {
  search: string
  status: string
  hasLinkedChildren: string
  subscriptionStatus: string
  registrationDate: string
}
