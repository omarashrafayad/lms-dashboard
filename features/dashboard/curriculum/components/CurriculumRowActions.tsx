"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CurriculumSubject } from "../types/curriculum.types"

export interface CurriculumRowActionsProps {
  subject: CurriculumSubject
  onEdit: (subject: CurriculumSubject) => void
  onDelete: (id: string) => void
}

export function CurriculumRowActions({
  subject,
  onEdit,
  onDelete,
}: CurriculumRowActionsProps) {
  const router = useRouter()
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

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
        className="size-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
        aria-label="Actions"
      >
        <MoreHorizontal className="size-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white border border-zinc-200/80 shadow-lg py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              router.push(`/curriculum/${subject.id}`)
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left cursor-pointer"
          >
            <Eye className="size-3.5 text-zinc-400" />
            <span>View Structure</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onEdit(subject)
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left cursor-pointer"
          >
            <Pencil className="size-3.5 text-zinc-400" />
            <span>Edit Subject</span>
          </button>

          <div className="h-px bg-zinc-100 my-1" />

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onDelete(subject.id)
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
          >
            <Trash2 className="size-3.5 text-red-500" />
            <span>Delete Subject</span>
          </button>
        </div>
      )}
    </div>
  )
}
