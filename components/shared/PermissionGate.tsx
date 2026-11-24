"use client"

import * as React from "react"
import { AppPermission } from "@/lib/rbac/permissions"
import { usePermissions } from "@/lib/rbac/usePermissions"

export interface PermissionGateProps {
  /** Single required permission (e.g. "curriculum.course.create") */
  permission?: AppPermission | string
  /** User must have at least ONE of these permissions */
  anyPermissions?: (AppPermission | string)[]
  /** User must have ALL of these permissions */
  allPermissions?: (AppPermission | string)[]
  /** Single required role (e.g. "Admin") */
  role?: string
  /** User must have at least ONE of these roles */
  roles?: string[]
  /** Fallback content when unauthorized (defaults to null) */
  fallback?: React.ReactNode
  /** Optional fallback while permissions are loading */
  loadingFallback?: React.ReactNode
  /** Children to render when authorized. Can also be a render function receiving boolean `granted` */
  children: React.ReactNode | ((granted: boolean) => React.ReactNode)
}

/**
 * Declarative component for guarding UI elements (buttons, links, sections, tabs)
 * based on user permissions or roles.
 *
 * Example usage:
 * ```tsx
 * <PermissionGate permission="curriculum.course.create">
 *   <Button onClick={handleCreate}>Add Course</Button>
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  permission,
  anyPermissions,
  allPermissions,
  role,
  roles,
  fallback = null,
  loadingFallback = null,
  children,
}: PermissionGateProps) {
  const { can, isLoading } = usePermissions()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return loadingFallback !== null ? <>{loadingFallback}</> : <>{fallback}</>
  }

  if (isLoading && loadingFallback !== null) {
    return <>{loadingFallback}</>
  }

  const isGranted = can({
    permission,
    anyPermissions,
    allPermissions,
    role,
    roles,
  })

  if (typeof children === "function") {
    return <>{children(isGranted)}</>
  }

  if (!isGranted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Convenient shorter alias for PermissionGate:
 * `<Can permission="billing.coupon.create"><button>New Coupon</button></Can>`
 */
export const Can = PermissionGate
