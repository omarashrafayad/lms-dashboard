import clientAxios from "@/lib/axios/clientAxios"
import {
  Banner,
  BannerPagedResponse,
  BannerQueryParams,
  CreateBannerPayload,
  UpdateBannerPayload,
} from "../types/banner.types"

export const getBanners = async (
  params: BannerQueryParams = {}
): Promise<BannerPagedResponse> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.active !== undefined) queryParams.active = params.active

  const res = await clientAxios.get("/content/banners/getall", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })

  const raw = res.data?.data || res.data

  if (raw && Array.isArray(raw.items)) {
    let items = raw.items as Banner[]
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase()
      items = items.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.linkUrl?.toLowerCase().includes(q)
      )
    }
    return {
      items,
      totalCount: raw.totalCount ?? items.length,
      page: raw.page ?? (params.page || 1),
      pageSize: raw.pageSize ?? (params.pageSize || 20),
      totalPages: raw.totalPages ?? Math.max(1, Math.ceil((raw.totalCount ?? items.length) / (params.pageSize || 20))),
    }
  }

  if (Array.isArray(raw)) {
    let items = raw as Banner[]
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase()
      items = items.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.linkUrl?.toLowerCase().includes(q)
      )
    }
    return {
      items,
      totalCount: items.length,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      totalPages: Math.max(1, Math.ceil(items.length / (params.pageSize || 20))),
    }
  }

  return {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    totalPages: 1,
  }
}

export const getActiveBanners = async (limit: number = 0): Promise<Banner[]> => {
  const res = await clientAxios.get("/content/banners/active", {
    params: limit > 0 ? { limit } : undefined,
  })
  const raw = res.data?.data || res.data
  return Array.isArray(raw) ? raw : []
}

export const getBannerById = async (bannerId: string): Promise<Banner> => {
  const res = await clientAxios.get(`/content/banners/${bannerId}`)
  return res.data?.data || res.data
}

export const createBanner = async (
  payload: CreateBannerPayload | FormData
): Promise<Banner> => {
  let body: FormData
  if (payload instanceof FormData) {
    body = payload
  } else {
    body = new FormData()
    body.append("Title", payload.title || "")
    body.append("LinkUrl", payload.linkUrl || "")
    body.append("Order", String(payload.order ?? 0))
    body.append("IsActive", String(payload.isActive ?? true))
    if (payload.image) {
      body.append("image", payload.image)
    }
  }

  const res = await clientAxios.post("/content/banners", body, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data?.data || res.data
}

export const updateBanner = async (
  bannerId: string,
  payload: UpdateBannerPayload | FormData
): Promise<Banner> => {
  let body: FormData
  if (payload instanceof FormData) {
    body = payload
  } else {
    body = new FormData()
    if (payload.title !== undefined) body.append("Title", payload.title)
    if (payload.linkUrl !== undefined) body.append("LinkUrl", payload.linkUrl)
    if (payload.order !== undefined) body.append("Order", String(payload.order))
    if (payload.isActive !== undefined) body.append("IsActive", String(payload.isActive))
    if (payload.image) {
      body.append("image", payload.image)
    }
  }

  const res = await clientAxios.put(`/content/banners/${bannerId}`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data?.data || res.data
}

export const deleteBanner = async (bannerId: string): Promise<void> => {
  await clientAxios.delete(`/content/banners/${bannerId}`)
}

