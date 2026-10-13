"use client"

import * as React from "react"
import {
  Search,
  Filter,
  FileText,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Download,
  Smartphone,
  Building2,
  Receipt,
} from "lucide-react"
import {
  TransactionItem,
  TransactionStatus,
  PaymentMethod,
  TransactionsFilterState,
} from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TransactionsTableProps {
  transactions: TransactionItem[]
  isLoading?: boolean
  onViewInvoice: (transaction: TransactionItem) => void
  onRefund: (transaction: TransactionItem) => void
}

export function TransactionsTable({
  transactions,
  isLoading,
  onViewInvoice,
  onRefund,
}: TransactionsTableProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [methodFilter, setMethodFilter] = React.useState<string>("all")

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((t) => {
      if (search.trim()) {
        const q = search.toLowerCase()
        const matches =
          t.transactionId.toLowerCase().includes(q) ||
          t.invoiceNumber.toLowerCase().includes(q) ||
          t.payerName.toLowerCase().includes(q) ||
          t.studentName.toLowerCase().includes(q) ||
          t.gatewayReference.toLowerCase().includes(q)
        if (!matches) return false
      }

      if (statusFilter !== "all" && t.status !== statusFilter) {
        return false
      }

      if (methodFilter !== "all" && t.paymentMethod !== methodFilter) {
        return false
      }

      return true
    })
  }, [transactions, search, statusFilter, methodFilter])

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "Paid":
        return {
          pill: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
          dot: "bg-emerald-500",
        }
      case "Pending":
        return {
          pill: "text-amber-700 bg-amber-50 border-amber-200/60",
          dot: "bg-amber-500",
        }
      case "Refunded":
        return {
          pill: "text-purple-700 bg-purple-50 border-purple-200/60",
          dot: "bg-purple-500",
        }
      case "Failed":
        return {
          pill: "text-rose-700 bg-rose-50 border-rose-200/60",
          dot: "bg-rose-500",
        }
      default:
        return {
          pill: "text-zinc-600 bg-zinc-50 border-zinc-200",
          dot: "bg-zinc-400",
        }
    }
  }

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "Visa / Mastercard":
        return <CreditCard className="size-3.5 text-blue-600" />
      case "Vodafone Cash":
        return <Smartphone className="size-3.5 text-rose-600" />
      case "InstaPay":
        return <Receipt className="size-3.5 text-indigo-600" />
      case "Bank Transfer":
        return <Building2 className="size-3.5 text-emerald-600" />
      default:
        return <CreditCard className="size-3.5 text-zinc-500" />
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search invoice, payer, or gateway ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9.5 rounded-xl text-xs bg-zinc-50/50 border-zinc-200 focus-visible:bg-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9.5 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-700 font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="h-9.5 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-700 font-medium cursor-pointer"
          >
            <option value="all">All Gateways</option>
            <option value="Visa / Mastercard">Visa / Mastercard</option>
            <option value="Vodafone Cash">Vodafone Cash</option>
            <option value="InstaPay">InstaPay</option>
            <option value="Fawry">Fawry</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="text-xs text-zinc-500 font-medium">
          Showing <strong>{filteredTransactions.length}</strong> transactions
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/50 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                <th className="py-3.5 px-6">INVOICE & REF</th>
                <th className="py-3.5 px-6">PAYER / STUDENT</th>
                <th className="py-3.5 px-6">ITEM / SUBSCRIPTION</th>
                <th className="py-3.5 px-6">AMOUNT</th>
                <th className="py-3.5 px-6">METHOD</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6">DATE & TIME</th>
                <th className="py-3.5 px-6 text-right">INVOICE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-zinc-400">
                    No transactions found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const badge = getStatusBadge(t.status)
                  const methodIcon = getPaymentMethodIcon(t.paymentMethod)

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-zinc-50/60 transition-colors group"
                    >
                      {/* Invoice & Ref */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900">
                            {t.invoiceNumber}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {t.transactionId}
                          </span>
                        </div>
                      </td>

                      {/* Payer / Student */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-800">
                            {t.payerName}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            Student: {t.studentName} ({t.studentGrade})
                          </span>
                        </div>
                      </td>

                      {/* Item */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-800">
                            {t.planOrItem}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {t.type}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900">
                            {t.amount.toLocaleString()} {t.currency}
                          </span>
                          {t.discount > 0 && (
                            <span className="text-[10px] text-emerald-600 font-medium">
                              -{t.discount} {t.currency} coupon applied
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Method */}
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-50 border border-zinc-200/70 text-zinc-700">
                          {methodIcon}
                          <span className="font-medium text-[11px]">{t.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                            badge.pill
                          )}
                        >
                          <span className={cn("size-1.5 rounded-full", badge.dot)} />
                          {t.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-zinc-500 whitespace-nowrap">
                        {t.date}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="View / Print Official Invoice"
                            onClick={() => onViewInvoice(t)}
                            className="size-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                          >
                            <FileText className="size-4" />
                          </button>
                          {t.status === "Paid" && (
                            <button
                              type="button"
                              title="Process Refund"
                              onClick={() => onRefund(t)}
                              className="size-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
