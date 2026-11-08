"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { Coupon } from "../types/coupons.types"
import { Copy, Check, Trash2, Power, PowerOff, Percent, DollarSign } from "lucide-react"
import { toast } from "sonner"

export interface CouponsTableProps {
  coupons: Coupon[]
  onToggleStatus: (coupon: Coupon) => void
  onDelete: (id: string) => void
}

export function CouponsTable({
  coupons,
  onToggleStatus,
  onDelete,
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
      cell: (_, row) => (
        <div className="flex items-center gap-1.5 py-1">
          {row.discountType === "percentage" ? (
            <div className="size-6 rounded-md bg-amber-50 text-brand-orange flex items-center justify-center">
              <Percent className="size-3.5" />
            </div>
          ) : (
            <div className="size-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="size-3.5" />
            </div>
          )}
          <span className="text-xs font-bold text-zinc-900">
            {row.discountType === "percentage"
              ? `${row.discountValue}% OFF`
              : `$${row.discountValue} OFF`}
          </span>
        </div>
      ),
    },
    {
      id: "applicableTo",
      header: "Applicable To",
      cell: (_, row) => {
        const labels: Record<string, string> = {
          all: "All Products",
          courses: "Courses Only",
          subscriptions: "Subscriptions Only",
        }
        return (
          <span className="text-xs font-medium text-zinc-700">
            {labels[row.applicableTo] || row.applicableTo}
          </span>
        )
      },
    },
    {
      id: "usage",
      header: "Redemptions",
      cell: (_, row) => {
        const limit = row.usageLimit
        const pct = limit ? Math.min(100, Math.round((row.usedCount * 100) / limit)) : 0
        return (
          <div className="flex flex-col gap-1 min-w-[120px] py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-900">{row.usedCount}</span>
              <span className="text-zinc-400">
                {limit ? `/ ${limit}` : "Unlimited"}
              </span>
            </div>
            {limit && (
              <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    pct >= 100 ? "bg-rose-500" : "bg-brand-orange"
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
      id: "validity",
      header: "Valid Till",
      cell: (_, row) => {
        if (!row.endDate) {
          return <span className="text-xs text-zinc-400 font-medium">No Expiry</span>
        }
        const d = new Date(row.endDate)
        const isPast = d < new Date()
        return (
          <span
            className={`text-xs font-medium ${
              isPast ? "text-rose-500 font-semibold" : "text-zinc-600"
            }`}
          >
            {d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (_, row) => {
        const isExpired = row.status === "expired" || (row.endDate && new Date(row.endDate) < new Date())
        if (isExpired) {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
              Expired
            </span>
          )
        }
        if (row.status === "disabled") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
              Disabled
            </span>
          )
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggleStatus(row)}
            className={`size-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
              row.status === "active"
                ? "border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-800"
                : "border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800"
            }`}
            title={row.status === "active" ? "Disable coupon" : "Activate coupon"}
          >
            {row.status === "active" ? (
              <PowerOff className="size-3.5" />
            ) : (
              <Power className="size-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onDelete(row.id)}
            className="size-8 rounded-xl border border-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-zinc-400 flex items-center justify-center transition-colors cursor-pointer"
            title="Delete coupon"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <UniTable
        data={coupons}
        columns={columns}
        enablePagination={true}
        pageSize={10}
        itemLabel="Coupons"
        emptyMessage="No promotional coupons found."
      />
    </div>
  )
}
