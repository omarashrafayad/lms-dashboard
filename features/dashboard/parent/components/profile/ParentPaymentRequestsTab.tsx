"use client"

import * as React from "react"
import { ParentPaymentRequest } from "../../types/parentProfile.types"

export interface ParentPaymentRequestsTabProps {
  paymentRequests: ParentPaymentRequest[]
}

export function ParentPaymentRequestsTab({
  paymentRequests,
}: ParentPaymentRequestsTabProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/50">
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                REQUEST ID
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                STUDENT
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                REQUESTED PLAN
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
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                NOTES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paymentRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-zinc-400">
                  No payment requests found.
                </td>
              </tr>
            ) : (
              paymentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-sm text-zinc-900">
                    {req.code}
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold text-zinc-800">
                    {req.studentName}
                  </td>
                  <td className="py-4 px-6 text-xs text-zinc-600">
                    {req.plan}
                  </td>
                  <td className="py-4 px-6 font-bold text-sm text-zinc-900">
                    {req.amount}
                  </td>
                  <td className="py-4 px-6 text-xs text-zinc-600">
                    {req.requestedDate}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/60">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-zinc-400">
                    {req.notes || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
