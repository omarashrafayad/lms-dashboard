"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterDropdownProps {
  id: string
  label: string
  value: string
  options: FilterOption[]
  openDropdown: string | null
  setOpenDropdown: (id: string | null) => void
  onSelect: (value: string) => void
  minWidth?: string
  dropdownWidth?: string
  className?: string
}

export function FilterDropdown({
  id,
  label,
  value,
  options,
  openDropdown,
  setOpenDropdown,
  onSelect,
  minWidth = "min-w-[110px]",
  dropdownWidth = "min-w-[140px]",
  className,
}: FilterDropdownProps) {
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const isOpen = openDropdown === id
  const isActive = Boolean(value && value !== "all")

  // Deduplicate options by value to prevent duplicate UI items and key conflicts
  const uniqueOptions = React.useMemo(() => {
    const seen = new Set<string>()
    return options.filter((opt) => {
      if (!opt || seen.has(opt.value)) return false
      seen.add(opt.value)
      return true
    })
  }, [options])

  // Find active option label
  const selectedOption = uniqueOptions.find((o) => o.value === value)
  const displayLabel = isActive ? (selectedOption?.label || value) : label

  // Handle outside click
  React.useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [isOpen, setOpenDropdown])

  return (
    <div ref={dropdownRef} className="relative" data-filter-dropdown>
      <button
        type="button"
        onClick={() => setOpenDropdown(isOpen ? null : id)}
        className={cn(
          "h-10 px-3.5 bg-white border border-zinc-200/90 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center justify-between gap-2 shadow-2xs cursor-pointer transition-colors",
          minWidth,
          isActive && "border-amber-400 text-amber-900 bg-amber-50/40 font-semibold",
          className
        )}
      >
        <span className="truncate max-w-[160px]">{displayLabel}</span>
        <ChevronDown className="size-3.5 text-zinc-400 shrink-0" />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 mt-1 max-h-60 overflow-y-auto bg-white border border-zinc-200 rounded-xl shadow-lg z-30 p-1.5 flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95",
            dropdownWidth
          )}
        >
          {uniqueOptions.map((opt, idx) => {
            const isItemActive =
              value === opt.value || (!value && opt.value === "all") || (value === "all" && opt.value === "all")
            return (
              <button
                key={`${opt.value}-${idx}`}
                type="button"
                onClick={() => {
                  onSelect(opt.value)
                  setOpenDropdown(null)
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer",
                  isItemActive
                    ? "bg-amber-50 text-amber-900 font-semibold"
                    : "text-zinc-600 hover:bg-zinc-50"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isItemActive && (
                  <Check className="size-3.5 text-amber-600 shrink-0 ml-2" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
