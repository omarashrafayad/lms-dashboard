"use client"

import * as React from "react"
import { StudentProfile } from "../../types/studentProfile.types"

interface StudentSubscriptionAndParentProps {
  subscription: StudentProfile["subscription"]
  parent: StudentProfile["parent"]
}

export function StudentSubscriptionAndParent({
  subscription,
  parent,
}: StudentSubscriptionAndParentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Subscription Card */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs">
        <h2 className="text-sm font-bold text-zinc-900 mb-5">
          Subscription
        </h2>

        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              PLAN
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {subscription.plan}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              STATUS
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {subscription.status}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              START DATE
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {subscription.startDate}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              EXPIRY DATE
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {subscription.expiryDate}
            </div>
          </div>
        </div>
      </div>

      {/* Parent / Guardian Card */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs">
        <h2 className="text-sm font-bold text-zinc-900 mb-5">
          Parent / Guardian
        </h2>

        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              PARENT NAME
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {parent.name}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              RELATIONSHIP
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {parent.relationship}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              EMAIL
            </div>
            <div className="text-sm font-medium text-zinc-800 break-all">
              {parent.email}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              PHONE
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {parent.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
