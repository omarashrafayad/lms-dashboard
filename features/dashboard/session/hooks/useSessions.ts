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
} from "../api/sessionApi"
import {
  ScheduleSessionPayload,
  UpdateSessionPayload,
  SessionFilterState,
  SessionQueryParams,
  CreateReschedulePayload,
  RespondReschedulePayload,
  RescheduleQueryParams,
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
    mutationFn: (sessionId: string) => cancelSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] })
    },
  })
}

export const useTeacherSlots = (
  teacherId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["teacher-slots", teacherId],
    queryFn: () => getTeacherSlots(teacherId),
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

