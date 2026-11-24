import clientAxios from "@/lib/axios/clientAxios"
import { useAuthStore } from "@/stores/useAuthStore"
import { UserPermissionsProfile } from "./permissions"

export const PERMISSIONS_QUERY_KEY = ["permissions", "me"] as const

/**
 * Fetches the currently authenticated user's permissions and profile details.
 * Endpoint: GET /permissions/me
 */
export async function fetchMyPermissions(): Promise<UserPermissionsProfile> {
  const res = await clientAxios.get("/permissions/me")
  const data = res.data?.data ?? res.data

  // Safe fallback if the backend directly returns an array of strings
  if (Array.isArray(data)) {
    const permissions = data.map((item) =>
      typeof item === "string" ? item : item?.code || ""
    ).filter(Boolean)

    return {
      userId: "",
      email: "",
      fullName: "",
      roles: [],
      permissions,
    }
  }

  // Standard object response matching the user's provided schema
  const permissionsRaw = Array.isArray(data?.permissions) ? data.permissions : []
  const permissions = permissionsRaw.map((p: any) =>
    typeof p === "string" ? p : p?.code || ""
  ).filter(Boolean)

  const storeRoles = useAuthStore.getState().user?.roles || []
  const roles = (Array.isArray(data?.roles) && data.roles.length > 0)
    ? data.roles
    : storeRoles

  return {
    userId: data?.userId || "",
    email: data?.email || "",
    fullName: data?.fullName || "",
    roles,
    permissions,
  }
}
