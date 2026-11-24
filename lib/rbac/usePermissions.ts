"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/useAuthStore"
import {
  AppPermission,
  CheckPermissionOptions,
  UserPermissionsProfile,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  evaluatePermissions,
} from "./permissions"
import { fetchMyPermissions, PERMISSIONS_QUERY_KEY } from "./api"

export interface UsePermissionsResult {
  permissions: string[]
  roles: string[]
  profile?: UserPermissionsProfile
  isLoading: boolean
  isError: boolean
  hasPermission: (permission?: AppPermission) => boolean
  hasAnyPermission: (permissions?: AppPermission[]) => boolean
  hasAllPermissions: (permissions?: AppPermission[]) => boolean
  hasRole: (role?: string) => boolean
  hasAnyRole: (roles?: string[]) => boolean
  can: (options: CheckPermissionOptions) => boolean
}

/**
 * Main hook for fetching and checking permissions of the current user.
 * Powered by TanStack Query caching with staleTime: 10 minutes.
 */
export function usePermissions(): UsePermissionsResult {
  const token = useAuthStore((state) => state.token)
  const isAuth = Boolean(token && token !== "null" && token !== "undefined")

  const { data, isLoading, isError } = useQuery<UserPermissionsProfile>({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: fetchMyPermissions,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: isAuth,
    retry: 1,
  })

  const permissions = React.useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (Array.isArray((data as any).permissions)) return (data as any).permissions
    return []
  }, [data])

  const roles = React.useMemo(() => {
    if (data && Array.isArray(data.roles) && data.roles.length > 0) {
      return data.roles
    }
    const storeRoles = useAuthStore.getState().user?.roles
    if (Array.isArray(storeRoles) && storeRoles.length > 0) {
      return storeRoles
    }
    return []
  }, [data])

  const checkHasPermission = React.useCallback(
    (perm?: AppPermission) => hasPermission(permissions, perm),
    [permissions]
  )

  const checkHasAnyPermission = React.useCallback(
    (perms?: AppPermission[]) => hasAnyPermission(permissions, perms),
    [permissions]
  )

  const checkHasAllPermissions = React.useCallback(
    (perms?: AppPermission[]) => hasAllPermissions(permissions, perms),
    [permissions]
  )

  const checkHasRole = React.useCallback(
    (role?: string) => hasRole(roles, role),
    [roles]
  )

  const checkHasAnyRole = React.useCallback(
    (targetRoles?: string[]) => hasAnyRole(roles, targetRoles),
    [roles]
  )

  const can = React.useCallback(
    (options: CheckPermissionOptions) =>
      evaluatePermissions(permissions, roles, options),
    [permissions, roles]
  )

  return {
    permissions,
    roles,
    profile: data,
    isLoading: isAuth ? isLoading : false,
    isError,
    hasPermission: checkHasPermission,
    hasAnyPermission: checkHasAnyPermission,
    hasAllPermissions: checkHasAllPermissions,
    hasRole: checkHasRole,
    hasAnyRole: checkHasAnyRole,
    can,
  }
}

/**
 * Ergonomic hook to check if user has a single permission.
 */
export function useHasPermission(permission?: AppPermission): boolean {
  const { hasPermission: check } = usePermissions()
  return check(permission)
}

/**
 * Ergonomic hook to check if user has at least one of the provided permissions.
 */
export function useHasAnyPermission(permissions?: AppPermission[]): boolean {
  const { hasAnyPermission: check } = usePermissions()
  return check(permissions)
}

/**
 * Ergonomic hook to check if user has all of the provided permissions.
 */
export function useHasAllPermissions(permissions?: AppPermission[]): boolean {
  const { hasAllPermissions: check } = usePermissions()
  return check(permissions)
}

/**
 * Ergonomic hook to check if user has a specific role.
 */
export function useHasRole(role?: string): boolean {
  const { hasRole: check } = usePermissions()
  return check(role)
}

/**
 * Generic evaluator hook supporting permission, anyPermissions, allPermissions, and roles.
 */
export function useCan(options: CheckPermissionOptions): boolean {
  const { can } = usePermissions()
  return can(options)
}
