"use client"

import * as React from "react"
import { RefreshCw, X, Loader2 } from "lucide-react"
import { useChangeSessionStatus } from "../../hooks/useSessions"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

interface ChangeSessionStatusModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  currentStatus?: string
  sessionTitle?: string
}

const STATUS_OPTIONS = [
  { value: "Upcoming", label: "Upcoming (قادمة)", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { value: "In Progress", label: "In Progress (جارية الآن)", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { value: "Completed", label: "Completed (مكتملة)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { value: "Missed", label: "Missed (فائتة)", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { value: "Cancelled", label: "Cancelled (ملغية)", color: "text-rose-700 bg-rose-50 border-rose-200" },
]

export function ChangeSessionStatusModal({
  isOpen,
  onClose,
  sessionId,
  currentStatus = "Upcoming",
  sessionTitle,
}: ChangeSessionStatusModalProps) {
    const user = useAuthStore().user
    console.log(user?.id)
  const [selectedStatus, setSelectedStatus] = React.useState(currentStatus)
  const changeStatusMutation = useChangeSessionStatus()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    setSelectedStatus(currentStatus)
  }, [currentStatus])

  if (!isOpen) return null

  const handleConfirmChange = async () => {
    try {
      setIsSubmitting(true)
      const adminId =
        (user?.id && user.id.length === 36)
          ? user.id
          : undefined

      await changeStatusMutation.mutateAsync({
        sessionId,
        payload: {
          status: selectedStatus,
          adminId,
          adminName: user?.fullName || "Administrator",
        },
      })
      toast.success(`Session status changed to ${selectedStatus}.`)
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
            <div className="size-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
              <RefreshCw className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Change Session Status
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

        {/* Status choices */}
        <div className="p-5 flex flex-col gap-3 text-xs">
          <span className="font-semibold text-zinc-700">Select new status:</span>
          <div className="flex flex-col gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = selectedStatus === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/50 shadow-2xs font-bold text-zinc-900"
                      : "border-zinc-200/80 hover:bg-zinc-50 text-zinc-700"
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${opt.color}`}
                  >
                    {opt.value}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-5 pt-0 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-9 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmChange}
            disabled={isSubmitting}
            className="h-9 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            <span>Update Status</span>
          </button>
        </div>
      </div>
    </div>
  )
}

