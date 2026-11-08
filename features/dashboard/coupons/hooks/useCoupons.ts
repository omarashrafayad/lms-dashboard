"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../api/couponsApi"
import {
  CouponQueryParams,
  CreateCouponPayload,
  UpdateCouponPayload,
} from "../types/coupons.types"

export const useCoupons = (params: CouponQueryParams = {}) => {
  return useQuery({
    queryKey: ["coupons", params],
    queryFn: () => getCoupons(params),
  })
}

export const useCreateCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCouponPayload) => createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
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
    },
  })
}

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
    },
  })
}

