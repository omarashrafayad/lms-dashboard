"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getParents,
  getParentById,
  createParent,
  updateParent,
  deleteParent,
} from "../api/parentApi"
import {
  CreateParentPayload,
  UpdateParentPayload,
} from "../types/parent.types"

export const useParents = (params: { search?: string } = {}) => {
  return useQuery({
    queryKey: ["parents", params],
    queryFn: () => getParents(params),
  })
}

export const useParent = (parentId: string) => {
  return useQuery({
    queryKey: ["parent", parentId],
    queryFn: () => getParentById(parentId),
    enabled: !!parentId,
  })
}

export const useCreateParent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateParentPayload) => createParent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] })
    },
  })
}

export const useUpdateParent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      parentId,
      data,
    }: {
      parentId: string
      data: UpdateParentPayload
    }) => updateParent(parentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["parents"] })
      queryClient.invalidateQueries({ queryKey: ["parent", variables.parentId] })
    },
  })
}

export const useDeleteParent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (parentId: string) => deleteParent(parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] })
    },
  })
}
