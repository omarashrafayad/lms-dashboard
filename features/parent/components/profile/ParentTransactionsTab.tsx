"use client"

import * as React from "react"
import { Info, Search } from "lucide-react"
import { ParentTransaction } from "../../types/parentProfile.types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface ParentTransactionsTabProps {
  transactions: ParentTransaction[]
}

export function ParentTransactionsTab({
  transactions,
}: ParentTransactionsTabProps) {
  const [search, setSearch] = React.useState("")
  const [paymentType, setPaymentType] = React.useState("all")

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((txn) => {
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesCode = txn.code.toLowerCase().includes(q)
        const matchesChild = txn.childName?.toLowerCase().includes(q)
        const matchesPlan = txn.plan.toLowerCase().includes(q)
        if (!matchesCode && !matchesChild && !matchesPlan) {
          return false
        }
      }
      if (paymentType !== "all" && txn.plan !== paymentType) {
        return false
      }
      return true
    })
  }, [transactions, search, paymentType])

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Informational Alert Box */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs text-zinc-600">
        <Info className="size-4 text-zinc-400 shrink-0" />
        <span>
          A <strong className="font-semibold text-zinc-700">payment request</strong> is an approval workflow; a{" "}
          <strong className="font-semibold text-zinc-700">transaction</strong> is a completed financial record.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px] max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, student, or type..."
            className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-white border border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
          />
        </div>

        <div className="w-[160px]">
          <Select value={paymentType} onValueChange={(val) => setPaymentType(val ?? "all")}>
            <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-zinc-200/80 text-zinc-700 shadow-2xs font-normal">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs">Payment Type</SelectItem>
              <SelectItem value="Free" className="text-xs">Free</SelectItem>
              <SelectItem value="Basic" className="text-xs">Basic</SelectItem>
              <SelectItem value="Elite" className="text-xs">Elite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/50">
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  TRANSACTION ID
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  PARENT
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  CHILD / STUDENT
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  PAYMENT PLAN
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  AMOUNT
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  POINTS
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  DATE
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  PAYMENT STATUS
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  TRANSACTION STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredTransactions.map((txn) => {
                const isPaid = txn.paymentStatus === "Paid"
                const isPending = txn.paymentStatus === "Pending"
                const isFailed = txn.paymentStatus === "Failed"

                const isCompleted = txn.transactionStatus === "Completed"
                const isProcessing = txn.transactionStatus === "Processing"

                return (
                  <tr
                    key={txn.id}
                    className="hover:bg-zinc-50/60 transition-colors"
                  >
                    {/* Transaction ID */}
                    <td className="py-4 px-6 font-bold text-sm text-zinc-900">
                      {txn.code}
                    </td>

                    {/* Parent */}
                    <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                      {txn.parentName}
                    </td>

                    {/* Child / Student */}
                    <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                      {txn.childName || "—"}
                    </td>

                    {/* Payment Plan */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60">
                        {txn.plan}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 font-bold text-sm text-zinc-900">
                      {txn.amount}
                    </td>

                    {/* Points */}
                    <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                      {txn.points}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                      {txn.date}
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          isPaid
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                            : isPending
                            ? "text-amber-700 bg-amber-50 border-amber-200/60"
                            : "text-rose-700 bg-rose-50 border-rose-200/60"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            isPaid
                              ? "bg-emerald-500"
                              : isPending
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {txn.paymentStatus}
                      </span>
                    </td>

                    {/* Transaction Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          isCompleted
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                            : isProcessing
                            ? "text-amber-700 bg-amber-50 border-amber-200/60"
                            : "text-rose-700 bg-rose-50 border-rose-200/60"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            isCompleted
                              ? "bg-emerald-500"
                              : isProcessing
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {txn.transactionStatus}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
