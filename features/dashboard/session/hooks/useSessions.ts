"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getSessionList,
  getSessionById,
  scheduleSession,
  updateSession,
  deleteSession,
  cancelSession,
  getTeacherSlots,
  getRescheduleRequests,
  requestReschedule,
  respondToReschedule,
  getTeacherHub,
  getTeacherSessions,
  getTeacherSessionDetail,
  bookSession,
  decideBooking,
  scheduleSessionDirect,
  changeSessionStatus,
} from "../api/sessionApi"
import {
  ScheduleSessionPayload,
  UpdateSessionPayload,
  SessionFilterState,
  SessionQueryParams,
  CreateReschedulePayload,
  RespondReschedulePayload,
  RescheduleQueryParams,
  TeacherSessionsQueryParams,
  BookSessionPayload,
  BookingDecisionPayload,
  CancelSessionPayload,
  ChangeSessionStatusPayload,
} from "../types/session.types"

export const useSessions = (
  params: SessionQueryParams = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["sessions", params],
    queryFn: () => getSessionList(params),
    ...options,
  })
}

export const useSession = (sessionId: string) => {
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getSessionById(sessionId),
    enabled: !!sessionId,
  })
}

export const useSessionDetail = useSession

export const useScheduleSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ScheduleSessionPayload) => scheduleSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    },
  })
}

export const useCreateSession = useScheduleSession

export const useUpdateSession = (defaultSessionId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId?: string
      data: UpdateSessionPayload
    }) => {
      const id = sessionId || defaultSessionId
      if (!id) throw new Error("Session ID is required for update")
      return updateSession(id, data)
    },
    onSuccess: (_, variables) => {
      const id = variables.sessionId || defaultSessionId
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["session", id] })
      }
    },
  })
}

export const useDeleteSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    },
  })
}

export const useCancelSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId,
      payload,
    }: {
      sessionId: string
      payload: CancelSessionPayload
    }) => cancelSession(sessionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      queryClient.invalidateQueries({ queryKey: ["session", variables.sessionId] })
      queryClient.invalidateQueries({ queryKey: ["teacher-hub"] })
      queryClient.invalidateQueries({ queryKey: ["teacher-sessions"] })
    },
  })
}

export const useTeacherSlots = (
  teacherId: string,
  date?: string,
  options?: { enabled?: boolean }
) => {
  const targetDate = date || new Date().toISOString().split("T")[0]
  return useQuery({
    queryKey: ["teacher-slots", teacherId, targetDate],
    queryFn: () => getTeacherSlots(teacherId, targetDate),
    enabled: Boolean(teacherId) && (options?.enabled !== false),
    staleTime: 1000 * 60 * 2,
  })
}

export const useRescheduleRequests = (
  params: RescheduleQueryParams = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["reschedule-requests", params],
    queryFn: () => getRescheduleRequests(params),
    ...options,
  })
}

export const useRequestReschedule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId,
      payload,
    }: {
      sessionId: string
      payload: CreateReschedulePayload
    }) => requestReschedule(sessionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reschedule-requests"] })
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      queryClient.invalidateQueries({ queryKey: ["session", variables.sessionId] })
    },
  })
}

export const useRespondReschedule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId,
      requestId,
      payload,
    }: {
      sessionId: string
      requestId: string
      payload: RespondReschedulePayload
    }) => respondToReschedule(sessionId, requestId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reschedule-requests"] })
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      queryClient.invalidateQueries({ queryKey: ["session", variables.sessionId] })
    },
  })
}

export const useTeacherHub = (
  teacherId: string,
  limits?: { upcomingLimit?: number; pastLimit?: number; requestLimit?: number },
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["teacher-hub", teacherId, limits],
    queryFn: () => getTeacherHub(teacherId, limits),
    enabled: Boolean(teacherId) && (options?.enabled !== false),
    staleTime: 1000 * 60,
  })
}

export const useTeacherSessions = (
  teacherId: string,
  params: TeacherSessionsQueryParams = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["teacher-sessions", teacherId, params],
    queryFn: () => getTeacherSessions(teacherId, params),
    enabled: Boolean(teacherId) && (options?.enabled !== false),
  })
}

export const useTeacherSessionDetail = (
  teacherId: string,
  sessionId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["teacher-session-detail", teacherId, sessionId],
    queryFn: () => getTeacherSessionDetail(teacherId, sessionId),
    enabled: Boolean(teacherId && sessionId) && (options?.enabled !== false),
  })
}

export const useBookSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId,
      payload,
    }: {
      sessionId: string
      payload: BookSessionPayload
    }) => bookSession(sessionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      queryClient.invalidateQueries({ queryKey: ["session", variables.sessionId] })
      queryClient.invalidateQueries({ queryKey: ["teacher-hub"] })
      queryClient.invalidateQueries({ queryKey: ["teacher-sessions"] })
    },
  })
}

export const useDecideBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId,
      bookingId,
      payload,
    }: {
      sessionId: string
      bookingId: string
      payload: BookingDecisionPayload
    }) => decideBooking(sessionId, bookingId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      queryClient.invalidateQueries({ queryKey: ["session", variables.sessionId] })
      queryClient.invalidateQueries({ queryKey: ["teacher-hub"] })
      queryClient.invalidateQueries({ queryKey: ["teacher-sessions"] })
    },
  })
}

export const useChangeSessionStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId,
      payload,
    }: {
      sessionId: string
      payload: ChangeSessionStatusPayload
    }) => changeSessionStatus(sessionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      queryClient.invalidateQueries({ queryKey: ["session", variables.sessionId] })
      queryClient.invalidateQueries({ queryKey: ["teacher-hub"] })
      queryClient.invalidateQueries({ queryKey: ["teacher-sessions"] })
    },
  })
}


