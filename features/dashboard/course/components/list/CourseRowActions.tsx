"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CourseListItem } from "../../types/course.types"
import { toast } from "sonner"

export interface CourseRowActionsProps {
  course: CourseListItem
  onDelete?: (id: string) => void
}

export function CourseRowActions({ course, onDelete }: CourseRowActionsProps) {
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
              router.push(`/courses/${course.id}`)
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left cursor-pointer"
          >
            <Eye className="size-3.5 text-zinc-400" />
            <span>View Course</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              router.push(`/courses/${course.id}/edit`)
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left cursor-pointer"
          >
            <Pencil className="size-3.5 text-zinc-400" />
            <span>Edit Course</span>
          </button>

          <div className="my-1 border-t border-zinc-100" />

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              if (onDelete) {
                onDelete(course.id)
              } else {
                toast.error("Course archived")
              }
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
          >
            <Trash2 className="size-3.5 text-rose-500" />
            <span>Delete Course</span>
          </button>
        </div>
      )}
    </div>
  )
}
