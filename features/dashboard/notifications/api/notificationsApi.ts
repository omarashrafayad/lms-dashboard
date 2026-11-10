import clientAxios from "@/lib/axios/clientAxios"
import {
  ApiNotification,
  CreateNotificationPayload,
  UpdateNotificationPayload,
  NotificationQueryParams,
  NotificationsResponse,
  NotificationStats,
} from "../types/notifications.types"

const mapNotification = (raw: any): ApiNotification => {
  const isPublished =
    raw.status === "Published" ||
    (raw.status ? raw.status.toLowerCase() === "published" : false) ||
    Boolean(raw.publishedAt)

  return {
    ...raw,
    audience: raw.audience || "all",
    targetRole: raw.audience || "all",
    isPublished,
    channels: Array.isArray(raw.channels) ? raw.channels : ["in_app", "push"],
    category: raw.category || "general",
    priority: raw.priority || "normal",
  }
}

export const getNotifications = async (
  params: NotificationQueryParams = {}
): Promise<NotificationsResponse> => {
  const queryParams: Record<string, any> = {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  }
  if (params.search?.trim()) queryParams.search = params.search.trim()
  if (params.audience && params.audience !== "all") queryParams.audience = params.audience
  if (params.status && params.status !== "all") queryParams.status = params.status

  const res = await clientAxios.get("/content/notifications/getall", {
    params: queryParams,
  })

  const data = res.data?.data ?? res.data

  let rawItems: any[] = []
  let totalCount = 0
  let page = queryParams.page
  let pageSize = queryParams.pageSize
  let totalPages = 1

  if (data?.items && Array.isArray(data.items)) {
    rawItems = data.items
    totalCount = data.totalCount ?? data.items.length
    page = data.page ?? page
    pageSize = data.pageSize ?? pageSize
    totalPages = data.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize))
  } else if (Array.isArray(data)) {
    rawItems = data
    totalCount = data.length
    pageSize = data.length || 10
    totalPages = 1
  }

  return {
    items: rawItems.map(mapNotification),
    totalCount,
    page,
    pageSize,
    totalPages,
  }
}

export const getNotificationStats = async (): Promise<NotificationStats> => {
  const res = await clientAxios.get("/content/notifications/stats")
  const data = res.data?.data ?? res.data
  return {
    totalBroadcasts: Number(data?.totalBroadcasts) || 0,
    publishedActive: Number(data?.publishedActive) || 0,
    draftMessages: Number(data?.draftMessages) || 0,
  }
}

export const getNotificationById = async (
  id: string
): Promise<ApiNotification> => {
  const res = await clientAxios.get(`/content/notifications/${id}`)
  const raw = res.data?.data ?? res.data
  return mapNotification(raw)
}

export const createNotification = async (
  payload: CreateNotificationPayload
): Promise<ApiNotification> => {
  const res = await clientAxios.post("/content/notifications", payload)
  const raw = res.data?.data ?? res.data
  return mapNotification(raw)
}

export const updateNotification = async (
  id: string,
  payload: UpdateNotificationPayload
): Promise<ApiNotification> => {
  const res = await clientAxios.put(`/content/notifications/${id}`, payload)
  const raw = res.data?.data ?? res.data
  return mapNotification(raw)
}

export const deleteNotification = async (id: string): Promise<void> => {
  await clientAxios.delete(`/content/notifications/${id}`)
}

export const publishNotification = async (id: string): Promise<ApiNotification> => {
  const res = await clientAxios.post(`/content/notifications/${id}/publish`)
  const raw = res.data?.data ?? res.data
  return mapNotification(raw)
}
