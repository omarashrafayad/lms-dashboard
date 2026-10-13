"use client"

import * as React from "react"
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
  XCircle,
  RefreshCw,
  UserPlus,
  ShieldAlert,
} from "lucide-react"
import { SubscriberItem, SubscriptionStatus, SubscribersFilterState } from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SubscribersTableProps {
  subscribers: SubscriberItem[]
  isLoading?: boolean
  onStatusChange: (id: string, status: SubscriptionStatus) => void
  onAssignNew: () => void
}

export function SubscribersTable({
  subscribers,
  isLoading,
  onStatusChange,
  onAssignNew,
}: SubscribersTableProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [onlyExpiring, setOnlyExpiring] = React.useState(false)
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null)

  const filteredSubscribers = React.useMemo(() => {
    return subscribers.filter((sub) => {
      if (search.trim()) {
        const q = search.toLowerCase()
        const matches =
          sub.studentName.toLowerCase().includes(q) ||
          sub.studentCode.toLowerCase().includes(q) ||
          sub.parentName.toLowerCase().includes(q) ||
          sub.parentPhone.includes(q) ||
          sub.subscriptionCode.toLowerCase().includes(q)
        if (!matches) return false
      }

      if (statusFilter !== "all" && sub.status !== statusFilter) {
        return false
      }

      if (onlyExpiring && (sub.remainingDays > 7 || sub.status === "Expired")) {
        return false
      }

      return true
    })
  }, [subscribers, search, statusFilter, onlyExpiring])

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case "Active":
        return {
          pill: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
        }
      case "Trial":
        return {
          pill: "text-sky-700 bg-sky-50 border-sky-200/60",
          dot: "bg-sky-500",
          icon: Clock,
        }
      case "Expiring Soon":
        return {
          pill: "text-amber-700 bg-amber-50 border-amber-200/60",
          dot: "bg-amber-500",
          icon: AlertCircle,
        }
      case "Paused":
        return {
          pill: "text-purple-700 bg-purple-50 border-purple-200/60",
          dot: "bg-purple-500",
          icon: PauseCircle,
        }
      case "Expired":
      case "Canceled":
        return {
          pill: "text-zinc-600 bg-zinc-100 border-zinc-200",
          dot: "bg-zinc-400",
          icon: XCircle,
        }
      default:
        return {
          pill: "text-zinc-600 bg-zinc-50 border-zinc-200",
          dot: "bg-zinc-400",
          icon: Clock,
        }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top Filter and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search student, code, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9.5 rounded-xl text-xs bg-zinc-50/50 border-zinc-200 focus-visible:bg-white"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9.5 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-700 font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Paused">Paused</option>
            <option value="Expired">Expired</option>
          </select>

          {/* Expiring Soon Filter Pill */}
          <button
            type="button"
            onClick={() => setOnlyExpiring(!onlyExpiring)}
            className={cn(
              "flex items-center gap-1.5 h-9.5 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer",
              onlyExpiring
                ? "bg-amber-50 border-amber-300 text-amber-900 font-semibold"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            )}
          >
            <ShieldAlert className="size-3.5 text-amber-600" />
            <span>Expiring in 7 Days</span>
          </button>
        </div>

        {/* Right side: Assign Action */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onAssignNew}
            className="bg-[#F59E0B] hover:bg-amber-500 text-white font-medium rounded-xl h-9.5 px-4 gap-2 text-xs shadow-2xs cursor-pointer transition-all active:scale-[0.98]"
          >
            <UserPlus className="size-4 stroke-[2.2]" />
            <span>Assign Subscription</span>
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/50 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                <th className="py-3.5 px-6">STUDENT & CODE</th>
                <th className="py-3.5 px-6">PLAN & TIER</th>
                <th className="py-3.5 px-6">BILLING & AMOUNT</th>
                <th className="py-3.5 px-6">EXPIRY / RENEWAL</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6">PAYMENT METHOD</th>
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-zinc-400">
                    No matching subscribers found.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => {
                  const badge = getStatusBadge(sub.status)
                  const isExpiring = sub.remainingDays <= 5 && sub.status !== "Expired"

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-zinc-50/60 transition-colors group"
                    >
                      {/* Student & Code */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "size-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs",
                              sub.studentAvatarColor
                            )}
                          >
                            {sub.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900">
                              {sub.studentName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                              <span>{sub.studentCode}</span>
                              <span>•</span>
                              <span>{sub.studentGrade}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Plan & Tier */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-800">
                            {sub.planName}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            Code: {sub.subscriptionCode}
                          </span>
                        </div>
                      </td>

                      {/* Billing & Amount */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900">
                            {sub.amount.toLocaleString()} {sub.currency}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {sub.billingCycle} Cycle
                          </span>
                        </div>
                      </td>

                      {/* Expiry / Renewal */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-zinc-700">
                              {sub.renewalDate}
                            </span>
                            {isExpiring && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                {sub.remainingDays}d left
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400">
                            Started: {sub.startDate}
                          </span>
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
                          {sub.status}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-800">
                            {sub.paymentMethod}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {sub.autoRenew ? "Auto-renews" : "Manual renewal"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === sub.id ? null : sub.id
                              )
                            }
                            className="size-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-500 transition-colors ml-auto cursor-pointer"
                          >
                            <MoreVertical className="size-4" />
                          </button>

                          {openDropdownId === sub.id && (
                            <div className="absolute right-6 top-12 z-20 w-44 bg-white rounded-xl shadow-lg border border-zinc-200 py-1 text-xs">
                              {sub.status !== "Active" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onStatusChange(sub.id, "Active")
                                    setOpenDropdownId(null)
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                                  <span>Activate Plan</span>
                                </button>
                              )}
                              {sub.status !== "Paused" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onStatusChange(sub.id, "Paused")
                                    setOpenDropdownId(null)
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <PauseCircle className="size-3.5 text-amber-600" />
                                  <span>Pause Subscription</span>
                                </button>
                              )}
                              {sub.status !== "Expired" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onStatusChange(sub.id, "Expired")
                                    setOpenDropdownId(null)
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <XCircle className="size-3.5 text-rose-600" />
                                  <span>Cancel / Expire</span>
                                </button>
                              )}
                            </div>
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

        {/* Footer info */}
        <div className="py-3 px-6 border-t border-zinc-100 bg-zinc-50/40 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing <strong>{filteredSubscribers.length}</strong> of{" "}
            <strong>{subscribers.length}</strong> registered subscribers
          </span>
          <span className="text-[11px] text-zinc-400">
            Lumina LMS Subscription Engine
          </span>
        </div>
      </div>
    </div>
  )
}
