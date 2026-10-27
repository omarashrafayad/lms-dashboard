import clientAxios from "@/lib/axios/clientAxios"
import {
  SessionItem,
  ScheduleSessionPayload,
  UpdateSessionPayload,
  TeacherSlotItem,
  SessionQueryParams,
} from "../types/session.types"
import { PaginatedResponse, normalizePaginatedResponse } from "@/types/pagination"

export const getSessionList = async (
  params: SessionQueryParams = {}
): Promise<PaginatedResponse<SessionItem>> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.search && params.search.trim()) queryParams.search = params.search.trim()
  if (params.status && params.status !== "all") queryParams.status = params.status
  if (params.date && params.date !== "all") queryParams.date = params.date
  if (params.teacher && params.teacher !== "all") queryParams.teacher = params.teacher
  if (params.student && params.student !== "all") queryParams.student = params.student

  const res = await clientAxios.get("/curriculum/sessions/getall", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })

  return normalizePaginatedResponse<SessionItem>(res.data, params.page, params.pageSize)
}

export const getSessions = getSessionList

export const getSessionById = async (id: string): Promise<SessionItem> => {
  const res = await clientAxios.get(`/curriculum/sessions/${id}`)
  return res.data?.data || res.data?.value || res.data
}

export const scheduleSession = async (
  payload: ScheduleSessionPayload
): Promise<any> => {
  const res = await clientAxios.post("/curriculum/sessions/schedule", payload)
  return res.data?.data || res.data?.value || res.data
}

export const createSession = scheduleSession

export const updateSession = async (
  id: string,
  data: UpdateSessionPayload
): Promise<SessionItem> => {
  const res = await clientAxios.put(`/curriculum/sessions/${id}`, data)
  return res.data?.data || res.data?.value || res.data
}

export const deleteSession = async (id: string): Promise<void> => {
  await clientAxios.delete(`/curriculum/sessions/${id}`)
}

export const cancelSession = async (id: string): Promise<SessionItem> => {
  // If backend supports delete or status update
  return updateSession(id, {
    status: "Cancelled",
    sessionStatus: "Cancelled",
  })
}

export const getTeacherSlots = async (
  teacherId: string
): Promise<TeacherSlotItem[]> => {
  const res = await clientAxios.get(
    `/curriculum/sessions/teachers/${teacherId}/slots`
  )
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  if (res.data && Array.isArray(res.data.value)) {
    return res.data.value
  }
  if (res.data && Array.isArray(res.data.availableSlots)) {
    return res.data.availableSlots
  }
  return []
}
