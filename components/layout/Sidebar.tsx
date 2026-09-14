"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GraduationCap,
  LayoutGrid,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  TrendingUp,
  HelpCircle,
  Settings,
  ChevronRight,
  ChevronDown,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SubItem {
  label: string
  href: string
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  hasChevron?: boolean
  subItems?: SubItem[]
}

const mainNavItems: NavItem[] = [
  { label: "Overview", href: "/overview", icon: LayoutGrid },
  {
    label: "Students",
    href: "/student/student_list",
    icon: GraduationCap,
    hasChevron: true,
    subItems: [
      { label: "All Students", href: "/student/student_list" },
      { label: "Add Student", href: "/student/add" },
      { label: "Student Requests", href: "/student/requests" },
    ],
  },
  { label: "Academic Management", href: "/academic", icon: BookOpen },
  { label: "Sessions & Bookings", href: "/sessions", icon: Calendar },
  { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { label: "Content", href: "/content", icon: FileText },
  { label: "Analytics", href: "/analytics", icon: TrendingUp },
  { label: "Support", href: "/support", icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-w-[16rem] h-screen sticky top-0 flex flex-col justify-between bg-white border-r border-zinc-200/80 px-4 py-6 select-none z-30">
      {/* Top: Brand Logo */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 rounded-xl bg-brand-orange flex items-center justify-center shadow-sm text-white shrink-0">
            <GraduationCap className="size-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-zinc-900 tracking-tight leading-tight">
              Lumina
            </span>
            <span className="text-xs text-zinc-400 font-normal">
              Learning Admin
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
            MAIN
          </div>
          <nav className="flex flex-col gap-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href === "/student/student_list" && pathname.startsWith("/student"))
              const hasSub = !!item.subItems
              const isExpanded = isActive && hasSub

              return (
                <div key={item.label} className="flex flex-col gap-1">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      isActive && !hasSub
                        ? "bg-zinc-100/80 text-zinc-900 font-semibold"
                        : isActive && hasSub
                        ? "text-zinc-900 font-semibold"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "size-[18px] transition-colors",
                          isActive
                            ? "text-zinc-900"
                            : "text-zinc-400 group-hover:text-zinc-600"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.hasChevron && (
                      isExpanded ? (
                        <ChevronDown className="size-4 text-zinc-600" />
                      ) : (
                        <ChevronRight
                          className={cn(
                            "size-4 transition-transform",
                            isActive ? "text-zinc-600" : "text-zinc-400 group-hover:text-zinc-500"
                          )}
                        />
                      )
                    )}
                  </Link>

                  {isExpanded && item.subItems && (
                    <div className="flex flex-col gap-1 pl-7 pr-1 mt-0.5">
                      {item.subItems.map((sub) => {
                        const isSubActive =
                          sub.label === "All Students" &&
                          (pathname === "/student/student_list" || pathname.startsWith("/student/"))

                        return (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className={cn(
                              "flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all",
                              isSubActive
                                ? "bg-[#FFF9F2] text-[#D97706] font-semibold border-l-2 border-[#FFB543] pl-2.5 shadow-2xs"
                                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                            )}
                          >
                            {sub.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bottom: Settings & User Profile Card */}
      <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
        >
          <Settings className="size-[18px] text-zinc-400" />
          <span>Settings</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs flex items-center justify-center shrink-0">
              SA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-900 truncate">
                Sara Adel
              </span>
              <span className="text-[11px] text-zinc-400 truncate">
                Administrator
              </span>
            </div>
          </div>
          <button
            type="button"
            title="Log Out"
            className="text-zinc-400 hover:text-zinc-700 transition-colors p-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
