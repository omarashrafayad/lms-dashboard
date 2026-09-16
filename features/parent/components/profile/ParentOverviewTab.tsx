"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Check, Clock, Mail, Phone, Calendar } from "lucide-react"
import { ParentProfile } from "../../types/parentProfile.types"

export interface ParentOverviewTabProps {
  profile: ParentProfile
  onNavigateToChildrenTab?: () => void
}

export function ParentOverviewTab({
  profile,
  onNavigateToChildrenTab,
}: ParentOverviewTabProps) {
  const isActive = profile.status === "Active"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* Left Column (Span 2) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Linked Children Card */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900">
              Linked Children
            </h3>
            <button
              type="button"
              onClick={onNavigateToChildrenTab}
              className="text-xs font-semibold text-[#D97706] hover:text-amber-600 transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-zinc-100">
            {profile.linkedChildren.map((child) => {
              const isSubscribed = child.hasSubscription || child.activeSubscriptionStatus === "Subscribed" || child.activeSubscriptionStatus === "Active"

              return (
                <Link
                  key={child.id}
                  href={`/student/${child.studentId}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/70 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-full overflow-hidden shrink-0 border border-zinc-200/60 bg-zinc-100 flex items-center justify-center">
                      {child.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={child.avatarUrl}
                          alt={child.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className={`font-semibold text-xs ${child.avatarColorClass || "bg-sky-100 text-sky-700"}`}>
                          {child.avatarInitials}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-zinc-900 group-hover:text-[#D97706] transition-colors leading-tight">
                        {child.name}
                      </span>
                      <span className="text-xs text-zinc-400 font-normal mt-0.5">
                        {child.grade} · {child.stage}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        isSubscribed
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                          : "text-zinc-500 bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isSubscribed ? "bg-emerald-500" : "bg-zinc-400"
                        }`}
                      />
                      {isSubscribed ? "Subscribed" : "No subscription"}
                    </span>
                    <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900">
              Recent Activity
            </h3>
          </div>

          <div className="divide-y divide-zinc-100 px-6">
            {profile.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                    {activity.iconType === "clock" ? (
                      <Clock className="size-3.5 text-zinc-500" />
                    ) : (
                      <Check className="size-3.5 text-zinc-600 stroke-[2.5]" />
                    )}
                  </div>
                  <span className="text-xs text-zinc-700 font-medium leading-relaxed">
                    {activity.title}
                  </span>
                </div>

                <span className="text-xs text-zinc-400 font-normal shrink-0 ml-4">
                  {activity.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Span 1) */}
      <div className="flex flex-col gap-6">
        {/* Account Summary Card */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-zinc-900">
            Account Summary
          </h3>

          <div className="flex flex-col divide-y divide-zinc-100 text-xs">
            <div className="flex items-center justify-between py-3">
              <span className="text-zinc-500">Account Status</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  isActive
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                    : "text-zinc-500 bg-zinc-50 border-zinc-200"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isActive ? "bg-emerald-500" : "bg-zinc-400"
                  }`}
                />
                {profile.status}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-zinc-500">Points Balance</span>
              <span className="font-bold text-zinc-900">
                {profile.kpis.pointsBalance.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-zinc-500">Active Subscriptions</span>
              <span className="font-bold text-zinc-900">
                {profile.kpis.activeSubscriptions}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-zinc-500">Pending Requests</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/60">
                <span className="size-1.5 rounded-full bg-amber-500" />
                {profile.kpis.pendingRequests} pending
              </span>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-zinc-900">
            Contact
          </h3>

          <div className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                <Mail className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-zinc-400 font-normal">Email</span>
                <span className="text-xs font-semibold text-zinc-900 break-all">
                  {profile.email}
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                <Phone className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-zinc-400 font-normal">Phone</span>
                <span className="text-xs font-semibold text-zinc-900">
                  {profile.phone}
                </span>
              </div>
            </div>

            {/* Registered */}
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                <Calendar className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-zinc-400 font-normal">Registered</span>
                <span className="text-xs font-semibold text-zinc-900">
                  {profile.registeredDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
