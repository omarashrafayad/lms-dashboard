"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/lib/rbac/usePermissions"
import {
  SIDEBAR_ITEMS,
  filterSidebarItems,
} from "./sidebarConfig"

export function Sidebar() {
  const pathname = usePathname()
  const { can } = usePermissions()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Filter items dynamically based on the current user's permissions
  const filteredItems = React.useMemo(() => {
    return filterSidebarItems(SIDEBAR_ITEMS, can)
  }, [can])

  // Track expanded parent groups and sub-groups
  const [expandedParents, setExpandedParents] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    SIDEBAR_ITEMS.forEach((item) => {
      if (item.type === "parent") {
        initial[item.group.id] = item.group.isActive ? item.group.isActive(pathname) : false
      }
    })
    return initial
  })

  const [expandedSubGroups, setExpandedSubGroups] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    SIDEBAR_ITEMS.forEach((item) => {
      if (item.type === "parent" && item.group.subGroups) {
        item.group.subGroups.forEach((sub) => {
          initial[sub.id] = sub.isActive ? sub.isActive(pathname) : false
        })
      }
    })
    return initial
  })

  // Auto-expand parent and subgroup when navigating to a matching route
  React.useEffect(() => {
    SIDEBAR_ITEMS.forEach((item) => {
      if (item.type === "parent") {
        if (item.group.isActive && item.group.isActive(pathname)) {
          setExpandedParents((prev) => ({ ...prev, [item.group.id]: true }))
        }
        if (item.group.subGroups) {
          item.group.subGroups.forEach((sub) => {
            if (sub.isActive && sub.isActive(pathname)) {
              setExpandedParents((prev) => ({ ...prev, [item.group.id]: true }))
              setExpandedSubGroups((prev) => ({ ...prev, [sub.id]: true }))
            }
          })
        }
      }
    })
  }, [pathname])

  const toggleParent = (groupId: string) => {
    setExpandedParents((prev) => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  const toggleSubGroup = (subId: string) => {
    setExpandedSubGroups((prev) => ({ ...prev, [subId]: !prev[subId] }))
  }

  const isSettingsActive = pathname.startsWith("/settings")

  return (
    <aside className="w-64 min-w-[16rem] h-screen sticky top-0 flex flex-col justify-between bg-white border-r border-zinc-200/80 px-4 py-6 select-none z-30 overflow-y-auto">
      {/* Top: Brand Logo */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 flex items-center bg-transparent justify-center shrink-0">
            <img src="/INNOVATION LOGO.png" alt="logo" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-zinc-900 tracking-tight leading-tight">
              LMS
            </span>
            <span className="text-xs text-zinc-400 font-normal">
              Dashboard
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
            MAIN
          </div>

          <nav className="flex flex-col gap-1">
            {/* Dynamically Filtered RBAC Items */}
            {!mounted ? (
              <div className="flex flex-col gap-1.5 py-1 px-1">
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
              </div>
            ) : (
              filteredItems.map((sidebarItem) => {
                if (sidebarItem.type === "single") {
                const item = sidebarItem.item
                const Icon = item.icon
                const active = item.isActive ? item.isActive(pathname) : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      active
                        ? "bg-zinc-100/80 text-zinc-900 font-semibold"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "size-[18px] transition-colors",
                          active
                            ? item.id === "overview"
                              ? "text-zinc-900"
                              : "text-brand-orange"
                            : "text-zinc-400 group-hover:text-zinc-600"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )
              }

              // Parent group
              const group = sidebarItem.group
              const Icon = group.icon
              const isGroupActive = group.isActive ? group.isActive(pathname) : false
              const isExpanded = !!expandedParents[group.id]

              return (
                <div key={group.id} className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => toggleParent(group.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group text-left cursor-pointer",
                      isGroupActive
                        ? "text-zinc-900 font-semibold"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "size-[18px] transition-colors",
                          group.iconClassName,
                          isGroupActive
                            ? "text-zinc-900"
                            : "text-zinc-400 group-hover:text-zinc-600"
                        )}
                      />
                      <span>{group.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="size-4 text-zinc-600" />
                    ) : (
                      <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-500" />
                    )}
                  </button>

                  {/* Render Nested Content when Expanded */}
                  {isExpanded && (
                    <div className="flex flex-col gap-1 pl-4 pr-1 mt-0.5">
                      {/* Sub-groups (e.g. Users -> Students / Teachers / Parents) */}
                      {group.subGroups &&
                        group.subGroups.map((sub) => {
                          const isSubActive = sub.isActive ? sub.isActive(pathname) : false
                          const isSubExpanded = !!expandedSubGroups[sub.id]

                          return (
                            <div key={sub.id} className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() => toggleSubGroup(sub.id)}
                                className={cn(
                                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer text-left",
                                  isSubActive
                                    ? "text-zinc-900 font-semibold"
                                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                                )}
                              >
                                <span>{sub.label}</span>
                                {isSubExpanded ? (
                                  <ChevronDown className="size-3.5 text-zinc-500" />
                                ) : (
                                  <ChevronRight className="size-3.5 text-zinc-400" />
                                )}
                              </button>

                              {isSubExpanded && (
                                <div className="flex flex-col gap-1 pl-4 mt-0.5">
                                  {sub.children.map((child) => {
                                    const isChildActive = child.isActive
                                      ? child.isActive(pathname)
                                      : pathname === child.href

                                    return (
                                      <Link
                                        key={child.id}
                                        href={child.href}
                                        className={cn(
                                          "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                                          isChildActive
                                            ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                                        )}
                                      >
                                        {child.label}
                                      </Link>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}

                      {/* Direct Child Links (e.g. Academic -> Subjects, Courses, Exams) */}
                      {group.directLinks &&
                        group.directLinks.map((link) => {
                          const isLinkActive = link.isActive
                            ? link.isActive(pathname)
                            : pathname === link.href

                          return (
                            <Link
                              key={link.id}
                              href={link.href}
                              className={cn(
                                "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                                isLinkActive
                                  ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                              )}
                            >
                              {link.label}
                            </Link>
                          )
                        })}
                    </div>
                  )}
                </div>
              )
            })
          )}
          </nav>
        </div>
      </div>

      {/* Bottom: Settings */}
      <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
            isSettingsActive
              ? "bg-zinc-100/80 text-zinc-900 font-semibold"
              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          )}
        >
          <Settings
            className={cn(
              "size-[18px] transition-colors",
              isSettingsActive
                ? "text-brand-orange"
                : "text-zinc-400 group-hover:text-zinc-600"
            )}
          />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  )
}
