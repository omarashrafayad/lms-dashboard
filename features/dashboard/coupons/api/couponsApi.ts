import clientAxios from "@/lib/axios/clientAxios"
import {
  Coupon,
  CouponStats,
  CreateCouponPayload,
  UpdateCouponPayload,
  CouponQueryParams,
} from "../types/coupons.types"

export const getCoupons = async (
  params: CouponQueryParams = {}
): Promise<Coupon[]> => {
  const queryParams: Record<string, any> = {}
  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim()
  }
  if (params.status && params.status !== "all") {
    queryParams.status = params.status
  }
  if (params.discountType && params.discountType !== "all") {
    queryParams.discountType = params.discountType
  }

  const res = await clientAxios.get("/billing/coupons", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })

  const raw = res.data?.data || res.data
  if (Array.isArray(raw)) {
    return raw
  }
  return []
}

export const getCouponStats = async (): Promise<CouponStats> => {
  const res = await clientAxios.get("/billing/coupons/stats")
  const data = res.data?.data || res.data
  return {
    totalCodes: Number(data?.totalCodes ?? 0),
    activeCodes: Number(data?.activeCodes ?? 0),
    totalRedemptions: Number(data?.totalRedemptions ?? 0),
    avgDiscountRatePercent: Number(data?.avgDiscountRatePercent ?? 0),
  }
}

export const getCouponById = async (id: string): Promise<Coupon> => {
  const res = await clientAxios.get(`/billing/coupons/${id}`)
  return res.data?.data || res.data
}

export const createCoupon = async (
  payload: CreateCouponPayload
): Promise<Coupon> => {
  const res = await clientAxios.post("/billing/coupons", payload)
  return res.data?.data || res.data
}

export const updateCoupon = async (
  id: string,
  payload: UpdateCouponPayload
): Promise<Coupon> => {
  const res = await clientAxios.put(`/billing/coupons/${id}`, payload)
  return res.data?.data || res.data
}

export const deleteCoupon = async (id: string): Promise<void> => {
  await clientAxios.delete(`/billing/coupons/${id}`)
}

export const toggleCoupon = async (id: string): Promise<Coupon> => {
  const res = await clientAxios.post(`/billing/coupons/${id}/toggle`)
  return res.data?.data || res.data
}
