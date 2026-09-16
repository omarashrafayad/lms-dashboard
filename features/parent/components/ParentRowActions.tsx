"use client"

import * as React from "react"
import { MoreHorizontal, Eye, Pencil, UserX, Trash2 } from "lucide-react"
import Link from "next/link"
import { Parent } from "../types/parent.types"

export interface ParentRowActionsProps {
  parent: Parent
}

export function ParentRowActions({ parent }: ParentRowActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

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

  return (
    <div className="relative flex justify-end" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Parent options"
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
      >
        <MoreHorizontal className="size-4" />
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
            onClick={() => {
              setIsOpen(false)
              alert(`${parent.status === "Active" ? "Deactivate" : "Activate"} account for ${parent.name}`)
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left cursor-pointer"
          >
            <UserX className="size-3.5 text-zinc-400" />
            <span>{parent.status === "Active" ? "Deactivate" : "Activate"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              alert(`Delete parent record: ${parent.name}`)
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
          >
            <Trash2 className="size-3.5 text-rose-500" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}
