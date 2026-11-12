"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarClock, X, Loader2, AlertCircle } from "lucide-react"
import { useRequestReschedule } from "../../hooks/useSessions"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import { useAuthStore } from "@/stores/useAuthStore"

const rescheduleSchema = z.object({
  newDate: z.string().min(1, "Please select a date"),
  newTime: z.string().min(1, "Please select a time"),
  durationMinutes: z.number().min(15, "Minimum duration is 15 minutes"),
  requestedBy: z.string().min(1, "Please specify requester role"),
  note: z.string().min(3, "Please provide a reason or note (at least 3 characters)"),
})

type RescheduleFormValues = z.infer<typeof rescheduleSchema>

interface RescheduleRequestModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  sessionTitle?: string
  currentDate?: string
  currentTime?: string
  teacherId?: string
  teacherName?: string
  studentId?: string
  studentName?: string
}

export function RescheduleRequestModal({
  isOpen,
  onClose,
  sessionId,
  sessionTitle,
  currentDate,
  currentTime,
  teacherId,
  teacherName,
  studentId,
  studentName,
}: RescheduleRequestModalProps) {
  const currentUser = useAuthStore((s) => s.user)
  const rescheduleMutation = useRequestReschedule()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RescheduleFormValues>({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: {
      newDate: "",
      newTime: "",
      durationMinutes: 60,
      requestedBy: "Admin",
      note: "",
    },
  })

  if (!isOpen) return null

  const onSubmit = async (values: RescheduleFormValues) => {
    try {
      const combinedDateTime = new Date(`${values.newDate}T${values.newTime}:00`).toISOString()
      const requestedById =
        (currentUser?._id && currentUser._id.length === 36)
          ? currentUser._id
          : "00000000-0000-0000-0000-000000000001"

      await rescheduleMutation.mutateAsync({
        sessionId,
        payload: {
          requestedBy: values.requestedBy,
          requestedById,
          requestedByName: currentUser?.fullName || "Admin",
          newStart: combinedDateTime,
          durationMinutes: values.durationMinutes,
          note: values.note,
        },
      })

      toast.success("Reschedule request submitted successfully.")
      reset()
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
              <CalendarClock className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Request Session Reschedule
              </h3>
              <p className="text-xs text-zinc-500">
                {sessionTitle || `Session ID: ${sessionId.slice(0, 8)}`}
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

        {/* Current info banner */}
        <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-100 text-xs text-zinc-600 flex flex-wrap gap-4">
          {currentDate && (
            <div>
              <span className="text-zinc-400">Current Date:</span>{" "}
              <span className="font-semibold text-zinc-800">{currentDate}</span>
            </div>
          )}
          {currentTime && (
            <div>
              <span className="text-zinc-400">Time:</span>{" "}
              <span className="font-semibold text-zinc-800">{currentTime}</span>
            </div>
          )}
          {teacherName && (
            <div>
              <span className="text-zinc-400">Teacher:</span>{" "}
              <span className="font-semibold text-zinc-800">{teacherName}</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-zinc-700">
                Proposed New Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register("newDate")}
                className="h-10 px-3.5 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
              />
              {errors.newDate && (
                <span className="text-[11px] text-rose-500">{errors.newDate.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-zinc-700">
                Proposed New Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                {...register("newTime")}
                className="h-10 px-3.5 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
              />
              {errors.newTime && (
                <span className="text-[11px] text-rose-500">{errors.newTime.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-zinc-700">
                Duration (minutes) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={15}
                step={15}
                {...register("durationMinutes", { valueAsNumber: true })}
                className="h-10 px-3.5 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
              />
              {errors.durationMinutes && (
                <span className="text-[11px] text-rose-500">{errors.durationMinutes.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-zinc-700">Requested By</label>
              <select
                {...register("requestedBy")}
                className="h-10 px-3 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-700">
              Reason / Reschedule Note <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              {...register("note")}
              placeholder="Explain why the session needs to be rescheduled..."
              className="p-3 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
            />
            {errors.note && (
              <span className="text-[11px] text-rose-500">{errors.note.message}</span>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || rescheduleMutation.isPending}
              className="h-9 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rescheduleMutation.isPending}
              className="h-9 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting || rescheduleMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CalendarClock className="size-4" />
              )}
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
