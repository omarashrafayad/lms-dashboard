export type NotificationRole =
  | "all"
  | "students"
  | "teachers"
  | "parents"
  | "course"
  | "plan"

export type NotificationPriority = "normal" | "important" | "urgent"

export type NotificationCategory =
  | "general"
  | "academic_exam"
  | "schedule_session"
  | "billing_subscription"
  | "course_update"
  | "urgent"

export interface ApiNotification {
  id: string
  title: string
  summary: string
  content: string
  imageUrl?: string | null
  isPublished: boolean
  publishedAt?: string | null
  createdAt: string
  updatedAt?: string | null

  // Target audience metadata
  targetRole?: NotificationRole
  targetStage?: string | null
  targetStageName?: string | null
  targetGrade?: string | null
  targetGradeName?: string | null
  targetSystem?: string | null
  targetSystemName?: string | null
  targetCourseId?: string | null
  targetCourseName?: string | null
  targetPlanId?: string | null
  targetPlanName?: string | null

  // Classification & routing
  category?: NotificationCategory
  priority?: NotificationPriority
  actionUrl?: string | null
  channels?: string[]
}

export type NotificationItem = ApiNotification

export interface NotificationQueryParams {
  page?: number
  pageSize?: number
  published?: boolean
  search?: string
  targetRole?: string
  category?: string
  priority?: string
}

export interface CreateNotificationPayload {
  title: string
  summary: string
  content: string
  imageUrl?: string | null
  isPublished: boolean

  // Target audience
  targetRole: NotificationRole
  targetStage?: string | null
  targetStageName?: string | null
  targetGrade?: string | null
  targetGradeName?: string | null
  targetSystem?: string | null
  targetSystemName?: string | null
  targetCourseId?: string | null
  targetCourseName?: string | null
  targetPlanId?: string | null
  targetPlanName?: string | null

  category: NotificationCategory
  priority: NotificationPriority
  actionUrl?: string | null
  channels: string[]
}

export interface UpdateNotificationPayload {
  title?: string
  summary?: string
  content?: string
  imageUrl?: string | null
  isPublished?: boolean

  targetRole?: NotificationRole
  targetStage?: string | null
  targetStageName?: string | null
  targetGrade?: string | null
  targetGradeName?: string | null
  targetSystem?: string | null
  targetSystemName?: string | null
  targetCourseId?: string | null
  targetCourseName?: string | null
  targetPlanId?: string | null
  targetPlanName?: string | null

  category?: NotificationCategory
  priority?: NotificationPriority
  actionUrl?: string | null
  channels?: string[]
}

export interface NotificationsResponse {
  items: ApiNotification[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
