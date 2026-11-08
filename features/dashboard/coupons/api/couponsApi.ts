import {
  Coupon,
  CreateCouponPayload,
  UpdateCouponPayload,
  CouponQueryParams,
} from "../types/coupons.types"

const STORAGE_KEY = "lms_coupons_data"

// Default seed list if storage is empty
const INITIAL_COUPONS: Coupon[] = [
  {
    id: "cpn-welcome-20",
    code: "WELCOME20",
    discountType: "percentage",
    discountValue: 20,
    applicableTo: "all",
    usageLimit: 100,
    usedCount: 34,
    minPurchaseAmount: 50,
    startDate: "2026-10-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.000Z",
    status: "active",
    createdAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: "cpn-black-friday",
    code: "BLACKFRIDAY",
    discountType: "percentage",
    discountValue: 40,
    applicableTo: "subscriptions",
    usageLimit: 50,
    usedCount: 50,
    minPurchaseAmount: 100,
    startDate: "2026-10-15T00:00:00.000Z",
    endDate: "2026-11-01T23:59:59.000Z",
    status: "expired",
    createdAt: "2026-10-15T12:00:00.000Z",
  },
  {
    id: "cpn-vip-fixed",
    code: "VIP50OFF",
    discountType: "fixed",
    discountValue: 50,
    applicableTo: "courses",
    usageLimit: 200,
    usedCount: 18,
    minPurchaseAmount: 150,
    startDate: "2026-11-01T00:00:00.000Z",
    endDate: null,
    status: "active",
    createdAt: "2026-11-01T08:30:00.000Z",
  },
]

const getStoredCoupons = (): Coupon[] => {
  if (typeof window === "undefined") return INITIAL_COUPONS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COUPONS))
      return INITIAL_COUPONS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_COUPONS
  }
}

const saveStoredCoupons = (coupons: Coupon[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons))
  } catch (err) {
    console.error("Failed to save coupons to storage", err)
  }
}

export const getCoupons = async (
  params: CouponQueryParams = {}
): Promise<Coupon[]> => {
  await new Promise((r) => setTimeout(r, 120))
  let list = getStoredCoupons()

  if (params.status && params.status !== "all") {
    list = list.filter((c) => c.status === params.status)
  }

  if (params.discountType && params.discountType !== "all") {
    list = list.filter((c) => c.discountType === params.discountType)
  }

  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase()
    list = list.filter((c) => c.code.toLowerCase().includes(q))
  }

  return list
}

export const createCoupon = async (
  payload: CreateCouponPayload
): Promise<Coupon> => {
  await new Promise((r) => setTimeout(r, 150))
  const list = getStoredCoupons()

  // Validate unique code
  const codeNormalized = payload.code.trim().toUpperCase()
  if (list.some((c) => c.code.toUpperCase() === codeNormalized)) {
    throw new Error(`Coupon with code "${codeNormalized}" already exists.`)
  }

  const newCoupon: Coupon = {
    id: `cpn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    code: codeNormalized,
    discountType: payload.discountType,
    discountValue: Number(payload.discountValue),
    applicableTo: payload.applicableTo,
    usageLimit: payload.usageLimit ? Number(payload.usageLimit) : null,
    usedCount: 0,
    minPurchaseAmount: payload.minPurchaseAmount
      ? Number(payload.minPurchaseAmount)
      : null,
    startDate: new Date().toISOString(),
    endDate: payload.endDate || null,
    status: payload.status,
    createdAt: new Date().toISOString(),
  }

  const updated = [newCoupon, ...list]
  saveStoredCoupons(updated)
  return newCoupon
}

export const updateCoupon = async (
  id: string,
  payload: UpdateCouponPayload
): Promise<Coupon> => {
  await new Promise((r) => setTimeout(r, 150))
  const list = getStoredCoupons()
  const idx = list.findIndex((c) => c.id === id)
  if (idx === -1) {
    throw new Error("Coupon not found.")
  }

  const existing = list[idx]
  const updatedCoupon: Coupon = {
    ...existing,
    ...payload,
    code: payload.code ? payload.code.trim().toUpperCase() : existing.code,
  }

  list[idx] = updatedCoupon
  saveStoredCoupons(list)
  return updatedCoupon
}

export const deleteCoupon = async (id: string): Promise<void> => {
  await new Promise((r) => setTimeout(r, 150))
  const list = getStoredCoupons()
  const filtered = list.filter((c) => c.id !== id)
  saveStoredCoupons(filtered)
}

