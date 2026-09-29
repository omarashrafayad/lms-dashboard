"use client"

import * as React from "react"
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReferenceDataRowActionsProps {
  onEdit: () => void
  onDelete: () => Promise<void> | void
  isDeleting?: boolean
}

export function ReferenceDataRowActions({
  onEdit,
  onDelete,
  isDeleting = false,
}: ReferenceDataRowActionsProps) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(false)
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return
    }
    await onDelete()
  }

  return (
    <div className="relative inline-block text-right" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
        disabled={isDeleting}
        className="size-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer disabled:opacity-50"
        aria-label="Actions"
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin text-zinc-500" />
        ) : (
          <MoreHorizontal className="size-4" />
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-white border border-zinc-200/80 shadow-lg py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
              onEdit()
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left cursor-pointer"
          >
            <Pencil className="size-3.5 text-zinc-400" />
            <span>Edit</span>
          </button>

          <div className="h-px bg-zinc-100 my-1" />

          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
          >
            <Trash2 className="size-3.5 text-red-500" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}
