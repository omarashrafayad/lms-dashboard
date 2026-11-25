"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Settings,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Sparkles,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/lib/rbac/usePermissions"
import { useAuthStore } from "@/stores/useAuthStore"
import { isInstructorRole, isStudentRole } from "@/features/auth/types/auth.types"
import {
  SIDEBAR_ITEMS,
  STUDENT_SIDEBAR_ITEMS,
  TEACHER_SIDEBAR_ITEMS,
  filterSidebarItems,
} from "./sidebarConfig"

export function Sidebar() {
  const pathname = usePathname()
  const { can } = usePermissions()
  const [mounted, setMounted] = React.useState(false)

  const user = useAuthStore((s) => s.user)
  const storeRole = useAuthStore((s) => s.role)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Resolve current effective role (support Instructor, Teacher, Student, Admin)
  const effectiveRole = React.useMemo(() => {
    if (isInstructorRole(storeRole) || isInstructorRole(user?.role)) return "instructor"
    if (isStudentRole(storeRole) || isStudentRole(user?.role)) return "student"
    const allRoles = user?.roles || []
    if (allRoles.some(isInstructorRole)) return "instructor"
    if (allRoles.some(isStudentRole)) return "student"
    return "admin"
  }, [storeRole, user?.role, user?.roles])

  // Filter items dynamically based on the current user's permissions for Admin
  const filteredItems = React.useMemo(() => {
    return filterSidebarItems(SIDEBAR_ITEMS, can)
  }, [can])

  // Track expanded parent groups and sub-groups for Admin
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
      {/* Top: Brand Logo & Role Pill */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="size-10 flex items-center bg-transparent justify-center shrink-0">
              <img src="/INNOVATION LOGO.png" alt="logo" className="h-9 w-auto object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-zinc-900 tracking-tight leading-tight">
                LMS
              </span>
              <span className="text-[11px] font-medium text-zinc-400 capitalize">
                {effectiveRole === "student"
                  ? "Student Portal"
                  : effectiveRole === "instructor"
                  ? "Instructor Portal"
                  : "Admin Workspace"}
              </span>
            </div>
          </div>

          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
              effectiveRole === "student"
                ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                : effectiveRole === "instructor"
                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                : "bg-amber-50 text-amber-700 border border-amber-200/60"
            )}
          >
            {effectiveRole === "instructor" ? "Instructor" : effectiveRole}
          </span>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
            <span>
              {effectiveRole === "student"
                ? "LEARNING MENU"
                : effectiveRole === "instructor"
                ? "TEACHING MENU"
                : "MAIN"}
            </span>
          </div>

          <nav className="flex flex-col gap-1">
            {!mounted ? (
              <div className="flex flex-col gap-1.5 py-1 px-1">
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
                <div className="h-9 w-full rounded-xl bg-zinc-100/70 animate-pulse" />
              </div>
            ) : effectiveRole === "student" ? (
              /* STUDENT NAVIGATION ONLY */
              STUDENT_SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon
                const active = item.isActive ? item.isActive(pathname) : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      active
                        ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "size-[18px] transition-colors",
                          active
                            ? "text-brand-orange"
                            : "text-zinc-400 group-hover:text-zinc-600"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )
              })
            ) : effectiveRole === "instructor" ? (
              /* INSTRUCTOR / TEACHER NAVIGATION ONLY */
              TEACHER_SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon
                const active = item.isActive ? item.isActive(pathname) : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      active
                        ? "bg-blue-50/80 text-blue-900 font-semibold border-l-2 border-blue-600 pl-2.5 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "size-[18px] transition-colors",
                          active
                            ? "text-blue-600"
                            : "text-zinc-400 group-hover:text-zinc-600"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )
              })
            ) : (
              /* ADMIN NAVIGATION (ORIGINAL SIDEBAR) */
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

      {/* Bottom Profile / Quick Info Card */}
      <div className="flex flex-col gap-2 pt-4 border-t border-zinc-100">
        <Link
          href={
            effectiveRole === "student"
              ? "/student/profile"
              : effectiveRole === "instructor"
              ? "/teacher/profile"
              : "/settings"
          }
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group bg-zinc-50/70 border border-zinc-100 hover:bg-zinc-100",
            (isSettingsActive || pathname.includes("/profile")) && "bg-zinc-100 text-zinc-900 font-semibold"
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="size-6 rounded-full overflow-hidden bg-zinc-200 shrink-0">
              <img
                src={user?.profileImg || "/dina-farouk.jpg"}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate font-semibold text-zinc-800">
                {user?.fullName || "Active User"}
              </span>
              <span className="text-[10px] text-zinc-400 capitalize">
                {effectiveRole} Settings
              </span>
            </div>
          </div>
          <ChevronRight className="size-3.5 text-zinc-400 group-hover:text-zinc-600" />
        </Link>
      </div>
    </aside>
  )
}
