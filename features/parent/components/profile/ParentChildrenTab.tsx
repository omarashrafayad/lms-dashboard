"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ParentLinkedChild } from "../../types/parentProfile.types"

export interface ParentChildrenTabProps {
  childrenList: ParentLinkedChild[]
}

export function ParentChildrenTab({ childrenList }: ParentChildrenTabProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/50">
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                STUDENT
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                GRADE
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                EDUCATION STAGE
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                EDUCATION SYSTEM
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                RELATIONSHIP STATUS
              </th>
              <th className="py-3.5 px-6 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                ACTIVE SUBSCRIPTION
              </th>
              <th className="py-3.5 px-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {childrenList.map((child) => {
              const isSubActive = child.hasSubscription || child.activeSubscriptionStatus === "Active" || child.activeSubscriptionStatus === "Subscribed"

              return (
                <tr
                  key={child.id}
                  className="hover:bg-zinc-50/60 transition-colors group"
                >
                  {/* Student */}
                  <td className="py-4 px-6">
                    <Link
                      href={`/student/${child.studentId}`}
                      className="flex items-center gap-3 cursor-pointer group/link"
                    >
                      <div className="relative size-9 rounded-full overflow-hidden shrink-0 border border-zinc-200/60 bg-zinc-100 flex items-center justify-center">
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
                        <span className="font-bold text-sm text-zinc-900 group-hover/link:text-[#D97706] transition-colors leading-tight">
                          {child.name}
                        </span>
                        <span className="text-xs text-zinc-400 font-normal mt-0.5">
                          {child.studentId}
                        </span>
                      </div>
                    </Link>
                  </td>

                  {/* Grade */}
                  <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                    {child.grade}
                  </td>

                  {/* Stage */}
                  <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                    {child.stage}
                  </td>

                  {/* Education System */}
                  <td className="py-4 px-6 text-xs text-zinc-600 font-normal">
                    {child.educationSystem}
                  </td>

                  {/* Relationship Status */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      {child.relationshipStatus}
                    </span>
                  </td>

                  {/* Active Subscription */}
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
                      {isSubActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* View Profile Action */}
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/student/${child.studentId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#D97706] hover:text-amber-600 transition-colors"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="size-3.5" />
                    </Link>
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
