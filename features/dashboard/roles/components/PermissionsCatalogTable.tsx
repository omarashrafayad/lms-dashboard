"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { PermissionItem } from "../types/roles.types"
import { Key, Shield, Layers, Search, FilterX } from "lucide-react"

export interface PermissionsCatalogTableProps {
  permissions: PermissionItem[]
}

export function PermissionsCatalogTable({ permissions }: PermissionsCatalogTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedModule, setSelectedModule] = React.useState<string>("ALL")

  // Extract unique modules
  const modules = React.useMemo(() => {
    const set = new Set<string>()
    permissions.forEach((p) => {
      if (p.module) set.add(p.module)
    })
    return Array.from(set).sort()
  }, [permissions])

  // Filter permissions
  const filteredPermissions = React.useMemo(() => {
    return permissions.filter((p) => {
      const matchModule = selectedModule === "ALL" || p.module === selectedModule
      const q = searchTerm.trim().toLowerCase()
      const matchSearch =
        !q ||
        p.code?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.entity?.toLowerCase().includes(q) ||
        p.module?.toLowerCase().includes(q)

      return matchModule && matchSearch
    })
  }, [permissions, selectedModule, searchTerm])

  const getActionBadgeClass = (action: string) => {
    const act = (action || "").toLowerCase()
    if (act.includes("delete") || act.includes("remove")) {
      return "bg-rose-50 text-rose-700 border-rose-200"
    }
    if (act.includes("create") || act.includes("write") || act.includes("add") || act.includes("post")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    }
    if (act.includes("edit") || act.includes("update") || act.includes("put")) {
      return "bg-amber-50 text-amber-700 border-amber-200"
    }
    return "bg-sky-50 text-sky-700 border-sky-200"
  }

  const columns: UniTableColumn<PermissionItem>[] = [
    {
      id: "code",
      header: "Permission Code",
      cell: (_, row) => (
        <div className="flex items-center gap-2.5 py-1">
          <div className="size-8 rounded-lg bg-zinc-100 border border-zinc-200/80 flex items-center justify-center shrink-0 text-zinc-600">
            <Key className="size-3.5" />
          </div>
          <div className="flex flex-col">
            <code className="text-xs font-semibold font-mono text-zinc-900 bg-zinc-50 border border-zinc-200/70 px-2 py-0.5 rounded-md">
              {row.code}
            </code>
          </div>
        </div>
      ),
    },
    {
      id: "module",
      header: "Module",
      cell: (_, row) => (
        <div className="py-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/70">
            <Layers className="size-3 text-purple-500" />
            <span>{row.module || "General"}</span>
          </span>
        </div>
      ),
    },
    {
      id: "entity",
      header: "Entity Scope",
      cell: (_, row) => (
        <div className="py-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-zinc-700 bg-zinc-100 border border-zinc-200">
            <Shield className="size-3 text-zinc-400" />
            <span>{row.entity || "-"}</span>
          </span>
        </div>
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: (_, row) => (
        <div className="py-1">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getActionBadgeClass(
              row.action
            )}`}
          >
            {row.action || "Execute"}
          </span>
        </div>
      ),
    },
    {
      id: "description",
      header: "Description",
      cell: (_, row) => (
        <p className="text-xs text-zinc-600 max-w-sm leading-relaxed py-1">
          {row.description || "Grants permission to perform the designated operation on this resource."}
        </p>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search permissions by code, name, action..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setSelectedModule("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedModule === "ALL"
                ? "bg-brand-orange text-white shadow-2xs"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
            }`}
          >
            All Modules ({permissions.length})
          </button>
          {modules.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedModule(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedModule === m
                  ? "bg-brand-orange text-white shadow-2xs"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
              }`}
            >
              {m}
            </button>
          ))}
          {(searchTerm || selectedModule !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("")
                setSelectedModule("ALL")
              }}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              title="Reset filters"
            >
              <FilterX className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Permissions Table */}
      <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <UniTable
          data={filteredPermissions}
          columns={columns}
          enablePagination={true}
          pageSize={10}
          getRowId={(row) => row.code}
          itemLabel="Permissions"
          emptyMessage="No permissions match your filter criteria."
        />
      </div>
    </div>
  )
}
