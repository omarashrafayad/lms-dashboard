import clientAxios from "@/lib/axios/clientAxios"
import {
  SessionItem,
  ScheduleSessionPayload,
  UpdateSessionPayload,
  TeacherSlotItem,
  SessionQueryParams,
  RescheduleRequestItem,
  CreateReschedulePayload,
  RespondReschedulePayload,
  RescheduleQueryParams,
  TeacherSessionCounts,
  TeacherSessionCard,
  TeacherBookingRequestItem,
  TeacherBookingItem,
  TeacherSessionDetailResponse,
  TeacherSessionHubResponse,
  TeacherSessionsQueryParams,
  BookSessionPayload,
  BookingDecisionPayload,
  CancelSessionPayload,
  ChangeSessionStatusPayload,
  SessionBookingResponse,
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

export const cancelSession = async (
  sessionId: string,
  payload: CancelSessionPayload
): Promise<any> => {
  const res = await clientAxios.post(`/sessions/${sessionId}/cancel`, payload)
  return res.data?.data || res.data?.value || res.data
}

export const changeSessionStatus = async (
  sessionId: string,
  payload: ChangeSessionStatusPayload
): Promise<SessionItem> => {
  const res = await clientAxios.post(`/sessions/${sessionId}/status`, payload)
  return res.data?.data || res.data?.value || res.data
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

export const getRescheduleRequests = async (
  params: RescheduleQueryParams = {}
): Promise<PaginatedResponse<RescheduleRequestItem>> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.sessionId) queryParams.sessionId = params.sessionId
  if (params.studentId) queryParams.studentId = params.studentId
  if (params.teacherId) queryParams.teacherId = params.teacherId
  if (params.status && params.status !== "all") queryParams.status = params.status

  const res = await clientAxios.get("/sessions/reschedule-requests", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })
  return normalizePaginatedResponse<RescheduleRequestItem>(
    res.data,
    params.page,
    params.pageSize
  )
}

export const requestReschedule = async (
  sessionId: string,
  payload: CreateReschedulePayload
): Promise<RescheduleRequestItem> => {
  const res = await clientAxios.post(
    `/sessions/${sessionId}/reschedule-requests`,
    payload
  )
  return res.data?.data || res.data?.value || res.data
}

export const respondToReschedule = async (
  sessionId: string,
  requestId: string,
  payload: RespondReschedulePayload
): Promise<RescheduleRequestItem> => {
  const res = await clientAxios.post(
    `/sessions/${sessionId}/reschedule-requests/${requestId}/respond`,
    payload
  )
  return res.data?.data || res.data?.value || res.data
}

export const getTeacherHub = async (
  teacherId: string,
  limits?: { upcomingLimit?: number; pastLimit?: number; requestLimit?: number }
): Promise<TeacherSessionHubResponse> => {
  const queryParams: Record<string, any> = {}
  if (limits?.upcomingLimit) queryParams.upcomingLimit = limits.upcomingLimit
  if (limits?.pastLimit) queryParams.pastLimit = limits.pastLimit
  if (limits?.requestLimit) queryParams.requestLimit = limits.requestLimit

  const res = await clientAxios.get(`/sessions/teacher/${teacherId}/hub`, {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })
  return res.data?.data || res.data?.value || res.data
}

export const getTeacherSessions = async (
  teacherId: string,
  params: TeacherSessionsQueryParams = {}
): Promise<PaginatedResponse<TeacherSessionCard>> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.period && params.period !== "all") queryParams.period = params.period
  if (params.status && params.status !== "all") queryParams.status = params.status
  if (params.subjectId) queryParams.subjectId = params.subjectId
  if (params.from) queryParams.from = params.from
  if (params.to) queryParams.to = params.to
  if (params.search && params.search.trim()) queryParams.search = params.search.trim()

  const res = await clientAxios.get(`/sessions/teacher/${teacherId}/sessions`, {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })
  return normalizePaginatedResponse<TeacherSessionCard>(
    res.data,
    params.page,
    params.pageSize
  )
}

export const getTeacherSessionDetail = async (
  teacherId: string,
  sessionId: string
): Promise<TeacherSessionDetailResponse> => {
  const res = await clientAxios.get(
    `/sessions/teacher/${teacherId}/sessions/${sessionId}`
  )
  return res.data?.data || res.data?.value || res.data
}

export const bookSession = async (
  sessionId: string,
  payload: BookSessionPayload
): Promise<SessionBookingResponse> => {
  const res = await clientAxios.post(
    `/sessions/${sessionId}/bookings`,
    payload
  )
  return res.data?.data || res.data?.value || res.data
}

export const decideBooking = async (
  sessionId: string,
  bookingId: string,
  payload: BookingDecisionPayload
): Promise<SessionBookingResponse> => {
  const res = await clientAxios.post(
    `/sessions/${sessionId}/bookings/${bookingId}/decision`,
    payload
  )
  return res.data?.data || res.data?.value || res.data
}

export const scheduleSessionDirect = async (
  payload: ScheduleSessionPayload
): Promise<SessionItem> => {
  const res = await clientAxios.post("/sessions/schedule", payload)
  return res.data?.data || res.data?.value || res.data
}


