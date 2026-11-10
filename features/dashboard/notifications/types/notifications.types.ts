export type NotificationAudience =
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
  audience: string
  audienceLabel?: string
  courseId?: string | null
  planId?: string | null
  academicStageId?: string | null
  gradeId?: string | null
  educationSystemId?: string | null
  category: string
  categoryLabel?: string
  priority: string
  actionUrl?: string | null
  imageUrl?: string | null
  channels?: string[]
  status?: string
  publishedAt?: string | null
  createdAt: string
  updatedAt?: string | null

  // Backward compatibility alias
  targetRole?: string
  isPublished?: boolean
  targetStageName?: string | null
  targetGradeName?: string | null
  targetSystemName?: string | null
  targetCourseName?: string | null
  targetPlanName?: string | null
}

export type NotificationItem = ApiNotification

export interface NotificationQueryParams {
  page?: number
  pageSize?: number
  search?: string
  audience?: string
  status?: string
}

export interface CreateNotificationPayload {
  title: string
  summary: string
  content: string
  audience: string
  category: string
  priority: string
  courseId?: string | null
  planId?: string | null
  academicStageId?: string | null
  gradeId?: string | null
  educationSystemId?: string | null
  actionUrl?: string | null
  imageUrl?: string | null
  channels?: string[]
  publish: boolean
}

export interface UpdateNotificationPayload {
  title?: string
  summary?: string
  content?: string
  audience?: string
  category?: string
  priority?: string
  courseId?: string | null
  planId?: string | null
  academicStageId?: string | null
  gradeId?: string | null
  educationSystemId?: string | null
  actionUrl?: string | null
  imageUrl?: string | null
  channels?: string[]
  publish?: boolean
}

export interface NotificationStats {
  totalBroadcasts: number
  publishedActive: number
  draftMessages: number
}

export interface NotificationsResponse {
  items: ApiNotification[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
