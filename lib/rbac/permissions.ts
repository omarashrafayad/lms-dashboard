/**
 * Role-Based Access Control (RBAC) System
 * Core types and pure permission utility functions.
 */

export type AppPermission =
  // Billing
  | "billing.coupon.create"
  | "billing.coupon.delete"
  | "billing.coupon.redeem"
  | "billing.coupon.update"
  | "billing.coupon.view"
  | "billing.dashboard.view"
  | "billing.entitlement.view"
  | "billing.payment.create"
  | "billing.payment.update"
  | "billing.payment.view"
  | "billing.plan.create"
  | "billing.plan.delete"
  | "billing.plan.update"
  | "billing.plan.view"
  | "billing.student-finance.view"
  | "billing.subscription.create"
  | "billing.subscription.renew"
  | "billing.subscription.update"
  | "billing.subscription.view"
  // Content
  | "content.banner.create"
  | "content.banner.delete"
  | "content.banner.update"
  | "content.banner.view"
  | "content.news.create"
  | "content.news.delete"
  | "content.news.update"
  | "content.news.view"
  | "content.notification.create"
  | "content.notification.delete"
  | "content.notification.inbox"
  | "content.notification.publish"
  | "content.notification.update"
  | "content.notification.view"
  | "content.pdf.create"
  | "content.pdf.delete"
  | "content.pdf.update"
  | "content.pdf.view"
  | "content.quiz.create"
  | "content.quiz.delete"
  | "content.quiz.update"
  | "content.quiz.view"
  | "content.quiz-attempt.submit"
  | "content.quiz-attempt.view"
  | "content.video.create"
  | "content.video.delete"
  | "content.video.update"
  | "content.video.view"
  // Curriculum
  | "curriculum.chapter.create"
  | "curriculum.chapter.delete"
  | "curriculum.chapter.update"
  | "curriculum.chapter.view"
  | "curriculum.course.create"
  | "curriculum.course.delete"
  | "curriculum.course.publish"
  | "curriculum.course.update"
  | "curriculum.course.view"
  | "curriculum.exam.create"
  | "curriculum.exam.delete"
  | "curriculum.exam.duplicate"
  | "curriculum.exam.grade"
  | "curriculum.exam.update"
  | "curriculum.exam.view"
  | "curriculum.exam-result.submit"
  | "curriculum.exam-result.view"
  | "curriculum.lesson.create"
  | "curriculum.lesson.delete"
  | "curriculum.lesson.update"
  | "curriculum.lesson.view"
  | "curriculum.reference.create"
  | "curriculum.reference.delete"
  | "curriculum.reference.update"
  | "curriculum.reference.view"
  | "curriculum.session.book"
  | "curriculum.session.create"
  | "curriculum.session.delete"
  | "curriculum.session.update"
  | "curriculum.session.view"
  | "curriculum.subject.create"
  | "curriculum.subject.delete"
  | "curriculum.subject.update"
  | "curriculum.subject.view"
  | "curriculum.unit.create"
  | "curriculum.unit.delete"
  | "curriculum.unit.update"
  | "curriculum.unit.view"
  // Enrollment
  | "enrollment.enrollment.cancel"
  | "enrollment.enrollment.create"
  | "enrollment.enrollment.view"
  // Identity
  | "identity.dashboard.view"
  | "identity.parent.create"
  | "identity.parent.delete"
  | "identity.parent.update"
  | "identity.parent.view"
  | "identity.permission.assign"
  | "identity.permission.view"
  | "identity.platform-setting.update"
  | "identity.platform-setting.view"
  | "identity.profile.view"
  | "identity.reference.create"
  | "identity.reference.delete"
  | "identity.reference.update"
  | "identity.reference.view"
  | "identity.role.update"
  | "identity.role.view"
  | "identity.student.create"
  | "identity.student.delete"
  | "identity.student.update"
  | "identity.student.view"
  | "identity.teacher.create"
  | "identity.teacher.delete"
  | "identity.teacher.dues"
  | "identity.teacher.update"
  | "identity.teacher.view"
  | "identity.teaching-level.create"
  | "identity.teaching-level.delete"
  | "identity.teaching-level.update"
  | "identity.teaching-level.view"
  | "identity.user.assignRoles"
  | "identity.user.create"
  | "identity.user.delete"
  | "identity.user.update"
  | "identity.user.view"
  // Extensible string literal for custom permissions
  | (string & {})

export interface UserPermissionsProfile {
  userId: string
  email: string
  fullName: string
  roles: string[]
  permissions: string[]
}

export interface CheckPermissionOptions {
  permission?: AppPermission
  anyPermissions?: AppPermission[]
  allPermissions?: AppPermission[]
  role?: string
  roles?: string[]
}

/**
 * Checks if user permissions include a specific permission.
 * Handles exact matches and wildcard (*) permissions.
 */
export function hasPermission(
  userPermissions: string[] | undefined,
  requiredPermission?: AppPermission
): boolean {
  if (!requiredPermission) return true
  if (!userPermissions || userPermissions.length === 0) return false

  const target = requiredPermission.toLowerCase().trim()

  // Global wildcard support
  if (
    userPermissions.some((p) => {
      const lower = p.toLowerCase().trim()
      return lower === "*" || lower === "admin"
    })
  ) {
    return true
  }

  // Exact match (case-insensitive)
  if (userPermissions.some((p) => p.toLowerCase().trim() === target)) {
    return true
  }

  // Module level wildcard (e.g., "curriculum.*" matches "curriculum.course.view")
  const parts = target.split(".")
  if (parts.length > 1) {
    const moduleWildcard = `${parts[0]}.*`
    if (userPermissions.some((p) => p.toLowerCase().trim() === moduleWildcard)) {
      return true
    }

    if (parts.length > 2) {
      const entityWildcard = `${parts[0]}.${parts[1]}.*`
      if (userPermissions.some((p) => p.toLowerCase().trim() === entityWildcard)) {
        return true
      }
    }
  }

  return false
}

/**
 * Checks if user has at least one of the specified permissions.
 */
export function hasAnyPermission(
  userPermissions: string[] | undefined,
  requiredPermissions?: AppPermission[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) return true
  if (!userPermissions || userPermissions.length === 0) return false

  return requiredPermissions.some((perm) => hasPermission(userPermissions, perm))
}

/**
 * Checks if user has all of the specified permissions.
 */
export function hasAllPermissions(
  userPermissions: string[] | undefined,
  requiredPermissions?: AppPermission[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) return true
  if (!userPermissions || userPermissions.length === 0) return false

  return requiredPermissions.every((perm) => hasPermission(userPermissions, perm))
}

/**
 * Checks if user has a specific role.
 */
export function hasRole(
  userRoles: string[] | undefined,
  requiredRole?: string
): boolean {
  if (!requiredRole) return true
  if (!userRoles || userRoles.length === 0) return false

  return userRoles.some(
    (role) => role.toLowerCase() === requiredRole.toLowerCase()
  )
}

/**
 * Checks if user has at least one of the specified roles.
 */
export function hasAnyRole(
  userRoles: string[] | undefined,
  requiredRoles?: string[]
): boolean {
  if (!requiredRoles || requiredRoles.length === 0) return true
  if (!userRoles || userRoles.length === 0) return false

  return requiredRoles.some((role) => hasRole(userRoles, role))
}

/**
 * Combined evaluator supporting single permission, any permissions, all permissions, and roles.
 */
export function evaluatePermissions(
  userPermissions: string[] | undefined,
  userRoles: string[] | undefined,
  options: CheckPermissionOptions
): boolean {
  // If user has Admin role, grant full dashboard access
  if (hasAnyRole(userRoles, ["Admin", "SuperAdmin", "Administrator", "admin"])) {
    return true
  }

  const { permission, anyPermissions, allPermissions, role, roles } = options

  // 1. Single Role check
  if (role && !hasRole(userRoles, role)) {
    return false
  }

  // 2. Any Roles check
  if (roles && roles.length > 0) {
    if (!hasAnyRole(userRoles, roles)) return false
  }

  // 3. Single permission check
  if (permission && !hasPermission(userPermissions, permission)) {
    return false
  }

  // 4. Any permissions check (at least one must match)
  if (anyPermissions && anyPermissions.length > 0) {
    if (!hasAnyPermission(userPermissions, anyPermissions)) return false
  }

  // 5. All permissions check (every permission must match)
  if (allPermissions && allPermissions.length > 0) {
    if (!hasAllPermissions(userPermissions, allPermissions)) return false
  }

  return true
}

