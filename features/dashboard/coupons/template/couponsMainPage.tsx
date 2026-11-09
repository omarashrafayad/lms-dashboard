"use client"

import * as React from "react"
import {
  Ticket,
  Plus,
  Search,
  CheckCircle2,
  Percent,
  TrendingUp,
  Tag,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import {
  useCoupons,
  useCouponStats,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  useToggleCoupon,
} from "../hooks/useCoupons"
import { CouponsTable } from "../components/CouponsTable"
import { CreateCouponModal } from "../components/CreateCouponModal"
import { EditCouponModal } from "../components/EditCouponModal"
import { Coupon, CreateCouponPayload, UpdateCouponPayload } from "../types/coupons.types"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CouponsMainPage() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [editingCoupon, setEditingCoupon] = React.useState<Coupon | null>(null)

  const {
    data: coupons = [],
    isLoading,
    isError,
    refetch,
  } = useCoupons({
    status: statusFilter,
    discountType: typeFilter,
    search,
  })

  const { data: stats } = useCouponStats()

  const createMutation = useCreateCoupon()
  const updateMutation = useUpdateCoupon()
  const deleteMutation = useDeleteCoupon()
  const toggleMutation = useToggleCoupon()

  // Calculate metrics (fallback to computed if stats endpoint returns 0 or undefined)
  const totalCodes = stats?.totalCodes ?? coupons.length
  const activeCodes =
    stats?.activeCodes ?? coupons.filter((c) => c.isActive).length
  const totalRedemptions =
    stats?.totalRedemptions ??
    coupons.reduce((acc, curr) => acc + (curr.redemptionCount || 0), 0)
  const avgDiscountRate =
    stats?.avgDiscountRatePercent ??
    (coupons.length > 0
      ? Math.round(
          coupons.reduce((acc, curr) => acc + Number(curr.discountValue || 0), 0) /
            coupons.length
        )
      : 0)

  const handleCreateSubmit = async (payload: CreateCouponPayload) => {
    try {
      await createMutation.mutateAsync(payload)
      toast.success(`Coupon "${payload.code}" created successfully!`)
      setIsCreateOpen(false)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleEditSubmit = async (id: string, payload: UpdateCouponPayload) => {
    try {
      await updateMutation.mutateAsync({ id, data: payload })
      toast.success("Coupon updated successfully!")
      setEditingCoupon(null)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await toggleMutation.mutateAsync(coupon.id)
      toast.success(
        coupon.isActive
          ? `Coupon ${coupon.code} deactivated`
          : `Coupon ${coupon.code} activated`
      )
    } catch (err: unknown) {
      // Fallback to update coupon status directly if toggle endpoint fails
      try {
        await updateMutation.mutateAsync({
          id: coupon.id,
          data: { isActive: !coupon.isActive },
        })
        toast.success(
          coupon.isActive
            ? `Coupon ${coupon.code} deactivated`
            : `Coupon ${coupon.code} activated`
        )
      } catch (innerErr: unknown) {
        toast.error(getErrorMessage(innerErr))
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
      return
    }
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Coupon deleted successfully")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20 animate-in fade-in duration-200">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center">
                <Ticket className="size-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                Coupons & Discounts
              </h1>
            </div>
            <p className="text-xs text-zinc-500">
              Create, configure, and monitor promotional coupon codes for student enrollments and subscriptions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="p-2.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-600 transition-colors cursor-pointer shadow-2xs"
              title="Refresh coupons"
            >
              <RefreshCw className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange/90 shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Create Coupon</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
            <div className="size-9 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center mb-3">
              <Tag className="size-4" />
            </div>
            <span className="text-2xl font-bold text-zinc-900">
              {totalCodes}
            </span>
            <span className="text-xs text-zinc-500 mt-0.5">Total Coupon Codes</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
            <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <CheckCircle2 className="size-4" />
            </div>
            <span className="text-2xl font-bold text-emerald-700">
              {activeCodes}
            </span>
            <span className="text-xs text-zinc-500 mt-0.5">Active & Usable</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
            <div className="size-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <TrendingUp className="size-4" />
            </div>
            <span className="text-2xl font-bold text-zinc-900">
              {totalRedemptions}
            </span>
            <span className="text-xs text-zinc-500 mt-0.5">Total Redemptions</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
            <div className="size-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center mb-3">
              <Percent className="size-4" />
            </div>
            <span className="text-2xl font-bold text-zinc-900">
              {avgDiscountRate}%
            </span>
            <span className="text-xs text-zinc-500 mt-0.5">Avg Discount Rate</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coupons by code..."
              className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-white border border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all shadow-2xs font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[150px]">
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-zinc-200/80 text-zinc-700 shadow-2xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                  <SelectItem value="Active" className="text-xs">Active</SelectItem>
                  <SelectItem value="Disabled" className="text-xs">Disabled</SelectItem>
                  <SelectItem value="Expired" className="text-xs">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[150px]">
              <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val ?? "all")}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-zinc-200/80 text-zinc-700 shadow-2xs">
                  <SelectValue placeholder="Discount Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">All Types</SelectItem>
                  <SelectItem value="Percentage" className="text-xs">Percentage (%)</SelectItem>
                  <SelectItem value="Fixed" className="text-xs">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <LoadingSpinner title="Loading coupons..." />
          </div>
        ) : isError ? (
          <div className="py-12">
            <GlobalError />
          </div>
        ) : (
          <CouponsTable
            coupons={coupons}
            onToggleStatus={handleToggleStatus}
            onEdit={(coupon) => setEditingCoupon(coupon)}
            onDelete={handleDelete}
            isToggling={toggleMutation.isPending || updateMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        )}
      </main>

      {/* Create Modal */}
      <CreateCouponModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmitCoupon={handleCreateSubmit}
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Modal */}
      <EditCouponModal
        open={Boolean(editingCoupon)}
        onOpenChange={(open) => {
          if (!open) setEditingCoupon(null)
        }}
        coupon={editingCoupon}
        onSubmitCoupon={handleEditSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  )
}
