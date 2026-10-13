"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, LogOut, Loader2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/useAuthStore"
import { logoutAction } from "@/features/auth/api/auth"

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  const user = useAuthStore().user
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown on click outside or Escape key
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isDropdownOpen])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logoutAction()
      useAuthStore.getState().logout()
      setIsDropdownOpen(false)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header
      className={cn(
        "w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 px-8 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xs sticky top-0 z-20",
        className
      )}
    >
      {/* Left side: Page Title and Description */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-zinc-500 font-normal leading-normal">
            {description}
          </p>
        )}
      </div>

      {/* Right side: Actions / Notifications & User Profile */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {actions}

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative size-10 rounded-xl border border-zinc-200/80 bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-2xs cursor-pointer"
        >
          <Bell className="size-4" />
          {/* Subtle notification dot indicator */}
          <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-brand-orange ring-2 ring-white" />
        </button>

        {/* User Profile Pill with Interactive Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            className={cn(
              "flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border bg-white hover:bg-zinc-50 transition-all shadow-2xs cursor-pointer select-none",
              isDropdownOpen
                ? "border-brand-orange/60 ring-2 ring-brand-orange/10 bg-zinc-50"
                : "border-zinc-200/80"
            )}
          >
            <div className="relative size-7 rounded-full overflow-hidden shrink-0 border border-zinc-200">
              <img
                src="/dina-farouk.jpg"
                alt={user?.fullName || "User avatar"}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-zinc-900">
              {user?.fullName || "Dina Farouk"}
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 text-zinc-400 ml-0.5 transition-transform duration-200",
                isDropdownOpen && "rotate-180 text-zinc-700"
              )}
            />
          </button>

          {/* User Menu Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-zinc-200/90 bg-white p-1.5 shadow-xl shadow-zinc-950/8 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              {/* User Info Header */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50/80 border border-zinc-100 mb-1">
                <div className="relative size-8 rounded-full overflow-hidden shrink-0 border border-zinc-200">
                  <img
                    src="/dina-farouk.jpg"
                    alt={user?.fullName || "User avatar"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-zinc-900 truncate">
                    {user?.fullName || "Dina Farouk"}
                  </span>
                  <span className="text-[11px] text-zinc-400 truncate">
                    {(user?.roles && user.roles[0]) || "Administrator"}
                  </span>
                </div>
              </div>

              {/* Settings Link */}
              <Link
                href="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70 transition-colors"
              >
                <Settings className="size-4 text-zinc-400" />
                <span>Settings</span>
              </Link>

              <div className="h-px bg-zinc-100 my-1" />

              {/* Logout Option with Icon and Label */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-colors cursor-pointer text-left disabled:opacity-60"
              >
                {isLoggingOut ? (
                  <Loader2 className="size-4 animate-spin text-red-500" />
                ) : (
                  <LogOut className="size-4 text-red-500" />
                )}
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
