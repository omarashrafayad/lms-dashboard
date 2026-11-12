import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getPlatformSettings,
  updatePlatformSettings,
  UpdatePlatformSettingsPayload,
} from "../api/platformSettingsApi"

export const PLATFORM_SETTINGS_KEY = ["platform-settings"]

export const usePlatformSettings = () => {
  return useQuery({
    queryKey: PLATFORM_SETTINGS_KEY,
    queryFn: getPlatformSettings,
    staleTime: 1000 * 60 * 5,
  })
}

export const useUpdatePlatformSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdatePlatformSettingsPayload) =>
      updatePlatformSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(PLATFORM_SETTINGS_KEY, updated)
      queryClient.invalidateQueries({ queryKey: PLATFORM_SETTINGS_KEY })
    },
  })
}

