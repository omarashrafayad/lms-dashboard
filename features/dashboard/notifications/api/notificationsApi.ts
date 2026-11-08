import clientAxios from "@/lib/axios/clientAxios"
import {
  ApiNotification,
  CreateNotificationPayload,
  UpdateNotificationPayload,
  NotificationQueryParams,
  NotificationsResponse,
} from "../types/notifications.types"

const META_STORAGE_KEY = "lms_notifications_metadata_cache"

const getLocalMetaCache = (): Record<string, any> => {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const saveLocalMetaCache = (id: string, meta: any) => {
  if (typeof window === "undefined" || !id) return
  try {
    const current = getLocalMetaCache()
    current[id] = meta
    localStorage.setItem(META_STORAGE_KEY, JSON.stringify(current))
  } catch (err) {
    console.error("Failed to save notification metadata cache", err)
  }
}

// Helper to extract embedded metadata
const parseNotificationItem = (item: any): ApiNotification => {
  let content = item.content || ""
  let meta: any = {}

  // Check embedded comment
  const metaRegex = /<!--meta:([\s\S]*?)-->/
  const match = content.match(metaRegex)
  if (match && match[1]) {
    try {
      meta = JSON.parse(match[1])
      content = content.replace(metaRegex, "").trim()
    } catch {
      // Ignored
    }
  }

  // Check local cache if item.id exists
  if (item.id) {
    const cached = getLocalMetaCache()[item.id]
    if (cached) {
      meta = { ...cached, ...meta }
    }
  }

  return {
    ...item,
    content,
    targetRole: meta.targetRole || "all",
    targetStage: meta.targetStage || null,
    targetStageName: meta.targetStageName || null,
    targetGrade: meta.targetGrade || null,
    targetGradeName: meta.targetGradeName || null,
    targetSystem: meta.targetSystem || null,
    targetSystemName: meta.targetSystemName || null,
    targetCourseId: meta.targetCourseId || null,
    targetCourseName: meta.targetCourseName || null,
    targetPlanId: meta.targetPlanId || null,
    targetPlanName: meta.targetPlanName || null,
    category: meta.category || "general",
    priority: meta.priority || "normal",
    actionUrl: meta.actionUrl || null,
    channels: meta.channels || ["in_app", "push"],
  }
}

export const getNotifications = async (
  params: NotificationQueryParams = {}
): Promise<NotificationsResponse> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.published !== undefined) queryParams.published = params.published

  const res = await clientAxios.get("/content/news", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })

  const data = res.data?.data ?? res.data

  let rawItems: any[] = []
  let totalCount = 0
  let page = 1
  let pageSize = 20
  let totalPages = 1

  if (data?.items) {
    rawItems = data.items
    totalCount = data.totalCount ?? data.items.length
    page = data.page ?? params.page ?? 1
    pageSize = data.pageSize ?? params.pageSize ?? 20
    totalPages = data.totalPages ?? 1
  } else if (Array.isArray(data)) {
    rawItems = data
    totalCount = data.length
    pageSize = data.length || 20
  }

  const items: ApiNotification[] = rawItems.map(parseNotificationItem)

  return {
    items,
    totalCount,
    page,
    pageSize,
    totalPages,
  }
}

export const getNotificationById = async (
  id: string
): Promise<ApiNotification> => {
  const res = await clientAxios.get(`/content/news/${id}`)
  const raw = res.data?.data ?? res.data
  return parseNotificationItem(raw)
}

export const createNotification = async (
  payload: CreateNotificationPayload
): Promise<ApiNotification> => {
  // Package metadata
  const meta = {
    targetRole: payload.targetRole,
    targetStage: payload.targetStage,
    targetStageName: payload.targetStageName,
    targetGrade: payload.targetGrade,
    targetGradeName: payload.targetGradeName,
    targetSystem: payload.targetSystem,
    targetSystemName: payload.targetSystemName,
    targetCourseId: payload.targetCourseId,
    targetCourseName: payload.targetCourseName,
    targetPlanId: payload.targetPlanId,
    targetPlanName: payload.targetPlanName,
    category: payload.category,
    priority: payload.priority,
    actionUrl: payload.actionUrl,
    channels: payload.channels,
  }

  // Embed meta in content
  const contentWithMeta = `${payload.content.trim()}\n\n<!--meta:${JSON.stringify(meta)}-->`

  const backendPayload = {
    title: payload.title.trim(),
    summary: payload.summary.trim(),
    content: contentWithMeta,
    imageUrl: payload.imageUrl || null,
    isPublished: payload.isPublished,
  }

  const res = await clientAxios.post("/content/news", backendPayload)
  const raw = res.data?.data ?? res.data

  if (raw?.id) {
    saveLocalMetaCache(raw.id, meta)
  }

  return parseNotificationItem({ ...raw, ...meta })
}

export const updateNotification = async (
  id: string,
  payload: UpdateNotificationPayload
): Promise<ApiNotification> => {
  // Read existing meta
  const cached = getLocalMetaCache()[id] || {}
  const mergedMeta = {
    ...cached,
    ...(payload.targetRole && { targetRole: payload.targetRole }),
    ...(payload.targetStage !== undefined && { targetStage: payload.targetStage }),
    ...(payload.targetStageName !== undefined && { targetStageName: payload.targetStageName }),
    ...(payload.targetGrade !== undefined && { targetGrade: payload.targetGrade }),
    ...(payload.targetGradeName !== undefined && { targetGradeName: payload.targetGradeName }),
    ...(payload.targetSystem !== undefined && { targetSystem: payload.targetSystem }),
    ...(payload.targetSystemName !== undefined && { targetSystemName: payload.targetSystemName }),
    ...(payload.targetCourseId !== undefined && { targetCourseId: payload.targetCourseId }),
    ...(payload.targetCourseName !== undefined && { targetCourseName: payload.targetCourseName }),
    ...(payload.category && { category: payload.category }),
    ...(payload.priority && { priority: payload.priority }),
    ...(payload.actionUrl !== undefined && { actionUrl: payload.actionUrl }),
    ...(payload.channels && { channels: payload.channels }),
  }

  saveLocalMetaCache(id, mergedMeta)

  const backendPayload: Record<string, any> = {}
  if (payload.title !== undefined) backendPayload.title = payload.title
  if (payload.summary !== undefined) backendPayload.summary = payload.summary
  if (payload.imageUrl !== undefined) backendPayload.imageUrl = payload.imageUrl
  if (payload.isPublished !== undefined) backendPayload.isPublished = payload.isPublished
  if (payload.content !== undefined) {
    backendPayload.content = `${payload.content.trim()}\n\n<!--meta:${JSON.stringify(mergedMeta)}-->`
  }

  const res = await clientAxios.put(`/content/news/${id}`, backendPayload)
  const raw = res.data?.data ?? res.data
  return parseNotificationItem({ ...raw, ...mergedMeta })
}

export const deleteNotification = async (id: string): Promise<void> => {
  await clientAxios.delete(`/content/news/${id}`)
}
