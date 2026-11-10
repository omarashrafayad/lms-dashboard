import clientAxios from "@/lib/axios/clientAxios"
import {
  RoleItem,
  PermissionItem,
  UpdateRolePermissionsPayload,
  UserRoleItem,
  UpdateUserRolesPayload,
} from "../types/roles.types"

export const getRoles = async (): Promise<RoleItem[]> => {
  const res = await clientAxios.get("/roles")
  const data = res.data?.data ?? res.data
  return Array.isArray(data) ? data : data?.items || []
}

export const getRolePermissions = async (
  roleId: string
): Promise<RoleItem> => {
  const res = await clientAxios.get(`/roles/${roleId}/permissions`)
  const data = res.data?.data ?? res.data
  if (Array.isArray(data)) {
    return data[0] || { roleId, name: "Role", userCount: 0, permissions: [] }
  }
  return data
}

export const updateRolePermissions = async (
  roleId: string,
  payload: UpdateRolePermissionsPayload
): Promise<void> => {
  await clientAxios.put(`/roles/${roleId}/permissions`, payload)
}

export const getPermissions = async (): Promise<PermissionItem[]> => {
  const res = await clientAxios.get("/permissions")
  const data = res.data?.data ?? res.data
  return Array.isArray(data) ? data : data?.items || []
}

export const getMyPermissions = async (): Promise<string[]> => {
  const res = await clientAxios.get("/permissions/me")
  const data = res.data?.data ?? res.data
  if (Array.isArray(data)) {
    return data.map((item) => (typeof item === "string" ? item : item.code || ""))
  }
  return []
}

export const getUserRoles = async (userId: string): Promise<UserRoleItem> => {
  const res = await clientAxios.get(`/users/${userId}/roles`)
  return res.data?.data ?? res.data
}

export const updateUserRoles = async (
  userId: string,
  payload: UpdateUserRolesPayload
): Promise<void> => {
  await clientAxios.put(`/users/${userId}/roles`, payload)
}

