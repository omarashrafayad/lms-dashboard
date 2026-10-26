"use client"

import * as React from "react"
import Link from "next/link"
import { Parent } from "../types/parent.types"
import { ParentRowActions } from "./ParentRowActions"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import EmptyState from "@/components/shared/EmptyState"
import { Users } from "lucide-react"

export interface ParentTableProps {
  data: Parent[]
  serverPagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    onPageChange: (page: number) => void
    pageSizeOptions?: number[]
    onPageSizeChange?: (pageSize: number) => void
  }
  pageSize?: number
}

export function ParentTable({ data, serverPagination, pageSize }: ParentTableProps) {
  const columns = React.useMemo<UniTableColumn<Parent>[]>(
    () => [
      {
        id: "parent",
        header: "PARENT",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, parent) => (
          <Link
            href={`/parent/${parent.id}`}
            className="flex items-center gap-3 cursor-pointer group/link"
          >
            <div className="relative size-9 rounded-full overflow-hidden shrink-0 border border-zinc-200/60 bg-zinc-100 flex items-center justify-center shadow-2xs">
              {parent.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={parent.avatarUrl}
                  alt={parent.name}
                  className="size-full object-cover"
                />
              ) : (
                <span className={`font-semibold text-xs ${parent.avatarColorClass}`}>
                  {parent.avatarInitials}
                </span>
              )}
            </div>
            <span className="font-semibold text-sm text-zinc-900 leading-tight group-hover/link:text-[#D97706] transition-colors">
              {parent.name}
            </span>
          </Link>
        ),
      },
      {
        id: "email_phone",
        header: "EMAIL / PHONE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, parent) => (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-700 leading-tight">
              {parent.email}
            </span>
            <span className="text-xs text-zinc-400 font-normal mt-0.5">
              {parent.phone}
            </span>
          </div>
        ),
      },
      {
        id: "children",
        header: "CHILDREN",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, parent) =>
          parent.childrenCount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="size-5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-[11px] font-semibold flex items-center justify-center shrink-0">
                {parent.childrenCount}
              </span>
              <span className="text-xs text-zinc-600 font-normal truncate max-w-[200px]">
                {parent.childrenNames.join(", ")}
              </span>
            </div>
          ) : (
            <span className="text-xs text-zinc-400 font-normal">No children</span>
          ),
      },
      {
        id: "active_subscriptions",
        header: "ACTIVE SUBSCRIPTIONS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase text-center",
        className: "text-center",
        cell: (_, parent) => (
          <span className="text-sm font-semibold text-zinc-900">
            {parent.activeSubscriptions}
          </span>
        ),
      },
      {
        id: "last_payment",
        header: "LAST PAYMENT",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, parent) =>
          parent.lastPaymentDate ? (
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-900 leading-tight">
                {parent.lastPaymentDate}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal mt-0.5">
                {parent.lastPaymentAmount}
              </span>
            </div>
          ) : (
            <span className="text-sm text-zinc-400 font-normal">—</span>
          ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, parent) => {
          const isActive = parent.status === "Active"
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                isActive
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                  : "text-zinc-500 bg-zinc-50 border-zinc-200/70"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-zinc-400"
                }`}
              />
              {parent.status}
            </span>
          )
        },
      },
      {
        id: "registered_date",
        header: "REGISTERED DATE",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, parent) => (
          <span className="text-xs text-zinc-600 font-normal">
            {parent.registeredDate}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        className: "w-10 text-right",
        cell: (_, parent) => <ParentRowActions parent={parent} />,
      },
    ],
    []
  )

  return (
    <div className="w-full">
      <UniTable
        data={data}
        columns={columns}
        enablePagination={false}
        serverPagination={serverPagination}
        pageSize={pageSize}
        itemLabel="parents"
        emptyMessage={
          <EmptyState
            icon={Users}
            title="No parents found"
            description="No parents found matching the filter criteria"
            actionLabel="Add Parent"
            actionHref="/parent/add"
          />
        }
        className="rounded-2xl border-zinc-200/80 shadow-2xs"
      />
    </div>
  )
}
