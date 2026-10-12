"use client"

import * as React from "react"
import Link from "next/link"
import { createPortal } from "react-dom"
import { MoreVertical, Eye, Pencil, Trash2, Loader2 } from "lucide-react"
import { ApiCourse } from "../../types/course.types"
import { useDeleteCourse } from "../../hooks/useCourses"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export interface CourseRowActionsProps {
  course: ApiCourse
  onDelete?: (id: string) => void
}

export function CourseRowActions({ course, onDelete }: CourseRowActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [coords, setCoords] = React.useState({ top: 0, left: 0 })
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const deleteCourseMutation = useDeleteCourse()

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: Math.max(10, rect.right + window.scrollX - 160),
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
    const displayName = course.name || course.title || "Course"
    if (!confirm(`Are you sure you want to delete course "${displayName}"?`)) {
      return
    }

    if (onDelete) {
      onDelete(course.id)
      return
    }

    try {
      await deleteCourseMutation.mutateAsync(course.id)
      toast.success(`Course "${displayName}" deleted successfully`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="relative inline-block text-right">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        disabled={deleteCourseMutation.isPending}
        title="More Options"
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
      >
        {deleteCourseMutation.isPending ? (
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
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="z-50 w-40 rounded-xl bg-white border border-zinc-200/90 shadow-lg py-1.5 animate-in fade-in zoom-in-95 duration-100"
          >
            <Link
              href={`/courses/${course.id}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <Eye className="size-3.5 text-zinc-400" />
              <span>View Course</span>
            </Link>
            <Link
              href={`/courses/${course.id}/edit`}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-left cursor-pointer"
            >
              <Pencil className="size-3.5 text-zinc-400" />
              <span>Edit Course</span>
            </Link>
            <div className="my-1 border-t border-zinc-100" />
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteCourseMutation.isPending}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="size-3.5 text-red-400" />
              <span>Delete</span>
            </button>
          </div>,
          document.body
        )}
    </div>
  )
}
