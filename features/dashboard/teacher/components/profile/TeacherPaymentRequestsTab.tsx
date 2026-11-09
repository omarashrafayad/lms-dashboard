"use client"

import * as React from "react"
import { TeacherPaymentRequest } from "../../types/teacherProfile.types"

export interface TeacherPaymentRequestsTabProps {
  paymentRequests: TeacherPaymentRequest[]
}

export function TeacherPaymentRequestsTab({
  paymentRequests,
}: TeacherPaymentRequestsTabProps) {
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
                DESCRIPTION / PERIOD
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
                <td colSpan={6} className="py-8 text-center text-xs text-zinc-400">
                  No payout requests found for this teacher.
                </td>
              </tr>
            ) : (
              paymentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-sm text-zinc-900 font-mono">
                    {req.code}
                  </td>
                  <td className="py-4 px-6 text-xs text-zinc-700 font-medium">
                    {req.description}
                  </td>
                  <td className="py-4 px-6 font-bold text-sm text-zinc-900">
                    {req.amount}
                  </td>
                  <td className="py-4 px-6 text-xs text-zinc-600">
                    {req.requestedDate}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        req.status === "Approved"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                          : req.status === "Pending"
                          ? "text-amber-700 bg-amber-50 border-amber-200/60"
                          : "text-rose-700 bg-rose-50 border-rose-200/60"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          req.status === "Approved"
                            ? "bg-emerald-500"
                            : req.status === "Pending"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
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

