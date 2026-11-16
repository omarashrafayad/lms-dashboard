"use client"

import * as React from "react"
import { AlertTriangle, X, Loader2 } from "lucide-react"
import { useCancelSession } from "../../hooks/useSessions"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

interface CancelSessionModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  teacherId?: string
  sessionTitle?: string
}

export function CancelSessionModal({
  isOpen,
  onClose,
  sessionId,
  teacherId,
  sessionTitle,
}: CancelSessionModalProps) {
  const cancelMutation = useCancelSession()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [customTeacherId, setCustomTeacherId] = React.useState(teacherId || "")

  React.useEffect(() => {
    if (teacherId) setCustomTeacherId(teacherId)
  }, [teacherId])

  if (!isOpen) return null

  const handleConfirmCancel = async () => {
    const effectiveTeacherId = (customTeacherId || teacherId || "").trim()
    if (!effectiveTeacherId) {
      toast.error("Teacher ID is required to cancel this session.")
      return
    }

    try {
      setIsSubmitting(true)
      await cancelMutation.mutateAsync({
        sessionId,
        payload: {
          teacherId: effectiveTeacherId,
        },
      })
      toast.success("Session cancelled successfully.")
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Cancel Session
              </h3>
              <p className="text-xs text-zinc-500">
                {sessionTitle || `Session: ${sessionId.slice(0, 8)}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3 text-xs text-zinc-600">
          <p>
            Are you sure you want to cancel this scheduled session? All booked students will be notified, and the session status will be updated to <span className="font-bold text-rose-600">Cancelled</span>.
          </p>
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400">Session ID:</span>
            <span className="font-mono font-medium text-zinc-800">{sessionId}</span>
            {teacherId ? (
              <>
                <span className="text-[11px] text-zinc-400 mt-1">Teacher ID:</span>
                <span className="font-mono font-medium text-zinc-800">{teacherId}</span>
              </>
            ) : (
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-[11px] font-semibold text-zinc-700">
                  Teacher ID (UUID) *
                </label>
                <input
                  type="text"
                  value={customTeacherId}
                  onChange={(e) => setCustomTeacherId(e.target.value)}
                  placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
                  className="h-8 px-2.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white font-mono"
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-5 pt-0 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-9 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            Keep Session
          </button>
          <button
            type="button"
            onClick={handleConfirmCancel}
            disabled={isSubmitting}
            className="h-9 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <AlertTriangle className="size-4" />
            )}
            <span>Confirm Cancellation</span>
          </button>
        </div>
      </div>
    </div>
  )
}
