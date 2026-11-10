"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getRoles,
  getRolePermissions,
  updateRolePermissions,
  getPermissions,
  getMyPermissions,
  getUserRoles,
  updateUserRoles,
} from "../api/rolesApi"
import {
  UpdateRolePermissionsPayload,
  UpdateUserRolesPayload,
} from "../types/roles.types"

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  })
}

export const useRolePermissions = (roleId: string) => {
  return useQuery({
    queryKey: ["role-permissions", roleId],
    queryFn: () => getRolePermissions(roleId),
    enabled: !!roleId,
  })
}

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      roleId,
      payload,
    }: {
      roleId: string
      payload: UpdateRolePermissionsPayload
    }) => updateRolePermissions(roleId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      queryClient.invalidateQueries({
        queryKey: ["role-permissions", variables.roleId],
      })
      queryClient.invalidateQueries({ queryKey: ["permissions", "me"] })
    },
  })
}

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
    staleTime: 1000 * 60 * 15,
  })
}

export const useMyPermissions = () => {
  return useQuery({
    queryKey: ["permissions", "me"],
    queryFn: getMyPermissions,
  })
}

export const useUserRoles = (userId: string) => {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: () => getUserRoles(userId),
    enabled: !!userId,
  })
}

export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string
      payload: UpdateUserRolesPayload
    }) => updateUserRoles(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-roles", variables.userId],
      })
    },
  })
}

