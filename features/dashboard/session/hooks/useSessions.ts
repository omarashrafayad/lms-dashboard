import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getSessionList,
  getSessionById,
  updateSession,
  cancelSession,
  createSession,
} from "../api/sessionApi"
import {
  SessionFilterState,
  SessionItem,
  ScheduleSessionPayload,
} from "../types/session.types"

export const useSessions = (filters: Partial<SessionFilterState> = {}) => {
  return useQuery({
    queryKey: ["sessions", filters],
    queryFn: () => getSessionList(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export const useSessionDetail = (id: string) => {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => getSessionById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export const useUpdateSession = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updatedData: Partial<SessionItem>) =>
      updateSession(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      queryClient.invalidateQueries({ queryKey: ["session", id] })
    },
  })
}

export const useCancelSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelSession(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      queryClient.invalidateQueries({ queryKey: ["session", id] })
    },
  })
}

export const useCreateSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ScheduleSessionPayload) => createSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    },
  })
}
