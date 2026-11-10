"use client"

import * as React from "react"
import { ShieldCheck, Key, Users, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export interface RolesStatsProps {
  totalRoles: number
  totalPermissions: number
  totalAssignedUsers: number
  myPermissionsCount: number
}

export function RolesStats({
  totalRoles,
  totalPermissions,
  totalAssignedUsers,
  myPermissionsCount,
}: RolesStatsProps) {
  const statsData = [
    {
      title: "System Roles",
      value: totalRoles.toLocaleString(),
      change: "Active",
      period: "Security role groups",
      dotColor: "bg-cyan-400",
      icon: ShieldCheck,
    },
    {
      title: "System Permissions",
      value: totalPermissions.toLocaleString(),
      change: "Catalog",
      period: "Granular capability rules",
      dotColor: "bg-lime-400",
      icon: Key,
    },
    {
      title: "Users Assigned Roles",
      value: totalAssignedUsers.toLocaleString(),
      change: "Assigned",
      period: "Across institutional users",
      dotColor: "bg-purple-400",
      icon: Users,
    },
    {
      title: "My Permissions",
      value: myPermissionsCount.toLocaleString(),
      change: "Granted",
      period: "Active on your session",
      dotColor: "bg-amber-400",
      icon: UserCheck,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between"
          >
            {/* Top row: Title and colored dot */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">
                {stat.title}
              </span>
              <span className={cn("size-2 rounded-full", stat.dotColor)} />
            </div>

            {/* Middle row: Number and Badge */}
            <div className="flex items-center justify-between mt-3 mb-1">
              <span className="text-3xl font-bold text-zinc-900 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-full px-2.5 py-0.5">
                {stat.change}
              </span>
            </div>

            {/* Bottom: Period text */}
            <span className="text-[11px] text-zinc-400 font-normal">
              {stat.period}
            </span>
          </div>
        )
      })}
    </div>
  )
}

