"use client"

import * as React from "react"
import Link from "next/link"
import { createPortal } from "react-dom"
import { MoreVertical, Eye, Pencil, Copy, Trash2, Loader2 } from "lucide-react"
import { ApiExam } from "../../types/exam.types"
import { useDeleteExam, useDuplicateExam } from "../../hooks/useExams"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export interface ExamRowActionsProps {
  exam: ApiExam
  onEdit?: (exam: ApiExam) => void
}

export function ExamRowActions({ exam, onEdit }: ExamRowActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [coords, setCoords] = React.useState({ top: 0, left: 0 })
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const deleteExamMutation = useDeleteExam()
  const duplicateExamMutation = useDuplicateExam()

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
    const displayName = exam.title || "Exam"
    if (!confirm(`Are you sure you want to delete exam "${displayName}"?`)) {
      return
    }

    try {
      await deleteExamMutation.mutateAsync(exam.id)
      toast.success(`Exam "${displayName}" deleted successfully`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDuplicate = async () => {
    setIsOpen(false)
    try {
      await duplicateExamMutation.mutateAsync(exam.id)
      toast.success(`Exam "${exam.title}" duplicated successfully`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const isPending =
    deleteExamMutation.isPending || duplicateExamMutation.isPending

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
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="z-50 w-44 rounded-xl bg-white border border-zinc-200/90 shadow-lg py-1.5 animate-in fade-in zoom-in-95 duration-100"
          >
            <Link
              href={`/academic/exams/${exam.slug || exam.id}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <Eye className="size-3.5 text-zinc-400" />
              <span>View Details</span>
            </Link>

            <Link
              href={`/academic/exams/${exam.slug || exam.id}/preview`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <Eye className="size-3.5 text-zinc-400" />
              <span>Student Preview</span>
            </Link>

            {onEdit ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onEdit(exam)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-left cursor-pointer"
              >
                <Pencil className="size-3.5 text-zinc-400" />
                <span>Edit Exam</span>
              </button>
            ) : (
              <Link
                href={`/academic/exams/${exam.id}/edit`}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-left cursor-pointer"
              >
                <Pencil className="size-3.5 text-zinc-400" />
                <span>Edit Exam</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleDuplicate}
              disabled={isPending}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-left cursor-pointer disabled:opacity-50"
            >
              <Copy className="size-3.5 text-zinc-400" />
              <span>Duplicate</span>
            </button>

            <div className="my-1 border-t border-zinc-100" />

            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
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
