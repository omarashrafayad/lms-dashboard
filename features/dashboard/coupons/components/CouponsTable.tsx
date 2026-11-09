"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { Coupon } from "../types/coupons.types"
import {
  Copy,
  Check,
  Trash2,
  Power,
  PowerOff,
  Percent,
  DollarSign,
  Edit2,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"

export interface CouponsTableProps {
  coupons: Coupon[]
  onToggleStatus: (coupon: Coupon) => void
  onEdit: (coupon: Coupon) => void
  onDelete: (id: string) => void
  isToggling?: boolean
  isDeleting?: boolean
}

export function CouponsTable({
  coupons,
  onToggleStatus,
  onEdit,
  onDelete,
  isToggling = false,
  isDeleting = false,
}: CouponsTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    toast.success(`Coupon code "${code}" copied to clipboard!`)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const columns: UniTableColumn<Coupon>[] = [
    {
      id: "code",
      header: "Coupon Code",
      cell: (_, row) => (
        <div className="flex items-center gap-2 py-1">
          <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
            {row.code}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(row.code, row.id)}
            className="size-7 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Copy code"
          >
            {copiedId === row.id ? (
              <Check className="size-3.5 text-emerald-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        </div>
      ),
    },
    {
      id: "discount",
      header: "Discount",
      cell: (_, row) => {
        const isPercent =
          String(row.discountType).toLowerCase() === "percentage" ||
          row.discountLabel?.includes("%")

        return (
          <div className="flex items-center gap-1.5 py-1">
            {isPercent ? (
              <div className="size-6 rounded-md bg-amber-50 text-brand-orange flex items-center justify-center shrink-0">
                <Percent className="size-3.5" />
              </div>
            ) : (
              <div className="size-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <DollarSign className="size-3.5" />
              </div>
            )}
            <span className="text-xs font-bold text-zinc-900">
              {row.discountLabel ||
                (isPercent ? `${row.discountValue}% OFF` : `$${row.discountValue} OFF`)}
            </span>
          </div>
        )
      },
    },
    {
      id: "applicableScope",
      header: "Scope",
      cell: (_, row) => {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60">
            {row.scopeLabel || row.applicableScope || "All"}
          </span>
        )
      },
    },
    {
      id: "usage",
      header: "Redemptions",
      cell: (_, row) => {
        const limit = row.usageLimit
        const used = row.redemptionCount || 0
        const pct = limit && limit > 0 ? Math.min(100, Math.round((used * 100) / limit)) : 0

        return (
          <div className="flex flex-col gap-1 min-w-[110px] py-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-zinc-900">{used}</span>
              <span className="text-zinc-400">
                {limit && limit > 0 ? `/ ${limit}` : "/ Unlimited"}
              </span>
            </div>
            {limit && limit > 0 && (
              <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    pct >= 100
                      ? "bg-rose-500"
                      : pct >= 80
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "minOrderAmount",
      header: "Min Order",
      cell: (_, row) => {
        return (
          <span className="text-xs text-zinc-600">
            {row.minOrderAmount ? `$${row.minOrderAmount}` : "No min"}
          </span>
        )
      },
    },
    {
      id: "expiresAt",
      header: "Expiration",
      cell: (_, row) => {
        if (!row.expiresAt) {
          return <span className="text-xs text-zinc-400">No expiration</span>
        }
        try {
          const date = new Date(row.expiresAt)
          const isExpired = date.getTime() < Date.now()
          return (
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="size-3.5 text-zinc-400" />
              <span className={isExpired ? "text-rose-600 font-medium" : "text-zinc-700"}>
                {date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )
        } catch {
          return <span className="text-xs text-zinc-400">—</span>
        }
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (_, row) => {
        const active = row.isActive && row.status?.toLowerCase() !== "expired"
        const isExpired = row.status?.toLowerCase() === "expired"

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              active
                ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                : isExpired
                ? "text-rose-700 bg-rose-50 border-rose-200/60"
                : "text-zinc-500 bg-zinc-50 border-zinc-200"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                active ? "bg-emerald-500" : isExpired ? "bg-rose-500" : "bg-zinc-400"
              }`}
            />
            {isExpired ? "Expired" : active ? "Active" : "Disabled"}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (_, row) => {
        const active = row.isActive
        return (
          <div className="flex items-center gap-1 py-1">
            {/* Toggle Status */}
            <button
              type="button"
              disabled={isToggling}
              onClick={() => onToggleStatus(row)}
              className={`size-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
                active
                  ? "border-zinc-200 bg-white hover:bg-zinc-50 text-amber-600 hover:text-amber-700"
                  : "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
              }`}
              title={active ? "Deactivate coupon" : "Activate coupon"}
            >
              {active ? (
                <PowerOff className="size-3.5" />
              ) : (
                <Power className="size-3.5" />
              )}
            </button>

            {/* Edit */}
            <button
              type="button"
              onClick={() => onEdit(row)}
              className="size-8 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Edit coupon"
            >
              <Edit2 className="size-3.5" />
            </button>

            {/* Delete */}
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(row.id)}
              className="size-8 rounded-lg border border-zinc-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-zinc-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Delete coupon"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <UniTable<Coupon>
      data={coupons}
      columns={columns}
      getRowId={(c: Coupon) => c.id}
      emptyMessage="No discount coupons match your current criteria. Create a new coupon to start offering discounts."
    />
  )
}
