"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Pencil, XCircle } from "lucide-react"
import { SessionItem } from "../../types/session.types"
import { useCancelSession } from "../../hooks/useSessions"
import { toast } from "sonner"

export interface SessionRowActionsProps {
  session: SessionItem
}

export function SessionRowActions({ session }: SessionRowActionsProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const cancelMutation = useCancelSession()

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

  const handleCancel = async () => {
    setOpen(false)
    try {
      await cancelMutation.mutateAsync(session.id)
      toast.success(`Session ${session.sessionNumber} has been cancelled and refunded.`)
    } catch {
      toast.error("Failed to cancel session.")
    }
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
        className="size-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
        title="Actions"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white border border-zinc-200/80 shadow-lg py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              router.push(`/sessions/${session.id}`)
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left cursor-pointer"
          >
            <Eye className="size-3.5 text-zinc-400" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              router.push(`/sessions/${session.id}/edit`)
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left cursor-pointer"
          >
            <Pencil className="size-3.5 text-zinc-400" />
            <span>Edit Session</span>
          </button>

          {session.status !== "Cancelled" && (
            <>
              <div className="my-1 border-t border-zinc-100" />
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                <XCircle className="size-3.5 text-rose-500" />
                <span>Cancel Session</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
