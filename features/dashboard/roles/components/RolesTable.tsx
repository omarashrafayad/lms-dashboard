"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { RoleItem } from "../types/roles.types"
import {
  ShieldCheck,
  Users,
  Key,
  Shield,
  GraduationCap,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react"

export interface RolesTableProps {
  roles: RoleItem[]
  totalAvailablePermissions?: number
  onManagePermissions: (role: RoleItem) => void
}

export function RolesTable({
  roles,
  totalAvailablePermissions = 0,
  onManagePermissions,
}: RolesTableProps) {
  const getRoleIconAndColor = (roleName: string) => {
    const lower = roleName.toLowerCase()
    if (lower.includes("admin")) {
      return {
        icon: ShieldCheck,
        bg: "bg-amber-100 text-amber-800 border-amber-200/70",
      }
    }
    if (lower.includes("teacher") || lower.includes("instructor")) {
      return {
        icon: Sparkles,
        bg: "bg-purple-100 text-purple-800 border-purple-200/70",
      }
    }
    if (lower.includes("student")) {
      return {
        icon: GraduationCap,
        bg: "bg-sky-100 text-sky-800 border-sky-200/70",
      }
    }
    return {
      icon: Shield,
      bg: "bg-emerald-100 text-emerald-800 border-emerald-200/70",
    }
  }

  const columns: UniTableColumn<RoleItem>[] = [
    {
      id: "roleName",
      header: "Role Title",
      cell: (_, row) => {
        const { icon: Icon, bg } = getRoleIconAndColor(row.name)
        return (
          <div className="flex items-center gap-3 py-1">
            <div
              className={`size-9 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}
            >
              <Icon className="size-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-900">{row.name}</span>
              <span className="text-[11px] text-zinc-400">
                Institutional Security Role
              </span>
            </div>
          </div>
        )
      },
    },
    {
      id: "userCount",
      header: "Assigned Users",
      cell: (_, row) => (
        <div className="flex items-center gap-1.5 py-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
            <Users className="size-3 text-zinc-500" />
            <span>{row.userCount.toLocaleString()} Users</span>
          </span>
        </div>
      ),
    },
    {
      id: "permissions",
      header: "Permissions Coverage",
      cell: (_, row) => {
        const count = Array.isArray(row.permissions) ? row.permissions.length : 0
        const percentage =
          totalAvailablePermissions > 0
            ? Math.round((count / totalAvailablePermissions) * 100)
            : 0

        return (
          <div className="flex flex-col gap-1.5 py-1 min-w-[160px] max-w-[220px]">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
              <span className="flex items-center gap-1">
                <Key className="size-3 text-amber-500" />
                <span>{count} permissions</span>
              </span>
              {totalAvailablePermissions > 0 && (
                <span className="text-[11px] text-zinc-400">
                  {percentage}% coverage
                </span>
              )}
            </div>

            {totalAvailablePermissions > 0 && (
              <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full bg-brand-orange rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
                />
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "status",
      header: "Role Classification",
      cell: (_, row) => {
        const isFullAccess =
          row.name.toLowerCase().includes("admin") ||
          (Array.isArray(row.permissions) && row.permissions.length > 30)

        return (
          <div className="py-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                isFullAccess
                  ? "bg-amber-50 text-amber-900 border-amber-200/80"
                  : "bg-zinc-50 text-zinc-700 border-zinc-200"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isFullAccess ? "bg-amber-500" : "bg-zinc-400"
                }`}
              />
              <span>{isFullAccess ? "Full Administrative" : "Custom Scoped"}</span>
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onManagePermissions(row)}
            className="h-8 px-3 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Manage Permissions</span>
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
      <UniTable
        data={roles}
        columns={columns}
        enablePagination={false}
        getRowId={(row) => row.roleId}
        itemLabel="Roles"
        emptyMessage="No system roles found."
      />
    </div>
  )
}

