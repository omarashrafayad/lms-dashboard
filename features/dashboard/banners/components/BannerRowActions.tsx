"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import {
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
  ExternalLink,
  Power,
  PowerOff,
} from "lucide-react"
import { Banner } from "../types/banner.types"
import { useDeleteBanner, useToggleBannerActive } from "../hooks/useBanners"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export interface BannerRowActionsProps {
  banner: Banner
  onEdit: (banner: Banner) => void
}

export function BannerRowActions({ banner, onEdit }: BannerRowActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [coords, setCoords] = React.useState({ top: 0, left: 0 })
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const deleteMutation = useDeleteBanner()
  const toggleMutation = useToggleBannerActive()

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: Math.max(10, rect.right + window.scrollX - 170),
      })
    }
    setIsOpen((prev) => !prev)
  }

  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleScroll = () => {
      setIsOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("scroll", handleScroll, true)
    window.addEventListener("resize", handleScroll)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", handleScroll, true)
      window.removeEventListener("resize", handleScroll)
    }
  }, [isOpen])

  const handleDelete = async () => {
    setIsOpen(false)
    const displayName = banner.title || "Banner"
    if (!confirm(`Are you sure you want to delete banner "${displayName}"?`)) {
      return
    }

    try {
      await deleteMutation.mutateAsync(banner.id)
      toast.success(`Banner "${displayName}" deleted successfully`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleToggleActive = async () => {
    setIsOpen(false)
    try {
      await toggleMutation.mutateAsync({ banner })
      toast.success(
        banner.isActive
          ? `Banner "${banner.title || "Banner"}" deactivated`
          : `Banner "${banner.title || "Banner"}" activated`
      )
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const isPending = deleteMutation.isPending || toggleMutation.isPending

  return (
    <div className="relative inline-block text-right">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        disabled={isPending}
        title="More Options"
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin text-zinc-400" />
        ) : (
          <MoreVertical className="size-4" />
        )}
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="fixed z-50 w-44 rounded-xl bg-white border border-zinc-200/80 shadow-lg py-1 text-xs animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Edit */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                onEdit(banner)
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer text-left"
            >
              <Pencil className="size-3.5 text-zinc-400" />
              <span>Edit Details</span>
            </button>

            {/* Toggle Active */}
            <button
              type="button"
              onClick={handleToggleActive}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer text-left"
            >
              {banner.isActive ? (
                <>
                  <PowerOff className="size-3.5 text-amber-500" />
                  <span>Deactivate</span>
                </>
              ) : (
                <>
                  <Power className="size-3.5 text-emerald-500" />
                  <span>Activate</span>
                </>
              )}
            </button>

            {/* Open Link if any */}
            {banner.linkUrl && (
              <a
                href={banner.linkUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer text-left"
              >
                <ExternalLink className="size-3.5 text-zinc-400" />
                <span>Visit Link</span>
              </a>
            )}

            <div className="my-1 border-t border-zinc-100" />

            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
            >
              <Trash2 className="size-3.5 text-rose-500" />
              <span>Delete Banner</span>
            </button>
          </div>,
          document.body
        )}
    </div>
  )
}

