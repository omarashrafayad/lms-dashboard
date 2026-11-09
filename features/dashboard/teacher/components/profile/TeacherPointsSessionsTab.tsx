"use client"

import * as React from "react"
import { Sparkles, Calendar, Award } from "lucide-react"
import { TeacherPointsDetails } from "../../types/teacherProfile.types"

export interface TeacherPointsSessionsTabProps {
  pointsDetails: TeacherPointsDetails
}

export function TeacherPointsSessionsTab({
  pointsDetails,
}: TeacherPointsSessionsTabProps) {
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
          <span className="text-xs text-zinc-500 mt-1 block">
            Teacher Reward Points
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <Award className="size-4" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 block">
            {pointsDetails.ratingBonusPoints.toLocaleString()} pts
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">
            High Rating Bonus Points
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <div className="size-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
            <Calendar className="size-4" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 block">
            {pointsDetails.privateSessionsConducted}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block">
            Private 1-on-1 Sessions Conducted
          </span>
        </div>
      </div>

      {/* Rewards and Redemptions Policy */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-zinc-900">
          Teacher Incentive & Private Tutoring Policy
        </h3>
        <p className="text-xs text-zinc-600 leading-relaxed">
          Educators earn incentive bonus points based on student review scores, on-time session attendance, and high completion rates of 1-on-1 private tutoring. Points accumulate toward annual bonuses and premier tutor ranking across the LMS directory.
        </p>
      </div>
    </div>
  )
}

