import clientAxios from "@/lib/axios/clientAxios"

export interface PlatformSettings {
  applicationPercentage: number
}

export interface UpdatePlatformSettingsPayload {
  applicationPercentage: number
}

export const getPlatformSettings = async (): Promise<PlatformSettings> => {
  const res = await clientAxios.get("/platform-settings")
  return res.data?.data || res.data
}

export const updatePlatformSettings = async (
  payload: UpdatePlatformSettingsPayload
): Promise<PlatformSettings> => {
  const res = await clientAxios.put("/platform-settings", payload)
  return res.data?.data || res.data
}

