import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getBanners,
  getActiveBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../api/bannerApi"
import {
  Banner,
  BannerQueryParams,
  CreateBannerPayload,
  UpdateBannerPayload,
} from "../types/banner.types"

export const useBanners = (params: BannerQueryParams = {}) => {
  return useQuery({
    queryKey: ["banners", params],
    queryFn: () => getBanners(params),
  })
}

export const useActiveBanners = (limit: number = 0) => {
  return useQuery({
    queryKey: ["banners", "active", limit],
    queryFn: () => getActiveBanners(limit),
  })
}

export const useBanner = (bannerId?: string) => {
  return useQuery({
    queryKey: ["banners", bannerId],
    queryFn: () => getBannerById(bannerId!),
    enabled: Boolean(bannerId),
  })
}

export const useCreateBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateBannerPayload | FormData) => createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] })
    },
  })
}

export const useUpdateBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      bannerId,
      data,
    }: {
      bannerId: string
      data: UpdateBannerPayload | FormData
    }) => updateBanner(bannerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] })
    },
  })
}

export const useDeleteBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bannerId: string) => deleteBanner(bannerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] })
    },
  })
}

export const useToggleBannerActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ banner }: { banner: Banner }) => {
      const formData = new FormData()
      formData.append("Title", banner.title || "")
      formData.append("LinkUrl", banner.linkUrl || "")
      formData.append("Order", String(banner.order ?? 0))
      formData.append("IsActive", String(!banner.isActive))
      return updateBanner(banner.id, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] })
    },
  })
}

