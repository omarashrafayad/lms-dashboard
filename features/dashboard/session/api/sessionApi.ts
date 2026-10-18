import clientAxios from "@/lib/axios/clientAxios"
import {
  SessionItem,
  ScheduleSessionPayload,
  UpdateSessionPayload,
  TeacherSlotItem,
} from "../types/session.types"

export const getSessionList = async (): Promise<SessionItem[]> => {
  const res = await clientAxios.get("/curriculum/sessions/getall")
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  if (res.data && Array.isArray(res.data.value)) {
    return res.data.value
  }
  return []
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
