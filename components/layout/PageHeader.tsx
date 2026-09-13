"use client"

import * as React from "react"
import { Bell, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

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

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-zinc-200/80 bg-white hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer select-none">
          <div className="size-7 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center shrink-0">
            SA
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-xs font-semibold text-zinc-900">
              Sara Adel
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5">
              Admin
            </span>
          </div>
          <ChevronDown className="size-3.5 text-zinc-400 ml-0.5" />
        </div>
      </div>
    </header>
  )
}
