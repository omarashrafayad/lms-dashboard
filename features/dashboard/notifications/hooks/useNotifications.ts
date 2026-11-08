"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../api/notificationsApi"
import {
  NotificationQueryParams,
  CreateNotificationPayload,
  UpdateNotificationPayload,
} from "../types/notifications.types"

export const useNotifications = (params: NotificationQueryParams = {}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
  })
}

export const useNotification = (id: string) => {
  return useQuery({
    queryKey: ["notification", id],
    queryFn: () => getNotificationById(id),
    enabled: !!id,
  })
}

export const useCreateNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateNotificationPayload) => createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export const useUpdateNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateNotificationPayload
    }) => updateNotification(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notification", variables.id] })
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

