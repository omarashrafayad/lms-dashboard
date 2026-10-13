export type TicketPriority = "Urgent" | "High" | "Medium" | "Low"
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed"
export type TicketCategory =
  | "Curriculum & Video"
  | "Billing & Subscriptions"
  | "Technical & Platform"
  | "Student Accounts"
  | "Exams & Grading"
  | "General Inquiry"

export interface TicketMessage {
  id: string
  author: string
  authorRole: "Admin" | "Instructor" | "Student" | "Support Specialist"
  avatar?: string
  content: string
  createdAt: string
  isStaff: boolean
}

export interface SupportTicket {
  id: string
  subject: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  requester: {
    name: string
    email: string
    role: string
    avatar?: string
  }
  assignedTo?: {
    name: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
  messagesCount: number
  messages?: TicketMessage[]
}

export interface SupportStats {
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  resolvedCount: number
  avgResponseTime: string
  satisfactionRate: number
}

export interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
}

export interface SystemServiceStatus {
  id: string
  name: string
  category: string
  status: "Operational" | "Degraded" | "Maintenance"
  uptime: string
  latency: string
  lastChecked: string
}

export type SupportTabKey = "tickets" | "faq" | "status" | "contact"
