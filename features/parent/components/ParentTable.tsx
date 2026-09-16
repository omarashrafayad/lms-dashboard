"use client"

import * as React from "react"
import Link from "next/link"
import { Parent } from "../types/parent.types"
import { ParentRowActions } from "./ParentRowActions"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface ParentTableProps {
  data: Parent[]
}

export function ParentTable({ data }: ParentTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/50">
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                PARENT
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                EMAIL / PHONE
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                CHILDREN
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase text-center">
                ACTIVE SUBSCRIPTIONS
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                LAST PAYMENT
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                STATUS
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                REGISTERED DATE
              </th>
              <th className="py-3.5 px-6 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs text-zinc-400">
                  No parents found matching the filter criteria.
                </td>
              </tr>
            ) : (
              data.map((parent) => {
                const isActive = parent.status === "Active"

                return (
                  <tr
                    key={parent.id}
                    className="hover:bg-zinc-50/70 transition-colors group"
                  >
                    {/* Parent Name & Avatar */}
                    <td className="py-4 px-6">
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
                    </td>

                    {/* Email / Phone */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-zinc-700 leading-tight">
                          {parent.email}
                        </span>
                        <span className="text-xs text-zinc-400 font-normal mt-0.5">
                          {parent.phone}
                        </span>
                      </div>
                    </td>

                    {/* Children */}
                    <td className="py-4 px-6">
                      {parent.childrenCount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="size-5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-[11px] font-semibold flex items-center justify-center shrink-0">
                            {parent.childrenCount}
                          </span>
                          <span className="text-xs text-zinc-600 font-normal truncate max-w-[200px]">
                            {parent.childrenNames.join(", ")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 font-normal">
                          No children
                        </span>
                      )}
                    </td>

                    {/* Active Subscriptions */}
                    <td className="py-4 px-6 text-center">
                      <span className="text-sm font-semibold text-zinc-900">
                        {parent.activeSubscriptions}
                      </span>
                    </td>

                    {/* Last Payment */}
                    <td className="py-4 px-6">
                      {parent.lastPaymentDate ? (
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
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
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
                    </td>

                    {/* Registered Date */}
                    <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                      {parent.registeredDate}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 px-6 text-right">
                      <ParentRowActions parent={parent} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer matching Image 1 */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-zinc-200/70 bg-white">
        {/* Left: Items per page */}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Items per page</span>
          <div className="w-18">
            <Select
              value={String(pageSize)}
              onValueChange={(val) => setPageSize(Number(val ?? 10))}
            >
              <SelectTrigger className="h-8 text-xs rounded-lg border-zinc-200 text-zinc-700 shadow-none px-2.5">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="10" className="text-xs">10</SelectItem>
                <SelectItem value="25" className="text-xs">25</SelectItem>
                <SelectItem value="50" className="text-xs">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: Previous 1 2 3 Next buttons */}
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronLeft className="size-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`size-7 rounded-lg flex items-center justify-center font-semibold text-xs cursor-pointer transition-colors ${
              currentPage === 1
                ? "bg-[#F59E0B] text-white shadow-2xs"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            1
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className={`size-7 rounded-lg flex items-center justify-center font-semibold text-xs cursor-pointer transition-colors ${
              currentPage === 2
                ? "bg-[#F59E0B] text-white shadow-2xs"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            2
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(3)}
            className={`size-7 rounded-lg flex items-center justify-center font-semibold text-xs cursor-pointer transition-colors ${
              currentPage === 3
                ? "bg-[#F59E0B] text-white shadow-2xs"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            3
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            disabled={currentPage === 3}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
