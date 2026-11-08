export type DiscountType = "percentage" | "fixed"
export type CouponStatus = "active" | "expired" | "disabled"
export type CouponScope = "all" | "courses" | "subscriptions"

export interface Coupon {
  id: string
  code: string
  discountType: DiscountType
  discountValue: number
  applicableTo: CouponScope
  usageLimit?: number | null
  usedCount: number
  minPurchaseAmount?: number | null
  startDate: string
  endDate?: string | null
  status: CouponStatus
  createdAt: string
}

export interface CreateCouponPayload {
  code: string
  discountType: DiscountType
  discountValue: number
  applicableTo: CouponScope
  usageLimit?: number | null
  minPurchaseAmount?: number | null
  endDate?: string | null
  status: "active" | "disabled"
}

export interface UpdateCouponPayload {
  code?: string
  discountType?: DiscountType
  discountValue?: number
  applicableTo?: CouponScope
  usageLimit?: number | null
  minPurchaseAmount?: number | null
  endDate?: string | null
  status?: CouponStatus
}

export interface CouponQueryParams {
  status?: string
  discountType?: string
  search?: string
}

