export interface RoleItem {
  roleId: string
  name: string
  userCount: number
  permissions: string[]
}

export interface PermissionItem {
  code: string
  module: string
  entity: string
  action: string
  description: string
}

export interface UpdateRolePermissionsPayload {
  permissions: string[]
}

export interface UserRoleItem {
  userId: string
  email?: string | null
  fullName?: string | null
  roles?: string[]
  permissions?: string[]
}

export interface UpdateUserRolesPayload {
  roles: string[]
}

