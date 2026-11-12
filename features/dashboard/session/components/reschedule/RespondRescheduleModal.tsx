"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, XCircle, X, Loader2 } from "lucide-react"
import { useRespondReschedule } from "../../hooks/useSessions"
import { RescheduleRequestItem } from "../../types/session.types"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import { useAuthStore } from "@/stores/useAuthStore"

const respondSchema = z.object({
  decision: z.enum(["Approved", "Rejected"]),
  note: z.string().optional(),
})

type RespondFormValues = z.infer<typeof respondSchema>

interface RespondRescheduleModalProps {
  isOpen: boolean
  onClose: () => void
  request: RescheduleRequestItem | null
}

export function RespondRescheduleModal({
  isOpen,
  onClose,
  request,
}: RespondRescheduleModalProps) {
  const currentUser = useAuthStore((s) => s.user)
  const respondMutation = useRespondReschedule()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<RespondFormValues>({
    resolver: zodResolver(respondSchema),
    defaultValues: {
      decision: "Approved",
      note: "",
    },
  })

  const currentDecision = watch("decision")

  if (!isOpen || !request) return null

  const onSubmit = async (values: RespondFormValues) => {
    try {
      const respondedById =
        (currentUser?._id && currentUser._id.length === 36)
          ? currentUser._id
          : "00000000-0000-0000-0000-000000000001"

      await respondMutation.mutateAsync({
        sessionId: request.sessionId,
        requestId: request.id,
        payload: {
          respondedBy: "Admin",
          respondedById,
          decision: values.decision,
          note: values.note || undefined,
        },
      })

      toast.success(
        `Reschedule request was ${values.decision.toLowerCase()} successfully.`
      )
      reset()
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Respond to Reschedule Request
            </h3>
            <p className="text-xs text-zinc-500">
              Session: {request.sessionTitle || request.sessionId.slice(0, 8)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Comparison card */}
        <div className="p-5 bg-zinc-50 border-b border-zinc-100 grid grid-cols-2 gap-4 text-xs">
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-white border border-zinc-200/60">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Original Slot
            </span>
            <span className="font-bold text-zinc-800">
              {request.originalDate || new Date(request.originalStart).toLocaleDateString()}
            </span>
            <span className="text-zinc-500 font-medium">
              {request.originalTimeSlot || new Date(request.originalStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
              Requested New Slot
            </span>
            <span className="font-bold text-zinc-900">
              {request.newDate || new Date(request.newStart).toLocaleDateString()}
            </span>
            <span className="text-amber-800 font-medium">
              {request.newTimeSlot || new Date(request.newStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Request Note */}
        {request.requestNote && (
          <div className="px-5 py-3 bg-zinc-50/50 border-b border-zinc-100 text-xs">
            <span className="font-semibold text-zinc-600">Requester Note:</span>
            <p className="text-zinc-700 italic mt-0.5">"{request.requestNote}"</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-700">Decision</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("decision", "Approved")}
                className={`h-11 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                  currentDecision === "Approved"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-2xs"
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <CheckCircle2 className="size-4" />
                <span>Approve Request</span>
              </button>

              <button
                type="button"
                onClick={() => setValue("decision", "Rejected")}
                className={`h-11 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                  currentDecision === "Rejected"
                    ? "bg-rose-50 border-rose-500 text-rose-700 shadow-2xs"
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <XCircle className="size-4" />
                <span>Reject Request</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-700">
              Response Note / Reason (Optional)
            </label>
            <textarea
              rows={3}
              {...register("note")}
              placeholder="Add an optional comment or explanation..."
              className="p-3 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || respondMutation.isPending}
              className="h-9 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || respondMutation.isPending}
              className={`h-9 px-5 rounded-xl text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                currentDecision === "Approved"
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-rose-600 hover:bg-rose-500"
              }`}
            >
              {isSubmitting || respondMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : currentDecision === "Approved" ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <XCircle className="size-4" />
              )}
              <span>Confirm {currentDecision}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

