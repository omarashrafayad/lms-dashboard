"use client"

import * as React from "react"
import { Check, Clock, User, CreditCard } from "lucide-react"
import { ParentActivity } from "../../types/parentProfile.types"

export interface ParentActivityHistoryTabProps {
  activityHistory: ParentActivity[]
}

export function ParentActivityHistoryTab({
  activityHistory,
}: ParentActivityHistoryTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden w-full">
      <div className="px-6 py-4 border-b border-zinc-100">
        <h3 className="text-sm font-bold text-zinc-900">
          Account Activity Log
        </h3>
      </div>

      <div className="divide-y divide-zinc-100 px-6 py-2">
        {activityHistory.map((act) => (
          <div
            key={act.id}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                {act.iconType === "clock" ? (
                  <Clock className="size-4 text-zinc-500" />
                ) : act.iconType === "user" ? (
                  <User className="size-4 text-zinc-500" />
                ) : act.iconType === "card" ? (
                  <CreditCard className="size-4 text-zinc-500" />
                ) : (
                  <Check className="size-4 text-zinc-600 stroke-[2.5]" />
                )}
              </div>
              <span className="text-xs text-zinc-800 font-medium">
                {act.title}
              </span>
            </div>

            <span className="text-xs text-zinc-400 font-normal">
              {act.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
