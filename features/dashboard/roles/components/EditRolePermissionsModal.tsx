"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  ShieldCheck,
  Search,
  Check,
  Key,
  Layers,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  ChevronsUpDown,
} from "lucide-react"
import { RoleItem, PermissionItem } from "../types/roles.types"
import { cn } from "@/lib/utils"

export interface EditRolePermissionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: RoleItem | null
  allPermissions: PermissionItem[]
  onSave: (roleId: string, permissions: string[]) => Promise<void>
  isSaving?: boolean
}

export function EditRolePermissionsModal({
  open,
  onOpenChange,
  role,
  allPermissions,
  onSave,
  isSaving = false,
}: EditRolePermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([])
  const [search, setSearch] = React.useState("")
  const [selectedModule, setSelectedModule] = React.useState<string>("all")
  const [wrapModules, setWrapModules] = React.useState<boolean>(false)
  const [collapsedModules, setCollapsedModules] = React.useState<Record<string, boolean>>({})
  const filterScrollRef = React.useRef<HTMLDivElement>(null)

  // Sync initial permissions from role
  React.useEffect(() => {
    if (role && open) {
      setSelectedPermissions(Array.isArray(role.permissions) ? [...role.permissions] : [])
      setSearch("")
      setSelectedModule("all")
      setCollapsedModules({})
    }
  }, [role, open])

  // Group all permissions by module
  const modulesList = React.useMemo(() => {
    const set = new Set<string>()
    allPermissions.forEach((p) => {
      if (p.module) set.add(p.module)
    })
    return Array.from(set).sort()
  }, [allPermissions])

  // Filter permissions
  const filteredPermissions = React.useMemo(() => {
    return allPermissions.filter((p) => {
      const matchModule = selectedModule === "all" || p.module === selectedModule
      if (!matchModule) return false

      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        (p.code && p.code.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.action && p.action.toLowerCase().includes(q)) ||
        (p.entity && p.entity.toLowerCase().includes(q)) ||
        (p.module && p.module.toLowerCase().includes(q))
      )
    })
  }, [allPermissions, selectedModule, search])

  // Group filtered permissions by module for display
  const groupedPermissions = React.useMemo(() => {
    const map: Record<string, PermissionItem[]> = {}
    filteredPermissions.forEach((p) => {
      const mod = p.module || "General"
      if (!map[mod]) map[mod] = []
      map[mod].push(p)
    })
    return map
  }, [filteredPermissions])

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  const handleSelectAllInModule = (modulePermissions: PermissionItem[], e?: React.MouseEvent) => {
    e?.stopPropagation()
    const codes = modulePermissions.map((p) => p.code).filter(Boolean)
    setSelectedPermissions((prev) => Array.from(new Set([...prev, ...codes])))
  }

  const handleDeselectAllInModule = (modulePermissions: PermissionItem[], e?: React.MouseEvent) => {
    e?.stopPropagation()
    const codes = new Set(modulePermissions.map((p) => p.code))
    setSelectedPermissions((prev) => prev.filter((c) => !codes.has(c)))
  }

  const handleSelectAllGlobal = () => {
    const allCodes = allPermissions.map((p) => p.code).filter(Boolean)
    setSelectedPermissions(allCodes)
  }

  const handleDeselectAllGlobal = () => {
    setSelectedPermissions([])
  }

  const toggleModuleCollapse = (modName: string) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [modName]: !prev[modName],
    }))
  }

  const toggleAllCollapse = () => {
    const areAnyOpen = Object.keys(groupedPermissions).some((m) => !collapsedModules[m])
    if (areAnyOpen) {
      // Collapse all
      const allCollapsed: Record<string, boolean> = {}
      Object.keys(groupedPermissions).forEach((m) => {
        allCollapsed[m] = true
      })
      setCollapsedModules(allCollapsed)
    } else {
      // Expand all
      setCollapsedModules({})
    }
  }

  const handleFilterScroll = (direction: "left" | "right") => {
    if (filterScrollRef.current) {
      const offset = direction === "left" ? -180 : 180
      filterScrollRef.current.scrollBy({ left: offset, behavior: "smooth" })
    }
  }

  const handleFilterWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!wrapModules && e.deltaY !== 0 && filterScrollRef.current) {
      filterScrollRef.current.scrollLeft += e.deltaY
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return
    await onSave(role.roleId, selectedPermissions)
  }

  if (!role) return null

  const selectedCount = selectedPermissions.length
  const totalCount = allPermissions.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-4xl w-full">
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="max-w-4xl w-full p-0 gap-0 h-[86vh] max-h-[86vh] flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 shadow-2xl bg-white"
      >
        {/* Top Pinned Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200/80 bg-white shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-amber-100 text-amber-800 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="size-5" />
              </div>
              <div className="flex flex-col">
                <DialogTitle className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <span>Manage Permissions:</span>
                  <span className="text-brand-orange">{role.name}</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Assign or revoke granular capabilities and security access rules for this role.
                </DialogDescription>
              </div>
            </div>

            {/* Selected Counter Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-bold text-amber-900 shrink-0 shadow-2xs">
              <Key className="size-3.5 text-amber-600" />
              <span>
                {selectedCount} / {totalCount} Granted
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search + Module Pills + Bulk Actions */}
        <div className="px-5 sm:px-6 py-3.5 bg-zinc-50/80 border-b border-zinc-200/80 shrink-0 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search permissions by code, action, entity or description..."
                className="w-full h-9 pl-9.5 pr-8 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Bulk Global Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleAllCollapse}
                className="h-8 px-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-600 transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                title="Toggle collapse all modules"
              >
                <ChevronsUpDown className="size-3.5 text-zinc-400" />
                <span>Toggle All</span>
              </button>
              <button
                type="button"
                onClick={handleSelectAllGlobal}
                className="h-8 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer shadow-2xs"
              >
                Select All ({totalCount})
              </button>
              <button
                type="button"
                onClick={handleDeselectAllGlobal}
                className="h-8 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-rose-50 text-xs font-semibold text-zinc-500 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer shadow-2xs"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Module Filter Pills with Horizontal Scroll + Wheel Support + View Toggle */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {/* Left Scroll Button */}
            {!wrapModules && (
              <button
                type="button"
                onClick={() => handleFilterScroll("left")}
                className="size-7 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                title="Scroll left"
              >
                <ChevronLeft className="size-4" />
              </button>
            )}

            {/* Pills Container */}
            <div
              ref={filterScrollRef}
              onWheel={handleFilterWheel}
              className={cn(
                "flex-1 gap-1.5 transition-all select-none",
                wrapModules
                  ? "flex flex-wrap max-h-24 overflow-y-auto pr-1"
                  : "flex items-center overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-300"
              )}
            >
              <button
                type="button"
                onClick={() => setSelectedModule("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shadow-2xs",
                  selectedModule === "all"
                    ? "bg-zinc-900 text-white"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                )}
              >
                All Modules ({allPermissions.length})
              </button>
              {modulesList.map((mod) => {
                const countInMod = allPermissions.filter((p) => p.module === mod).length
                const isSelected = selectedModule === mod
                return (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setSelectedModule(mod)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shadow-2xs",
                      isSelected
                        ? "bg-brand-orange text-white"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    )}
                  >
                    <span>{mod}</span>
                    <span className="ml-1 opacity-70 text-[10px]">({countInMod})</span>
                  </button>
                )
              })}
            </div>

            {/* Right Scroll Button */}
            {!wrapModules && (
              <button
                type="button"
                onClick={() => handleFilterScroll("right")}
                className="size-7 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                title="Scroll right"
              >
                <ChevronRight className="size-4" />
              </button>
            )}

            {/* Wrap / Expand Filter Toggle */}
            <button
              type="button"
              onClick={() => setWrapModules(!wrapModules)}
              className={cn(
                "size-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer shadow-2xs transition-colors",
                wrapModules
                  ? "bg-amber-100 border-amber-300 text-amber-800"
                  : "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-500"
              )}
              title={wrapModules ? "Single row scroll" : "Wrap all modules in view"}
            >
              <LayoutGrid className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Permissions Matrix Body (Always Visible Vertical Scrollbar) */}
        <div
          style={{ overflowY: "scroll" }}
          className="flex-1 min-h-0 overflow-y-scroll p-4 sm:p-6 flex flex-col gap-4 bg-zinc-50/50"
        >
          {Object.keys(groupedPermissions).length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-2">
              <Key className="size-8 text-zinc-300" />
              <p className="text-xs font-semibold text-zinc-500">
                No permissions found matching "{search}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setSelectedModule("all")
                }}
                className="text-xs text-brand-orange font-semibold hover:underline cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            Object.entries(groupedPermissions).map(([modName, modPerms]) => {
              const allInModSelected = modPerms.every((p) =>
                selectedPermissions.includes(p.code)
              )
              const selectedInModCount = modPerms.filter((p) =>
                selectedPermissions.includes(p.code)
              ).length
              const isCollapsed = Boolean(collapsedModules[modName])

              return (
                <div
                  key={modName}
                  className="shrink-0 w-full rounded-2xl border border-zinc-200/90 bg-white overflow-hidden shadow-2xs"
                >
                  {/* Module Group Header */}
                  <div
                    onClick={() => toggleModuleCollapse(modName)}
                    className="flex items-center justify-between px-4 py-3 bg-zinc-50/90 border-b border-zinc-100 cursor-pointer select-none hover:bg-zinc-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-0.5 rounded text-zinc-400">
                        {isCollapsed ? (
                          <ChevronRight className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </div>
                      <Layers className="size-4 text-zinc-500" />
                      <span className="text-xs font-bold text-zinc-900 capitalize">
                        {modName}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-500 bg-white px-2 py-0.5 rounded-full border border-zinc-200/70">
                        {selectedInModCount} / {modPerms.length} Active
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {allInModSelected ? (
                        <button
                          type="button"
                          onClick={(e) => handleDeselectAllInModule(modPerms, e)}
                          className="text-[11px] font-semibold text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-white"
                        >
                          Deselect Module
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleSelectAllInModule(modPerms, e)}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-amber-50"
                        >
                          Select All in {modName}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Permission Checkbox Cards Grid */}
                  {!isCollapsed && (
                    <div className="p-3.5 grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-white">
                      {modPerms.map((perm) => {
                        const isChecked = selectedPermissions.includes(perm.code)
                        return (
                          <div
                            key={perm.code}
                            onClick={() => togglePermission(perm.code)}
                            className={cn(
                              "flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none min-h-[72px]",
                              isChecked
                                ? "bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/40 shadow-2xs"
                                : "bg-white border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/70"
                            )}
                          >
                            <div className="pt-0.5 shrink-0">
                              <div
                                className={cn(
                                  "size-4.5 rounded-md border flex items-center justify-center transition-colors",
                                  isChecked
                                    ? "bg-brand-orange border-brand-orange text-white"
                                    : "border-zinc-300 bg-white"
                                )}
                              >
                                {isChecked && <Check className="size-3 stroke-[3]" />}
                              </div>
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-zinc-900">
                                  {perm.action || "Execute"}
                                </span>
                                {perm.entity && (
                                  <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded-md border border-zinc-200/60">
                                    {perm.entity}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] font-mono text-zinc-400 mt-0.5 truncate">
                                {perm.code}
                              </span>
                              {perm.description && (
                                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                                  {perm.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Pinned Bottom Footer */}
        <div className="p-4 sm:px-6 border-t border-zinc-200/80 bg-white shrink-0 flex items-center justify-between gap-4">
          <div className="text-xs text-zinc-500">
            <strong>{selectedCount}</strong> permissions configured for <strong>{role.name}</strong>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
              className="h-9 sm:h-10 px-4 rounded-xl text-xs font-medium text-zinc-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="h-9 sm:h-10 px-5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer flex items-center gap-2 active:scale-[0.98]"
            >
              {isSaving && <Loader2 className="size-3.5 animate-spin" />}
              <span>{isSaving ? "Saving Permissions..." : "Save Role Permissions"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
