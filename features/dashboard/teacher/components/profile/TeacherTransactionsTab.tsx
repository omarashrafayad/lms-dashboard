"use client"

import * as React from "react"
import { Info, Search } from "lucide-react"
import { TeacherTransaction } from "../../types/teacherProfile.types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface TeacherTransactionsTabProps {
  transactions: TeacherTransaction[]
}

export function TeacherTransactionsTab({
  transactions,
}: TeacherTransactionsTabProps) {
  const [search, setSearch] = React.useState("")
  const [filterMethod, setFilterMethod] = React.useState("all")

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((txn) => {
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesCode = txn.code.toLowerCase().includes(q)
        const matchesMethod = txn.payoutMethod.toLowerCase().includes(q)
        if (!matchesCode && !matchesMethod) {
          return false
        }
      }
      if (filterMethod !== "all" && !txn.payoutMethod.toLowerCase().includes(filterMethod.toLowerCase())) {
        return false
      }
      return true
    })
  }, [transactions, search, filterMethod])

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Informational Alert Box */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs text-zinc-600">
        <Info className="size-4 text-zinc-400 shrink-0" />
        <span>
          A <strong className="font-semibold text-zinc-700">payout request</strong> is an approval workflow; a{" "}
          <strong className="font-semibold text-zinc-700">transaction</strong> is a completed disbursement transfer.
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
            placeholder="Search by transaction ID or method..."
            className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-white border border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all shadow-2xs font-mono"
          />
        </div>

        <div className="w-[180px]">
          <Select value={filterMethod} onValueChange={(val) => setFilterMethod(val ?? "all")}>
            <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-zinc-200/80 text-zinc-700 shadow-2xs">
              <SelectValue placeholder="All Payout Methods" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs">All Methods</SelectItem>
              <SelectItem value="Bank" className="text-xs">Bank Transfer</SelectItem>
              <SelectItem value="Vodafone" className="text-xs">Vodafone Cash</SelectItem>
              <SelectItem value="PayPal" className="text-xs">PayPal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/50">
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  TRANSACTION ID
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  TEACHER / RECIPIENT
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  PAYOUT METHOD
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  AMOUNT
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  DATE
                </th>
                <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-zinc-400">
                    No payout transactions found for this teacher.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const isPaid = txn.paymentStatus === "Paid"
                  return (
                    <tr key={txn.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-xs text-zinc-900">
                        {txn.code}
                      </td>
                      <td className="py-4 px-6 text-xs font-semibold text-zinc-800">
                        {txn.teacherName}
                      </td>
                      <td className="py-4 px-6 text-xs text-zinc-600">
                        {txn.payoutMethod}
                      </td>
                      <td className="py-4 px-6 font-bold text-sm text-zinc-900">
                        {txn.amount}
                      </td>
                      <td className="py-4 px-6 text-xs text-zinc-600">
                        {txn.date}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            isPaid
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                              : "text-amber-700 bg-amber-50 border-amber-200/60"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isPaid ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {txn.transactionStatus || txn.paymentStatus}
                        </span>
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

