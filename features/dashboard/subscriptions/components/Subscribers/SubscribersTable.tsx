"use client"

import * as React from "react"
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
  XCircle,
  MoreVertical,
  RotateCcw,
  Ban,
} from "lucide-react"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import EmptyState from "@/components/shared/EmptyState"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { SubscriberItem, SubscriptionStatus } from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SubscribersTableProps {
  subscribers: SubscriberItem[]
  isLoading?: boolean
  onStatusChange: (id: string, status: SubscriptionStatus) => void
  onAssignNew: () => void
}

function getAvatarInitials(name?: string): string {
  const parts = (name || "S").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "ST"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function SubscribersTable({
  subscribers,
  isLoading,
  onStatusChange,
  onAssignNew,
}: SubscribersTableProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null)

  const filteredSubscribers = React.useMemo(() => {
    return subscribers.filter((sub) => {
      if (search.trim()) {
        const q = search.toLowerCase()
        const matches =
          (sub.studentName && sub.studentName.toLowerCase().includes(q)) ||
          (sub.planName && sub.planName.toLowerCase().includes(q)) ||
          (sub.parentName && sub.parentName.toLowerCase().includes(q)) ||
          (sub.parentPhone && sub.parentPhone.includes(q))
        if (!matches) return false
      }

      if (statusFilter !== "all" && sub.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [subscribers, search, statusFilter])

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Active":
        return {
          pill: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
          icon: CheckCircle2,
        }
      case "Trial":
        return {
          pill: "text-sky-700 bg-sky-50 border-sky-200/60",
          icon: Clock,
        }
      case "Expiring Soon":
        return {
          pill: "text-amber-700 bg-amber-50 border-amber-200/60",
          icon: AlertCircle,
        }
      case "Paused":
        return {
          pill: "text-purple-700 bg-purple-50 border-purple-200/60",
          icon: PauseCircle,
        }
      case "Expired":
      case "Canceled":
        return {
          pill: "text-zinc-600 bg-zinc-100 border-zinc-200",
          icon: XCircle,
        }
      default:
        return {
          pill: "text-zinc-600 bg-zinc-50 border-zinc-200",
          icon: CheckCircle2,
        }
    }
  }

  const columns = React.useMemo<UniTableColumn<SubscriberItem>[]>(
    () => [
      {
        id: "student",
        header: "STUDENT",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, sub) => {
          const name = sub.studentName || "Unnamed Student"
          const initials = getAvatarInitials(name)
          return (
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-zinc-900 leading-tight">
                  {name}
                </span>
                <span className="text-[11px] text-zinc-400 font-normal mt-0.5">
                  {sub.studentGrade || "Secondary Student"}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        id: "plan",
        header: "PLAN",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, sub) => (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-900">
              {sub.planName || "Standard Plan"}
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">
              {sub.billingCycle || "Monthly"}
            </span>
          </div>
        ),
      },
      {
        id: "parent",
        header: "PARENT CONTACT",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, sub) => (
          <div className="flex flex-col">
            <span className="text-xs font-medium text-zinc-800">
              {sub.parentName || "—"}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              {sub.parentPhone || "—"}
            </span>
          </div>
        ),
      },
      {
        id: "amount",
        header: "AMOUNT",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, sub) => (
          <span className="text-xs font-bold text-zinc-900">
            {sub.amountCharged ?? sub.amount ?? 0} EGP
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, sub) => {
          const badge = getStatusBadge(sub.status)
          const Icon = badge.icon
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                badge.pill
              )}
            >
              <Icon className="size-3" />
              <span>{sub.status || "Active"}</span>
            </span>
          )
        },
      },
      {
        id: "dates",
        header: "VALIDITY",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, sub) => {
          const days = sub.daysRemaining ?? sub.remainingDays ?? 30
          return (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-800">
                {days > 0 ? `${days} days left` : "Expired"}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal">
                {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : "—"}
              </span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "ACTIONS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase text-right",
        cell: (_, sub) => (
          <div className="flex items-center justify-end gap-1.5 relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdownId(openDropdownId === sub.id ? null : sub.id)
              }
              className="size-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <MoreVertical className="size-4" />
            </button>

            {openDropdownId === sub.id && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-zinc-200 rounded-xl shadow-lg z-30 p-1 flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange(sub.id, "Active")
                    setOpenDropdownId(null)
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg text-left cursor-pointer"
                >
                  <RotateCcw className="size-3.5 text-emerald-600" />
                  <span>Renew Subscription</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange(sub.id, "Canceled")
                    setOpenDropdownId(null)
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg text-left cursor-pointer"
                >
                  <Ban className="size-3.5 text-rose-600" />
                  <span>Cancel Access</span>
                </button>
              </div>
            )}
          </div>
        ),
      },
    ],
    [openDropdownId, onStatusChange]
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
            placeholder="Search student, plan, or phone..."
            className="w-full h-9.5 pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9.5 px-3 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-700"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Trial">Trial</option>
            <option value="Paused">Paused</option>
            <option value="Expired">Expired</option>
            <option value="Canceled">Canceled</option>
          </select>

          <Button
            onClick={onAssignNew}
            className="h-9.5 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-white text-xs font-medium cursor-pointer shadow-2xs"
          >
            Assign New
          </Button>
        </div>
      </div>

      {/* UniTable or Loading */}
      {isLoading ? (
        <LoadingSpinner title="Loading active subscriptions..." />
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
          <UniTable<SubscriberItem>
            data={filteredSubscribers}
            columns={columns}
            emptyMessage={
              <EmptyState
                title="No subscribers found"
                description="There are currently no active student subscriptions matching your filters."
              />
            }
          />
        </div>
      )}
    </div>
  )
}
