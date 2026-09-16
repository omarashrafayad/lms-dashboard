"use client"

import * as React from "react"
import { ParentSubscription } from "../../types/parentProfile.types"

export interface ParentSubscriptionsTabProps {
  subscriptions: ParentSubscription[]
}

export function ParentSubscriptionsTab({
  subscriptions,
}: ParentSubscriptionsTabProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/50">
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                CHILD
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                PLAN
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                START DATE
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                EXPIRY DATE
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                PAYMENT STATUS
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                SUBSCRIPTION STATUS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {subscriptions.map((sub) => {
              const isPaid = sub.paymentStatus === "Paid"
              const isPending = sub.paymentStatus === "Pending"
              const isSubActive = sub.subscriptionStatus === "Active"

              return (
                <tr
                  key={sub.id}
                  className="hover:bg-zinc-50/60 transition-colors"
                >
                  {/* Child */}
                  <td className="py-4 px-6 font-bold text-sm text-zinc-900">
                    {sub.childName}
                  </td>

                  {/* Plan */}
                  <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                    {sub.plan}
                  </td>

                  {/* Start Date */}
                  <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                    {sub.startDate}
                  </td>

                  {/* Expiry Date */}
                  <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                    {sub.expiryDate}
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
                      {sub.paymentStatus}
                    </span>
                  </td>

                  {/* Subscription Status */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        isSubActive
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                          : "text-zinc-500 bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isSubActive ? "bg-emerald-500" : "bg-zinc-400"
                        }`}
                      />
                      {sub.subscriptionStatus}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
