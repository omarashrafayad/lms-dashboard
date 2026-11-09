import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCoupons,
  getCouponStats,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
} from "../api/couponsApi"
import {
  CreateCouponPayload,
  UpdateCouponPayload,
  CouponQueryParams,
} from "../types/coupons.types"

export const useCoupons = (params: CouponQueryParams = {}) => {
  return useQuery({
    queryKey: ["coupons", params],
    queryFn: () => getCoupons(params),
  })
}

export const useCoupon = (id?: string) => {
  return useQuery({
    queryKey: ["coupons", id],
    queryFn: () => getCouponById(id!),
    enabled: Boolean(id),
  })
}

export const useCouponStats = () => {
  return useQuery({
    queryKey: ["coupon-stats"],
    queryFn: getCouponStats,
  })
}

export const useCreateCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCouponPayload) => createCoupon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
      queryClient.invalidateQueries({ queryKey: ["coupon-stats"] })
    },
  })
}

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCouponPayload }) =>
      updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
      queryClient.invalidateQueries({ queryKey: ["coupon-stats"] })
    },
  })
}

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
      queryClient.invalidateQueries({ queryKey: ["coupon-stats"] })
    },
  })
}

export const useToggleCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
      queryClient.invalidateQueries({ queryKey: ["coupon-stats"] })
    },
  })
}
