"use client"

import * as React from "react"
import { MoreHorizontal, Eye, Pencil, UserX, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { Parent } from "../types/parent.types"
import { useDeleteParent } from "../hooks/useParents"
import { toast } from "sonner"

export interface ParentRowActionsProps {
  parent: Parent
}

export function ParentRowActions({ parent }: ParentRowActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const deleteParentMutation = useDeleteParent()

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleDelete = async () => {
    setIsOpen(false)
    if (!confirm(`Are you sure you want to delete parent ${parent.name}?`)) {
      return
    }

    try {
      await deleteParentMutation.mutateAsync(parent.id)
      toast.success(`Parent ${parent.name} deleted successfully`)
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete parent"
      toast.error(errorMsg)
    }
  }

  return (
    <div className="relative flex justify-end" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={deleteParentMutation.isPending}
        aria-label="Parent options"
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
      >
        {deleteParentMutation.isPending ? (
          <Loader2 className="size-4 animate-spin text-zinc-400" />
        ) : (
          <MoreHorizontal className="size-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-zinc-200/80 rounded-xl shadow-lg py-1.5 z-30 animate-in fade-in-50 zoom-in-95">
          <Link
            href={`/parent/${parent.id}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
          >
            <Eye className="size-3.5 text-zinc-400" />
            <span>View Profile</span>
          </Link>

          <Link
            href={`/parent/${parent.id}/edit`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
          >
            <Pencil className="size-3.5 text-zinc-400" />
            <span>Edit Parent</span>
          </Link>

          <div className="my-1 border-t border-zinc-100" />

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteParentMutation.isPending}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="size-3.5 text-rose-500" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}
