export type DiscountType = "Percentage" | "Fixed" | "percentage" | "fixed"
export type CouponStatus = "Active" | "Expired" | "Disabled" | "active" | "expired" | "disabled"
export type ApplicableScope = "All" | "Courses" | "Subscriptions" | "Bundles" | "all" | "courses" | "subscriptions" | "bundles"

export interface Coupon {
  id: string
  code: string
  discountType: string
  discountValue: number
  discountLabel?: string | null
  applicableScope: string
  scopeLabel?: string | null
  usageLimit?: number | null
  remainingUses?: number | null
  minOrderAmount?: number | null
  expiresAt?: string | null
  redemptionCount: number
  isActive: boolean
  status: string
  createdAt: string
}

export interface CouponStats {
  totalCodes: number
  activeCodes: number
  totalRedemptions: number
  avgDiscountRatePercent: number
}

export interface CreateCouponPayload {
  code: string
  discountType: string
  discountValue: number
  applicableScope: string
  usageLimit?: number | null
  minOrderAmount?: number | null
  expiresAt?: string | null
  isActive: boolean
}

export interface UpdateCouponPayload {
  code?: string
  discountType?: string
  discountValue?: number
  applicableScope?: string
  usageLimit?: number | null
  minOrderAmount?: number | null
  expiresAt?: string | null
  isActive?: boolean
}

export interface CouponQueryParams {
  status?: string
  discountType?: string
  search?: string
}
