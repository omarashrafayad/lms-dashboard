"use client"

import * as React from "react"
import { Sparkles, Calendar, Award } from "lucide-react"
import { ParentPointsDetails } from "../../types/parentProfile.types"

export interface ParentPointsSessionsTabProps {
  pointsDetails: ParentPointsDetails
}

export function ParentPointsSessionsTab({
  pointsDetails,
}: ParentPointsSessionsTabProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-lime-50 text-lime-700 flex items-center justify-center mb-3">
            <Sparkles className="size-4" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 block">
            {pointsDetails.currentBalance.toLocaleString()} pts
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Current Available Balance</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <Award className="size-4" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 block">
            {pointsDetails.totalEarned.toLocaleString()} pts
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Lifetime Earned Points</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
            <Calendar className="size-4" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 block">
            {pointsDetails.privateSessionsRemaining} / {pointsDetails.privateSessionsUsed + pointsDetails.privateSessionsRemaining}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">Private Sessions Remaining</span>
        </div>
      </div>

      {/* Rewards and Redemptions history */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-zinc-900">
          Points & Sessions Policy
        </h3>
        <p className="text-xs text-zinc-600 leading-relaxed">
          Parents earn loyalty points when renewing subscriptions and participating in academic workshops. Points can be redeemed for 1-on-1 private tutoring sessions or exam preparation packages.
        </p>
      </div>
    </div>
  )
}
