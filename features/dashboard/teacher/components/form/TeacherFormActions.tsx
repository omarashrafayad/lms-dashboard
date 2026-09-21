"use client"

import * as React from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export interface TeacherFormActionsProps {
  isSubmitting: boolean
  submitLabel?: string
  cancelHref?: string
  onCancel?: () => void
}

export function TeacherFormActions({
  isSubmitting,
  submitLabel = "Save Changes",
  cancelHref = "/teacher/teacher_list",
  onCancel,
}: TeacherFormActionsProps) {
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer shadow-2xs"
        >
          Cancel
        </button>
      ) : (
        <Link
          href={cancelHref}
          className="px-6 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer shadow-2xs"
        >
          Cancel
        </Link>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
        <span>{submitLabel}</span>
      </button>
    </div>
  )
}
