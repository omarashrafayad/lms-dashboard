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
  childIds?: string[]
}

export interface ParentFilterState {
  search: string
  status: string
  hasLinkedChildren: string
  subscriptionStatus: string
  registrationDate: string
}

export interface ApiParentLinkedStudent {
  id?: string
  fullName?: string
  name?: string
  email?: string
  grade?: string
  educationStage?: string
}

export interface ApiParent {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phoneNumber: string
  isActive: boolean
  createdAt: string
  role: string
  childIds?: ApiParentLinkedStudent[]
  linkedStudents?: ApiParentLinkedStudent[]
}

export interface CreateParentPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  isActive: boolean
  childIds?: string[]
}

export interface UpdateParentPayload {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  isActive: boolean
  childIds?: string[]
}

