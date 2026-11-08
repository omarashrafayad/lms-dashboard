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
} from "lucide-react"
import { toast } from "sonner"
import {
  useCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from "../hooks/useCoupons"
import { CouponsTable } from "../components/CouponsTable"
import { CreateCouponModal } from "../components/CreateCouponModal"
import { Coupon, CreateCouponPayload } from "../types/coupons.types"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export default function CouponsMainPage() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  const { data: coupons = [], isLoading, isError, refetch } = useCoupons({
    status: statusFilter,
    discountType: typeFilter,
    search,
  })

  const createMutation = useCreateCoupon()
  const updateMutation = useUpdateCoupon()
  const deleteMutation = useDeleteCoupon()

  // Calculate metrics
  const totalCoupons = coupons.length
  const activeCoupons = coupons.filter((c) => c.status === "active").length
  const totalRedemptions = coupons.reduce((acc, curr) => acc + (curr.usedCount || 0), 0)
  const avgDiscount =
    coupons.length > 0
      ? Math.round(
          coupons.reduce((acc, curr) => acc + curr.discountValue, 0) /
            coupons.length
        )
      : 0

  const handleCreateSubmit = async (payload: CreateCouponPayload) => {
    try {
      await createMutation.mutateAsync(payload)
      toast.success(`Coupon "${payload.code}" created successfully!`)
      setIsCreateOpen(false)
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      const nextStatus = coupon.status === "active" ? "disabled" : "active"
      await updateMutation.mutateAsync({
        id: coupon.id,
        data: { status: nextStatus },
      })
      toast.success(
        nextStatus === "active"
          ? `Coupon ${coupon.code} activated`
          : `Coupon ${coupon.code} disabled`
      )
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Coupon deleted successfully")
      refetch()
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
              <div className="size-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center shrink-0 border border-amber-200/60 shadow-2xs">
                <Ticket className="size-4.5" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Promotional Coupons
              </h1>
            </div>
            <p className="text-xs text-zinc-500 font-normal">
              Manage promotional discount vouchers, campaign codes and usage limits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Create Coupon</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-[#FFF9F2] text-brand-orange flex items-center justify-center shrink-0">
              <Tag className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                {totalCoupons}
              </span>
              <span className="text-xs font-medium text-zinc-400">
                Total Codes
              </span>
            </div>
          </div>

          {/* Card 2: Active */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                {activeCoupons}
              </span>
              <span className="text-xs font-medium text-zinc-400">
                Active Codes
              </span>
            </div>
          </div>

          {/* Card 3: Redemptions */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
              <TrendingUp className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                {totalRedemptions}
              </span>
              <span className="text-xs font-medium text-zinc-400">
                Total Redemptions
              </span>
            </div>
          </div>

          {/* Card 4: Avg Discount */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-[#FEF9C3] text-[#CA8A04] flex items-center justify-center shrink-0">
              <Percent className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                {avgDiscount}%
              </span>
              <span className="text-xs font-medium text-zinc-400">
                Avg. Discount Rate
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-2xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="size-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by coupon code..."
              className="w-full h-9 pl-9 pr-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/60 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
            />
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Segmented */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100/80 rounded-xl">
              {[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Expired", value: "expired" },
                { label: "Disabled", value: "disabled" },
              ].map((tab) => {
                const isActive = statusFilter === tab.value
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStatusFilter(tab.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
        </div>

        {/* Table Content or State */}
        {isLoading ? (
          <div className="p-16 flex items-center justify-center min-h-[300px]">
            <LoadingSpinner title="Loading coupons..." />
          </div>
        ) : isError ? (
          <div className="p-16 flex items-center justify-center min-h-[300px]">
            <GlobalError />
          </div>
        ) : (
          <CouponsTable
            coupons={coupons}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        )}

        {/* Create Coupon Modal */}
        <CreateCouponModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmitCoupon={handleCreateSubmit}
          isSubmitting={createMutation.isPending}
        />
      </main>
    </div>
  )
}

