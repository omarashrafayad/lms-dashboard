"use client"

import * as React from "react"
import {
  Search,
  FileText,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Receipt,
  CreditCard,
  Ban,
} from "lucide-react"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import EmptyState from "@/components/shared/EmptyState"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { TransactionItem } from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TransactionsTableProps {
  transactions: TransactionItem[]
  isLoading?: boolean
  onViewInvoice: (transaction: TransactionItem) => void
  onRefund: (transaction: TransactionItem) => void
  onRecordPayment?: () => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onMarkFailed?: (id: string) => void
}

export function TransactionsTable({
  transactions,
  isLoading,
  onViewInvoice,
  onRefund,
  onRecordPayment,
  onApprove,
  onReject,
  onMarkFailed,
}: TransactionsTableProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [methodFilter, setMethodFilter] = React.useState<string>("all")

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((t) => {
      if (search.trim()) {
        const q = search.toLowerCase()
        const matches =
          (t.invoiceNumber && t.invoiceNumber.toLowerCase().includes(q)) ||
          (t.reference && t.reference.toLowerCase().includes(q)) ||
          (t.payerName && t.payerName.toLowerCase().includes(q)) ||
          (t.studentName && t.studentName.toLowerCase().includes(q)) ||
          (t.itemDescription && t.itemDescription.toLowerCase().includes(q))
        if (!matches) return false
      }

      if (statusFilter !== "all" && t.status !== statusFilter) {
        return false
      }

      if (methodFilter !== "all" && t.method !== methodFilter && t.paymentMethod !== methodFilter) {
        return false
      }

      return true
    })
  }, [transactions, search, statusFilter, methodFilter])

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Paid":
        return {
          pill: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
          icon: CheckCircle2,
        }
      case "Pending":
      case "In Review":
        return {
          pill: "text-amber-700 bg-amber-50 border-amber-200/60",
          icon: Clock,
        }
      case "Refunded":
        return {
          pill: "text-purple-700 bg-purple-50 border-purple-200/60",
          icon: RotateCcw,
        }
      case "Failed":
        return {
          pill: "text-rose-700 bg-rose-50 border-rose-200/60",
          icon: XCircle,
        }
      default:
        return {
          pill: "text-zinc-600 bg-zinc-50 border-zinc-200",
          icon: AlertTriangle,
        }
    }
  }

  const columns = React.useMemo<UniTableColumn<TransactionItem>[]>(
    () => [
      {
        id: "invoice",
        header: "INVOICE / ID",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, t) => (
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
              <Receipt className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-zinc-900 font-mono">
                {t.invoiceNumber || t.reference || t.id.slice(0, 8)}
              </span>
              <span className="text-[11px] text-zinc-400">
                {t.itemDescription || t.planName || "Subscription"}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "payer",
        header: "STUDENT / PAYER",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, t) => (
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-zinc-900">
              {t.studentName || t.payerName || "—"}
            </span>
            <span className="text-[11px] text-zinc-400">
              {t.studentGrade || (t.payerName ? `Payer: ${t.payerName}` : "Student")}
            </span>
          </div>
        ),
      },
      {
        id: "method",
        header: "METHOD",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, t) => (
          <span className="text-xs text-zinc-700 font-medium">
            {t.methodDisplay || t.method || t.paymentMethod || "Online"}
          </span>
        ),
      },
      {
        id: "amount",
        header: "AMOUNT",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, t) => (
          <span className="text-xs font-bold text-zinc-900">
            {t.amount} EGP
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, t) => {
          const badge = getStatusBadge(t.status)
          const Icon = badge.icon
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                badge.pill
              )}
            >
              <Icon className="size-3" />
              <span>{t.status || "Paid"}</span>
            </span>
          )
        },
      },
      {
        id: "date",
        header: "DATE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, t) => (
          <span className="text-xs text-zinc-500">
            {t.paidAt
              ? new Date(t.paidAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "ACTIONS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase text-right",
        cell: (_, t) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewInvoice(t)}
              className="h-8 px-2.5 rounded-lg text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 gap-1.5 cursor-pointer"
            >
              <FileText className="size-3.5 text-zinc-400" />
              <span>Invoice</span>
            </Button>

            {/* Pending actions */}
            {(t.status === "Pending" || t.status === "In Review") && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onApprove?.(t.id)}
                  className="h-8 px-2.5 rounded-lg text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1 cursor-pointer font-medium"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Approve</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReject?.(t.id)}
                  className="h-8 px-2.5 rounded-lg text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1 cursor-pointer font-medium"
                >
                  <XCircle className="size-3.5" />
                  <span>Reject</span>
                </Button>
              </>
            )}

            {/* Paid actions */}
            {t.status === "Paid" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRefund(t)}
                  className="h-8 px-2.5 rounded-lg text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Refund</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to mark this payment as Failed?")) {
                      onMarkFailed?.(t.id)
                    }
                  }}
                  className="h-8 px-2 rounded-lg text-xs text-zinc-400 hover:text-rose-600 hover:bg-rose-50 gap-1 cursor-pointer"
                  title="Mark as Failed"
                >
                  <Ban className="size-3.5" />
                  <span>Fail</span>
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [onViewInvoice, onRefund, onApprove, onReject, onMarkFailed]
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div className="relative w-64 md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice number, student, payer..."
            className="w-full h-9.5 pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9.5 px-3 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-700"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="h-9.5 px-3 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-700"
          >
            <option value="all">All Methods</option>
            <option value="Visa / Mastercard">Visa / Mastercard</option>
            <option value="Vodafone Cash">Vodafone Cash</option>
            <option value="InstaPay">InstaPay</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          {onRecordPayment && (
            <Button
              type="button"
              onClick={onRecordPayment}
              className="h-9.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-2xs flex items-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <CreditCard className="size-3.5" />
              <span>Record Payment</span>
            </Button>
          )}
        </div>
      </div>

      {/* UniTable or Loading */}
      {isLoading ? (
        <LoadingSpinner title="Loading transactions ledger..." />
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
          <UniTable<TransactionItem>
            data={filteredTransactions}
            columns={columns}
            emptyMessage={
              <EmptyState
                title="No transactions found"
                description="There are currently no recorded payments matching your search criteria."
              />
            }
          />
        </div>
      )}
    </div>
  )
}
